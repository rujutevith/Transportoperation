import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, MessageCircle, Instagram, Facebook, Twitter, Linkedin, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const whatsappNumber = '2507903210519';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const instagramUsername = 'zodiac45';
  const instagramLink = `https://instagram.com/${instagramUsername}`;
  
  // Owner personal info
  const ownerName = 'Thierry';
  const ownerEmail = 'kingthierryi52@gmail.com';
  const ownerPhone = '+250 790 321 0519';

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
              Experience the best vehicles with exceptional service.
            </p>
            <div className="flex space-x-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 rounded-full transition duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#"
                className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full transition duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-white transition duration-300">Our Fleet</Link></li>
              <li><Link to="/rent" className="text-gray-400 hover:text-white transition duration-300">Rent a Car</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-white transition duration-300">My Profile</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5" />
                <span>{ownerPhone}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span>WhatsApp: {ownerPhone}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>{ownerEmail}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>

          {/* Owner Profile */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Owner</h3>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{ownerName}</p>
                  <p className="text-gray-400 text-sm">Founder & CEO</p>
                </div>
              </div>
              <div className="space-y-2">
                <a href={`mailto:${ownerEmail}`} className="text-gray-400 hover:text-white text-sm flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{ownerEmail}</span>
                </a>
                <a href={`tel:${ownerPhone}`} className="text-gray-400 hover:text-white text-sm flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{ownerPhone}</span>
                </a>
                <a 
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 text-sm flex items-center space-x-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{instagramUsername}</span>
                </a>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers and updates!
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="input-field"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} EliteRent Rwanda. All rights reserved. | 
            Designed with ❤️ by {ownerName} | 
            <a href="#" className="hover:text-white ml-2">Privacy Policy</a> | 
            <a href="#" className="hover:text-white ml-2">Terms of Service</a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Contact: {ownerEmail} | Phone: {ownerPhone}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;