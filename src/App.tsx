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
import { ModalHost } from './components/ModalHost';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
    const initializeAuth = useAuthStore((state) => state.initialize);
    const initializePlaces = usePlacesStore((state) => state.initialize);

    // #region agent log
    fetch('http://127.0.0.1:7842/ingest/41b987d8-ba2a-4128-b946-11e5f4a4f935',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb284e'},body:JSON.stringify({sessionId:'cb284e',location:'App.tsx:render',message:'App component rendering',data:{},timestamp:Date.now(),hypothesisId:'H2',runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    useEffect(() => {
        initializeAuth();
        initializePlaces();
    }, [initializeAuth, initializePlaces]);

    return (
        <BrowserRouter>
            <MouseTrail />
            <CatMascot />
            <Navbar />
            <ModalHost />
            <ToastProvider />
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
