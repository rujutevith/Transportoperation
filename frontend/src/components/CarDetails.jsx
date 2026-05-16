import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Fuel, Settings, Users, Shield, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CarDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentalDays, setRentalDays] = useState(1);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`/api/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      toast.error('Failed to fetch car details');
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

  const handleRentNow = () => {
    navigate('/rent');
    toast.success('Proceed with rental booking');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!car) return null;

  const totalPrice = car.price * rentalDays;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('back')}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Image */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <img 
            src={car.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"} 
            alt={`${car.brand} ${car.model}`}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Car Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.brand} {car.model}</h1>
          <p className="text-gray-400 mb-4">{car.year}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <span className="text-gray-400 ml-2">(24 {t('reviews')})</span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center space-x-2 text-gray-300">
                <Fuel className="w-5 h-5" />
                <span>{t('fuel')}</span>
              </div>
              <span className="font-semibold">{car.fuel_type || t('petrol')}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center space-x-2 text-gray-300">
                <Settings className="w-5 h-5" />
                <span>{t('transmission')}</span>
              </div>
              <span className="font-semibold">{car.transmission || 'Automatic'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center space-x-2 text-gray-300">
                <Users className="w-5 h-5" />
                <span>{t('seats')}</span>
              </div>
              <span className="font-semibold">5 {t('seats')}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>Year</span>
              </div>
              <span className="font-semibold">{car.year}</span>
            </div>
            {car.color && (
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-300">Color</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-5 h-5 rounded-full border border-gray-600" 
                    style={{ backgroundColor: car.color.toLowerCase() }}
                  ></div>
                  <span>{car.color}</span>
                </div>
              </div>
            )}
          </div>

          {/* Rental Calculator */}
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">{t('rental_details')}</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">{t('daily_rate')}</span>
              <span className="text-2xl font-bold">${car.price}</span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">{t('number_of_days')}</label>
              <input
                type="number"
                min="1"
                value={rentalDays}
                onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-field"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <span className="text-lg font-semibold">{t('total_price')}</span>
              <span className="text-2xl font-bold text-white">${totalPrice}</span>
            </div>
          </div>

          <button onClick={handleRentNow} className="btn-primary w-full py-3 text-lg">
            {t('rent_this_car')}
          </button>

          {/* Features */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">{t('free_cancellation_text')}</span>
            </div>
            <div className="flex items-center space-x-2 text-green-500">
              <Shield className="w-5 h-5" />
              <span className="text-sm">{t('full_insurance')}</span>
            </div>
            <div className="flex items-center space-x-2 text-green-500">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{t('support_247')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Star = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export default CarDetails;