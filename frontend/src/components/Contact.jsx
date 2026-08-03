import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Social Media Icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.548-11.497c0-.278-.006-.556-.018-.834A9.956 9.956 0 0024 4.57z"/>
  </svg>
);

const Contact = () => {
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
    toast.success(`Thank you ${formData.name}! We will get back to you soon.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const whatsappNumber = '250790068051';
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
                  <p className="text-gray-400">0790068051</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-500 text-sm hover:underline">
                    Message on WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-400">isingizwekingthierry@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-gray-400">Bugesera, Nyamata</p>
                  <p className="text-gray-400 text-sm">Property Investment Area</p>
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
                  <InstagramIcon />
                </a>
                <a 
                  href="#"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-300"
                >
                  <FacebookIcon />
                </a>
                <a 
                  href="#"
                  className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full transition duration-300"
                >
                  <TwitterIcon />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">WhatsApp: <strong className="text-white">0790068051</strong></p>
                <p className="text-gray-400 text-sm">Instagram: <strong className="text-white">@zodiac45</strong></p>
                <p className="text-gray-400 text-sm">Email: <strong className="text-white">isingizwekingthierry@gmail.com</strong></p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold mb-2">Emergency Support</h4>
              <p className="text-gray-400 text-sm">
                24/7 roadside assistance: <strong className="text-white">0790068051</strong>
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