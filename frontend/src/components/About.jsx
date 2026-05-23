import React from 'react';
import { Users, Target, Heart, Globe, Award, Clock, Mail, Phone, MapPin, User, Instagram, MessageCircle } from 'lucide-react';

const About = () => {
  // Owner personal info
  const ownerName = 'Thierry';
  const ownerEmail = 'kingthierryi52@gmail.com';
  const ownerPhone = '+250 790 321 0519';
  const whatsappLink = `https://wa.me/2507903210519`;
  const instagramLink = `https://instagram.com/zodiac45`;

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EliteRent Rwanda</h1>
          <p className="text-xl text-gray-300">Your Trusted Car Rental Partner Since 2024</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Owner Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 bg-gray-900 rounded-xl p-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{ownerName}</h2>
          <p className="text-blue-400 mb-4">Founder & CEO</p>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Passionate about providing exceptional car rental experiences. 
            With a vision to make luxury and comfort accessible to everyone in Rwanda and beyond.
          </p>
          <div className="flex justify-center space-x-4">
            <a href={`mailto:${ownerEmail}`} className="text-gray-400 hover:text-white flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Email Me</span>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 flex items-center space-x-2">
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
          </div>
          <div className="mt-4 text-gray-500 text-sm">
            <p>📧 {ownerEmail}</p>
            <p>📞 {ownerPhone}</p>
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

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-400 mb-6">
            Reach out directly to {ownerName} for any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`mailto:${ownerEmail}`} className="btn-primary inline-flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Email {ownerName}</span>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Me</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;