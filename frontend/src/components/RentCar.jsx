import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Clock, CreditCard, User, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RentCar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '',
    dropoffTime: '',
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Booking confirmed! We will contact you shortly.');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('rent_now')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rental Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">{t('rental_details')}</h2>
            
            {/* Location Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {t('location')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">{t('pickup_location')} *</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Airport, City, or Address"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('dropoff_location')} *</label>
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Same as pickup or different"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {t('date_time')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">{t('pickup_date')} *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('pickup_time')} *</label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('dropoff_date')} *</label>
                  <input
                    type="date"
                    name="dropoffDate"
                    value={formData.dropoffDate}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('dropoff_time')} *</label>
                  <input
                    type="time"
                    name="dropoffTime"
                    value={formData.dropoffTime}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                {t('personal_info')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">{t('full_name')} *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('email')} *</label>
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
                <div>
                  <label className="block text-gray-300 mb-2">{t('phone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                {t('payment_info')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">{t('card_number')} *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('expiry_date')} *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('cvv')} *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-lg">
              {t('confirm_booking')}
            </button>
          </form>
        </div>

        {/* Rental Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-4">{t('why_rent_us')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="bg-white rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-gray-300">{t('no_hidden_fees')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="bg-white rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-gray-300">{t('free_cancellation')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="bg-white rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-gray-300">{t('roadside_assistance')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="bg-white rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-gray-300">{t('full_coverage')}</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold mb-2">{t('need_help')}</h4>
              <p className="text-gray-400 text-sm">
                {t('call_support')} <strong className="text-white">+1 (555) 123-4567</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCar;