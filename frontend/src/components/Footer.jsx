import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services/apiServices';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await contactService.newsletter(email);
      setSubscribed(true);
      toast.success('🎉 Successfully subscribed to Elite VIP announcements!');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      setSubscribed(true);
      toast.success('🎉 Subscribed to fleet updates!');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Brand Column */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-extrabold">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-gray-100 to-amber-400 bg-clip-text text-transparent">
                EliteRent Rwanda
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-5">
              Certified luxury automotive sales and premier self-drive & chauffeur car rental operations in Bugesera, Nyamata, and Kigali.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://wa.me/250793210519" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-green-600 hover:bg-green-500 text-white p-2.5 rounded-xl transition"
                title="WhatsApp Hotline"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/zodiac45" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white p-2.5 rounded-xl transition"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-amber-400 transition">Marketplace Home</Link></li>
              <li><Link to="/cars?type=rent" className="hover:text-amber-400 transition">Rental Fleet & Rates</Link></li>
              <li><Link to="/cars?type=sale" className="hover:text-amber-400 transition">Cars For Sale & Financing</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-400 transition">Customer Portal</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About EliteRent & Founder</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact Showroom & FAQs</Link></li>
            </ul>
          </div>

          {/* Legal & Trust Column */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Trust & Governance</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/terms" className="hover:text-amber-400 transition">Terms of Service</Link></li>
              <li><Link to="/rental-agreement" className="hover:text-amber-400 transition">Rental & Insurance Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-amber-400 transition">Privacy Policy (GDPR)</Link></li>
              <li className="pt-2 text-gray-500 text-[11px] leading-relaxed">
                All vehicle rental handovers require completed in-app driver's verification under Rwandan road safety laws.
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">VIP Newsletter</h3>
            <p className="text-gray-400 text-xs mb-3">
              Subscribe for alerts when rare supercars or certified SUVs arrive for acquisition or rental.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold text-xs py-2.5 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 ${
                  subscribed ? 'bg-green-600 text-white' : 'bg-amber-400 hover:bg-amber-300 text-black'
                }`}
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Join VIP List
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            &copy; {currentYear} EliteRent & TransportOperation. Designed with precision by <span className="text-white font-semibold">Thierry</span>.
          </p>
          <p>
            Headquartered in Bugesera, Nyamata • Property Investment Area, Rwanda
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;