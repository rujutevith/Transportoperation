import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Cars from './components/Cars';
import CarDetails from './components/CarDetails';
import LoginModal from './components/LoginModal';
import CustomerDashboard from './components/CustomerDashboard';
import DealerDashboard from './components/DealerDashboard';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import TermsOfService from './components/legal/TermsOfService';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import RentalAgreement from './components/legal/RentalAgreement';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isDealer = user?.role === 'dealer' || isAdmin;

  return (
    <div className="min-h-screen bg-black flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      <main className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Legal Pages */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/rental-agreement" element={<RentalAgreement />} />

          {/* Redirects for legacy routes */}
          <Route path="/rent" element={<Navigate to="/cars?type=rent" replace />} />
          <Route path="/rent/:id" element={<Navigate to="/car/:id" replace />} />

          {/* Customer Dashboard */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <CustomerDashboard /> : <Navigate to="/" replace />} 
          />

          {/* Dealer Dashboard */}
          <Route 
            path="/dealer" 
            element={isDealer ? <DealerDashboard /> : <Navigate to="/" replace />} 
          />

          {/* Admin Panel with built-in master gateway */}
          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#09090b',
            color: '#fff',
            border: '1px solid #27272a',
            borderRadius: '14px',
            fontSize: '13px'
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