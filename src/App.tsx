import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';
import { CatMascot } from './components/CatMascot';
import { MouseTrail } from './components/MouseTrail';
import { useAuthStore } from './stores/authStore';
import { usePlacesStore } from './stores/placesStore';

function App() {
    const initializeAuth = useAuthStore((state) => state.initialize);
    const initializePlaces = usePlacesStore((state) => state.initialize);

    useEffect(() => {
        initializeAuth();
        initializePlaces();
    }, [initializeAuth, initializePlaces]);

    return (
        <BrowserRouter>
            <MouseTrail />
            <CatMascot />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
