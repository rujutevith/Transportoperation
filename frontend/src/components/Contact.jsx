import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
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
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('contact_us')}</h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        {t('contact_subtitle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-6">{t('get_in_touch')}</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">{t('phone')}</p>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">{t('email')}</p>
                  <p className="text-gray-400">info@eliterent.com</p>
                  <p className="text-gray-400">support@eliterent.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">{t('address')}</p>
                  <p className="text-gray-400">123 Business Street</p>
                  <p className="text-gray-400">New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-semibold">{t('business_hours')}</p>
                  <p className="text-gray-400">{t('mon_fri')}</p>
                  <p className="text-gray-400">{t('sat_sun')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold mb-2">{t('emergency_support')}</h4>
              <p className="text-gray-400 text-sm">
                {t('roadside_assistance_247')}: <strong className="text-white">+1 (555) 999-8888</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 mb-2">{t('your_name')} *</label>
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
                <label className="block text-gray-300 mb-2">{t('email_address')} *</label>
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
              <label className="block text-gray-300 mb-2">{t('subject')} *</label>
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
              <label className="block text-gray-300 mb-2">{t('message')} *</label>
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
              <span>{t('send_message')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bed2c0b%3A0x349f5b5d6b5b5b5b!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
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