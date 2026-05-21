import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';  // ✅ IMPORT TOAST HERE
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Cars from './components/Cars';
import RentCar from './components/RentCar';
import About from './components/About';
import Contact from './components/Contact';
import CarDetails from './components/CarDetails';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import LoginModal from './components/LoginModal';
import api from './config/axios';

// Connection Status Component
const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://transportoperation-1.onrender.com';
        const response = await fetch(`${API_URL}/health`);
        
        if (response.ok) {
          setStatus('connected');
          setMessage('✅ Backend connected successfully');
        } else {
          setStatus('error');
          setMessage('⚠️ Backend responded but status unhealthy');
        }
      } catch (error) {
        setStatus('error');
        setMessage('❌ Cannot connect to backend');
        console.error('Backend connection error:', error);
      }
    };
    checkConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
        🔄 Connecting to backend...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
        {message}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
      {message}
    </div>
  );
};

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/rent" element={<RentCar />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Home />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Home />} />
        </Routes>
      </main>
      <Footer />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <ConnectionStatus />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;