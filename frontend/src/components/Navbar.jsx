import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, Home, List, Menu, X, User, LogOut, LayoutDashboard, 
  Phone, Info, Briefcase, KeyRound, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onLoginClick }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isDealer = user?.role === 'dealer' || isAdmin;

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/cars', name: 'Fleet & Sales', icon: List },
    { path: '/about', name: 'About Us', icon: Info },
    { path: '/contact', name: 'Contact & FAQs', icon: Phone },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black group-hover:scale-105 transition">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-amber-400 bg-clip-text text-transparent block leading-tight">
                EliteRent
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block -mt-1 font-semibold">
                Rwanda • Sales & Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-black shadow'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            {/* Dashboard Links */}
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 ${
                    location.pathname === '/dashboard'
                      ? 'bg-amber-400 text-black shadow'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </Link>

                {isDealer && (
                  <Link
                    to="/dealer"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 ${
                      location.pathname === '/dealer'
                        ? 'bg-amber-400 text-black shadow'
                        : 'text-amber-400 hover:bg-amber-400/10'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Dealer Hub</span>
                  </Link>
                )}
              </>
            )}
            
            {/* User Account Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-800">
                <span className="text-gray-300 text-xs font-semibold">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-bold transition duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="ml-3 px-5 py-2 bg-amber-400 text-black rounded-xl font-extrabold text-xs hover:bg-amber-300 transition duration-200 shadow"
              >
                Sign In / Join
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            {!isAuthenticated && (
              <button
                onClick={onLoginClick}
                className="px-3.5 py-1.5 bg-amber-400 text-black rounded-xl font-bold text-xs"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-lg bg-gray-900 border border-gray-800"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-800 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold ${
                    isActive ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:bg-gray-900"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>

                {isDealer && (
                  <Link
                    to="/dealer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-400 hover:bg-gray-900"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Dealer Hub</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-gray-900 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-500 px-4">
              <p>📍 Bugesera, Nyamata • Rwanda</p>
              <p>📞 0793210519 (24/7 Hotline)</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;