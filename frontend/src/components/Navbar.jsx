import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Home, List, Menu, X, User, LogOut, LayoutDashboard, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onLoginClick }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/cars', name: 'Cars', icon: List },
    { path: '/contact', name: 'Contact', icon: Phone },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Car className="w-8 h-8 text-white group-hover:scale-110 transition duration-300" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              EliteRent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            {/* Dashboard Link */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                  location.pathname === '/dashboard'
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-gray-300 text-sm hidden lg:inline">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-gray-800 transition duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="ml-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            {!isAuthenticated && (
              <button
                onClick={onLoginClick}
                className="px-3 py-1 bg-white text-black rounded-lg font-semibold text-sm"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition duration-300 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            
            {/* Mobile Contact Info */}
            <div className="px-4 py-3 border-t border-gray-800 mt-2">
              <p className="text-gray-400 text-sm">📞 0790068051</p>
              <p className="text-gray-500 text-xs">📧 isingizwekingthierry@gmail.com</p>
              <p className="text-gray-500 text-xs">📍 Bugesera, Nyamata</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;