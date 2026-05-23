import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram, Facebook, Twitter, Linkedin, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send this to your backend
    toast.success(`Thank you ${formData.name}! We will get back to you soon.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Owner personal info
  const ownerName = 'Thierry';
  const ownerEmail = 'kingthierryi52@gmail.com';
  const ownerPhone = '+250 790 321 0519';
  const whatsappNumber = '2507903210519';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const instagramUsername = 'zodiac45';
  const instagramLink = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Contact Us</h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Have questions? We'd love to hear from you. Reach out directly or send us a message!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">Call / WhatsApp</p>
                  <p className="text-gray-400">{ownerPhone}</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-500 text-sm hover:underline">
                    Message on WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-400">{ownerEmail}</p>
                  <p className="text-gray-400 text-sm">support@eliterent.rw</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-400">Kigali, Rwanda</p>
                  <p className="text-gray-400 text-sm">KG 123 St, Kacyiru</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-gray-400">Monday - Friday: 8am - 8pm</p>
                  <p className="text-gray-400">Saturday - Sunday: 9am - 6pm</p>
                </div>
              </div>
            </div>

            {/* Owner Profile */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold mb-4">Owner & Founder</h4>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{ownerName}</p>
                  <p className="text-gray-400 text-sm">Available 24/7 for inquiries</p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a 
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-full transition duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">WhatsApp: <strong className="text-white">{ownerPhone}</strong></p>
                <p className="text-gray-400 text-sm">Instagram: <strong className="text-white">@{instagramUsername}</strong></p>
                <p className="text-gray-400 text-sm">Email: <strong className="text-white">{ownerEmail}</strong></p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold mb-2">Emergency Support</h4>
              <p className="text-gray-400 text-sm">
                24/7 roadside assistance: <strong className="text-white">{ownerPhone}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="How can we help you?"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="input-field"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.476985234324!2d30.1045513147537!3d-1.944130798602432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca76cf6852d8d%3A0xf1975a5e6cbd2245!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1699999999999!5m2!1sen!2srw"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;