import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Instagram icon (since lucide-react might not have it in older versions)
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// Custom Facebook icon
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

// Custom Twitter icon
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.548-11.497c0-.278-.006-.556-.018-.834A9.956 9.956 0 0024 4.57z"/>
  </svg>
);

// Custom YouTube icon
const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('🎉 Subscribed successfully!');
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-8 h-8 text-white" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                EliteRent Rwanda
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Premium car rental services in Bugesera, Nyamata. 
              Property Investment area location.
            </p>
            <div className="flex space-x-3">
              <a href="https://wa.me/250790068051" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/zodiac45" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 rounded-full transition">
                <InstagramIcon />
              </a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition">
                <FacebookIcon />
              </a>
              <a href="#" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-white transition">Our Fleet</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition">My Dashboard</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5" />
                <span>0790068051</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>isingizwekingthierry@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Bugesera, Nyamata</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <span>📍</span>
                <span>Property Investment Area</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input-field pl-10"
                  required
                />
              </div>
              <button 
                type="submit" 
                className={`btn-primary flex items-center justify-center space-x-2 transition duration-300 ${subscribed ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} EliteRent Rwanda. All rights reserved. | 
            Designed with ❤️ by <span className="text-white">Thierry</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Located in Bugesera, Nyamata | Property Investment Area
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;