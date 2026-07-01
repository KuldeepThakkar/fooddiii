import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import { Place } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface PlaceMapProps {
    places: Place[];
    userLocation: { lat: number; lng: number } | null;
    range?: number; // Search range in km
    selectedPlaceId?: string;
    onLocationSet?: (lat: number, lng: number) => void;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

function LocationMarker({ onLocationSet }: { onLocationSet?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (onLocationSet) {
                onLocationSet(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

// Helper to check if open
const isPlaceOpen = (place: Place) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = place.openTime.split(':').map(Number);
    const [closeH, closeM] = place.closeTime.split(':').map(Number);
    const start = openH * 60 + openM;
    const end = closeH * 60 + closeM;

    if (end < start) {
        return currentMinutes >= start || currentMinutes <= end;
    } else {
        return currentMinutes >= start && currentMinutes <= end;
    }
};

const getPlaceEmoji = (type: string) => {
    const typeEmoji: Record<string, string> = {
        'Fast Food': '🍔',
        'Restaurant': '🍕',
        'Cafe': '☕',
        'Dessert': '🍦',
        'Street Food': '🥪'
    };
    return typeEmoji[type] || '📍';
};

// Create a function to generate a custom "pop out" icon
const createPopOutIcon = (place: Place) => {
    const isOpen = isPlaceOpen(place);
    const emoji = getPlaceEmoji(place.type);
    const size = isOpen ? 60 : 45; // XL Scaling!
    const color = isOpen ? '#22c55e' : '#ef4444';

    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="${isOpen ? 'marker-open' : 'marker-closed'}" 
                 style="
                    background: ${color}; 
                    width: ${size}px; 
                    height: ${size}px; 
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                 ">
                <span style="transform: rotate(45deg); font-size: ${isOpen ? '28px' : '22px'};">${emoji}</span>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
    });
};

export function PlaceMap({ places, userLocation, range, onLocationSet }: PlaceMapProps) {
    const center = userLocation || { lat: 23.0272, lng: 72.5015 }; // Default to Iskcon Ahmedabad

    return (
        <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl z-0 relative border-4 border-white">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <LocationMarker onLocationSet={onLocationSet} />

                {userLocation && (
                    <>
                        <Marker
                            position={[userLocation.lat, userLocation.lng]}
                            icon={L.divIcon({
                                className: 'user-location-marker',
                                html: `<div style="background: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #3b82f6;"></div>`,
                                iconSize: [15, 15]
                            })}
                        >
                            <Popup>You are here!</Popup>
                        </Marker>
                        {range && (
                            <Circle
                                center={[userLocation.lat, userLocation.lng]}
                                radius={range * 1000}
                                pathOptions={{
                                    fillColor: '#fb923c',
                                    fillOpacity: 0.1,
                                    color: '#fb923c',
                                    weight: 1,
                                    dashArray: '5, 10'
                                }}
                            />
                        )}
                        <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                    </>
                )}

                {places.map(place => (
                    place.lat && place.lng ? (
                        <Marker
                            key={place.id}
                            position={[place.lat, place.lng]}
                            icon={createPopOutIcon(place)}
                        >
                            <Popup>
                                <div className="min-w-[180px] p-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 leading-tight">{place.name}</h3>
                                        <span className="text-xl">
                                            {isPlaceOpen(place) ? getPlaceEmoji(place.type) : '❌'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-orange-600 bg-orange-50 inline-block px-2 py-0.5 rounded-full mb-2">{place.type}</p>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${isPlaceOpen(place) ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className={`text-xs font-bold ${isPlaceOpen(place) ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPlaceOpen(place) ? 'OPEN NOW' : 'CLOSED'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mb-1">"{place.description}"</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{place.openTime} - {place.closeTime}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}
