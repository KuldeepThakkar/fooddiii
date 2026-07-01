import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { CatMascot } from './components/CatMascot';
import { MouseTrail } from './components/MouseTrail';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <MouseTrail />
                <CatMascot />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
