import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Award, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const featuredCars = [
    {
      id: 1,
      name: "Tesla Model 3",
      price: "$89",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
      rating: 4.9,
      type: "Electric"
    },
    {
      id: 2,
      name: "BMW X5",
      price: "$120",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500",
      rating: 4.8,
      type: "Luxury SUV"
    },
    {
      id: 3,
      name: "Mercedes C-Class",
      price: "$95",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500",
      rating: 4.7,
      type: "Luxury"
    },
    {
      id: 4,
      name: "Audi Q7",
      price: "$110",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
      rating: 4.9,
      type: "SUV"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200" 
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {t('hero_title')}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars" className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-3">
              <span>{t('browse_cars')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/rent" className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3">
              <span>{t('rent_now')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('why_choose')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('wide_selection')}</h3>
              <p className="text-gray-400">{t('wide_selection_desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('full_insurance')}</h3>
              <p className="text-gray-400">{t('full_insurance_desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('support_247')}</h3>
              <p className="text-gray-400">{t('support_247_desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('best_prices')}</h3>
              <p className="text-gray-400">{t('best_prices_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('featured_vehicles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <div key={car.id} className="bg-black rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300 border border-gray-800">
                <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{car.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{car.type}</p>
                  <p className="text-2xl font-bold text-white mb-4">{car.price}<span className="text-sm text-gray-400">{t('per_day')}</span></p>
                  <Link to={`/car/${car.id}`} className="btn-secondary w-full text-center inline-block">
                    {t('view_details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/cars" className="btn-primary inline-flex items-center space-x-2">
              <span>{t('view_all_cars')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">{t('happy_customers')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">{t('luxury_cars')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400">{t('successful_rentals')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;