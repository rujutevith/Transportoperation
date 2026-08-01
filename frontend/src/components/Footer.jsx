import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, MessageCircle, Instagram, Facebook, Twitter, User, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
    toast.success('🎉 Subscribed successfully! You\'ll receive our latest updates.');
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
              Your premier destination for luxury car rentals in Kigali, Rwanda.
            </p>
            <div className="flex space-x-3">
              <a href="https://wa.me/2507903210519" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/zodiac45" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 rounded-full transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full transition">
                <Twitter className="w-5 h-5" />
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
              <li><Link to="/admin" className="text-gray-400 hover:text-white transition">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5" />
                <span>+250 790 321 0519</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>kingthierryi52@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers and updates!
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;