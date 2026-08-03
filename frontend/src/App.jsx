import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Cars from './components/Cars';
import CarDetails from './components/CarDetails';
import LoginModal from './components/LoginModal';
import CustomerDashboard from './components/CustomerDashboard';
import Contact from './components/Contact';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/dashboard" element={isAuthenticated ? <CustomerDashboard /> : <Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;