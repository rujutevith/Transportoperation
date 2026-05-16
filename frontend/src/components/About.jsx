import React from 'react';
import { Users, Target, Heart, Globe, Award, Clock } from 'lucide-react';
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about_us')}</h1>
          <p className="text-xl text-gray-300">Your Trusted Car Rental Partner Since 2020</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mission Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('our_mission')}</h2>
          <p className="text-gray-300 text-lg">
            {t('mission_text')}
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('our_values')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('customer_first')}</h3>
              <p className="text-gray-400">{t('customer_first_desc')}</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('quality_service')}</h3>
              <p className="text-gray-400">{t('quality_service_desc')}</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('passion_cars')}</h3>
              <p className="text-gray-400">{t('passion_cars_desc')}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">{t('happy_customers')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">{t('luxury_cars')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400">{t('successful_rentals')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">{t('support_247')}</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">{t('our_team')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/men/1.jpg" 
                alt="CEO"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">John Smith</h3>
              <p className="text-gray-400">CEO & Founder</p>
            </div>
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/women/1.jpg" 
                alt="Operations"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-gray-400">Operations Director</p>
            </div>
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/men/2.jpg" 
                alt="Customer Service"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">Mike Williams</h3>
              <p className="text-gray-400">Customer Service Lead</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;