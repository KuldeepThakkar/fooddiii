import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (coordinates: [number, number]) => void;
  initialCoordinates?: [number, number];
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (coordinates: [number, number]) => void }) {
  const [message, setMessage] = useState('');

  useMapEvents({
    dblclick(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      onLocationSelect(coords);
      setMessage(`Pin moved to [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`);
      setTimeout(() => setMessage(''), 3000);
    },
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      onLocationSelect(coords);
    },
  });

  if (message) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#004F30] text-white px-4 py-2 rounded-lg shadow-lg z-[1000] text-sm font-semibold">
        {message}
      </div>
    );
  }
  return null;
}

const createPinIcon = () => {
  return L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="
        background: #DC143C;
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <div style="transform: rotate(45deg); width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

export function MapPickerModal({ isOpen, onClose, onLocationSelect, initialCoordinates = [23.0225, 72.5714] }: MapPickerModalProps) {
  const [coordinates, setCoordinates] = useState<[number, number]>(initialCoordinates);

  if (!isOpen) return null;

  const handleLocationSelect = (coords: [number, number]) => {
    setCoordinates(coords);
    onLocationSelect(coords);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#004F30] to-emerald-800">
          <div>
            <h2 className="text-white font-black text-lg">Pick Location on Map</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Click to place pin, double-click to move</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Close map picker"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map */}
        <div className="h-[500px] w-full relative">
          <MapContainer
            center={coordinates}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={coordinates} icon={createPinIcon()} />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-semibold">Selected:</span> [{coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}]
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#004F30] text-white text-sm font-bold hover:bg-[#005C39] transition-colors"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
