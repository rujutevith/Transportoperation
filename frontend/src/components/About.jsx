import React from 'react';
import { Users, Target, Heart, Globe, Award, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200" 
            alt="About Us"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EliteRent</h1>
          <p className="text-xl text-gray-300">Your Trusted Car Rental Partner Since 2024</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Owner Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 bg-gray-900 rounded-xl p-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-white">T</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Thierry</h2>
          <p className="text-blue-400 mb-4">Founder & CEO</p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Passionate about providing exceptional car rental experiences. 
            With a vision to make luxury and comfort accessible to everyone in Rwanda and beyond.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <a href="mailto:thierry@eliterent.com" className="text-gray-400 hover:text-white">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/zodiac45" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg">
            To provide exceptional car rental experiences through quality vehicles, 
            transparent pricing, and outstanding customer service. We strive to make 
            luxury and convenience accessible to everyone in Rwanda.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-gray-400">Your satisfaction is our top priority</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
              <p className="text-gray-400">Maintaining the highest standards</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion for Cars</h3>
              <p className="text-gray-400">Loving what we do every day</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Standards</h3>
              <p className="text-gray-400">International quality service</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-gray-400">Luxury Cars</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400">Successful Rentals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Instagram import
const Instagram = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default About;