import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
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