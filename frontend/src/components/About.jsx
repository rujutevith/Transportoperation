import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Globe, Award, Clock, Mail, Phone, MapPin, User, MessageCircle, Shield, ArrowRight } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const About = () => {
  const ownerName = 'Thierry';
  const ownerEmail = 'isingizwekingthierry@gmail.com';
  const ownerPhone = '+250 790 068 051';
  const whatsappLink = `https://wa.me/250790068051`;
  const instagramLink = `https://instagram.com/zodiac45`;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80" 
            alt="About EliteRent"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Our Heritage & Vision</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mt-2 mb-3">About EliteRent Rwanda</h1>
          <p className="text-base text-gray-300">
            Rwanda's Premier Dual-Purpose Automotive Sales & VIP Rental Platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Founder Card */}
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 border border-gray-800 rounded-3xl p-8 sm:p-12 text-center mb-16 shadow-2xl">
          <div className="w-28 h-28 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-black">
            <User className="w-14 h-14" />
          </div>
          <h2 className="text-3xl font-extrabold mb-1">{ownerName}</h2>
          <p className="text-amber-400 font-semibold text-xs uppercase tracking-wider mb-4">Founder & Operations Director</p>
          <p className="text-gray-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed mb-8">
            "TransportOperation and EliteRent were born out of a vision to elevate Rwanda's mobility standards. 
            From the bustling economic landscape of Kigali to the rising property investment corridors of Bugesera and Nyamata, 
            we provide seamless access to certified supercars, executive VIP sedans, and African road champions."
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href={`mailto:${ownerEmail}`} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Email Founder</span>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition">
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp</span>
            </a>
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition">
              <InstagramIcon />
              <span>@zodiac45</span>
            </a>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-2">Our Mission</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              To deliver uncompromising vehicle reliability, transparent sales transactions, and personalized luxury rental experiences in East Africa.
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-2">Trust & Integrity</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every vehicle in our showroom is physically inspected, certified for ownership transfer, or maintained under strict factory service schedules.
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-2">Local & Global Standard</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Headquartered in Bugesera, Nyamata, with international standard service protocols for foreign investors, tourists, and Rwandan residents.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Experience EliteRent?</h2>
          <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
            Browse our full catalog of rental models and vehicles for sale with instant booking confirmation.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/cars?type=rent" className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition">
              Rent a Car
            </Link>
            <Link to="/cars?type=sale" className="bg-white hover:bg-gray-200 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition">
              Buy a Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;