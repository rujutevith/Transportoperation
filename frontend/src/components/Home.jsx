import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Award, ArrowRight, Star, Phone, Mail, Users, MapPin, ChevronRight, Play, Calendar, DollarSign, Fuel, Settings, Wifi, Coffee, Music, Snowflake } from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
      title: "Drive Your Dream Car",
      subtitle: "Experience luxury and performance with our premium fleet"
    },
    {
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200",
      title: "Luxury at Your Fingertips",
      subtitle: "Choose from our exclusive collection of high-end vehicles"
    },
    {
      image: "https://images.unsplash.com/photo-1503376780355-22e5c73c7fb3?w=1200",
      title: "The Ultimate Driving Experience",
      subtitle: "Premium cars, exceptional service, unforgettable journeys"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredCars = [
    {
      id: 30001,
      name: "Lamborghini Revuelto",
      price: "$1,850",
      image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=500",
      rating: 4.9,
      type: "Hybrid Supercar",
      specs: "V12 Hybrid, 1001 HP"
    },
    {
      id: 30002,
      name: "Ferrari SF90 Stradale",
      price: "$1,850",
      image: "https://images.unsplash.com/photo-1592198084033-6a3ac6e3fea3?w=500",
      rating: 4.9,
      type: "Hybrid Supercar",
      specs: "V8 Hybrid, 986 HP"
    },
    {
      id: 30003,
      name: "Rolls Royce Phantom",
      price: "$2,500",
      image: "https://images.unsplash.com/photo-1631295868223-63228b10f8a5?w=500",
      rating: 4.9,
      type: "Luxury Sedan",
      specs: "V12, 563 HP"
    },
    {
      id: 30004,
      name: "Porsche 911 Turbo S",
      price: "$850",
      image: "https://images.unsplash.com/photo-1503376780355-22e5c73c7fb3?w=500",
      rating: 4.8,
      type: "Sports Car",
      specs: "Flat-6, 640 HP"
    }
  ];

  const features = [
    { icon: Car, title: "Luxury Fleet", desc: "Premium cars from top brands worldwide" },
    { icon: Shield, title: "Full Insurance", desc: "Comprehensive coverage for peace of mind" },
    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
    { icon: Award, title: "Best Prices", desc: "Competitive rates with no hidden fees" }
  ];

  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Coffee, label: "Refreshments" },
    { icon: Music, label: "Premium Sound" },
    { icon: Snowflake, label: "Climate Control" }
  ];

  return (
    <div>
      {/* Hero Section with Slideshow */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Link to="/cars" className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-3 group">
              <span>Browse Fleet</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/cars" className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3">
              <span>Rent Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-y border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-gray-400 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">25+</p>
              <p className="text-gray-400 text-sm">Luxury Cars</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1000+</p>
              <p className="text-gray-400 text-sm">Successful Rentals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-gray-400 text-sm">Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose EliteRent?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Experience the difference with our premium car rental service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 hover:shadow-2xl transition duration-300 group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Vehicles</h2>
              <p className="text-gray-400 mt-2">Our most exclusive cars available for rent</p>
            </div>
            <Link to="/cars" className="text-white hover:text-gray-300 flex items-center gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <div key={car.id} className="bg-black rounded-xl overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-gray-800 group">
                <div className="relative overflow-hidden">
                  <img src={car.image} alt={car.name} className="w-full h-56 object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-xs text-white">
                    {car.rating} ★
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <p className="text-gray-400 text-sm">{car.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{car.specs}</p>
                  <p className="text-2xl font-bold text-white mt-3">{car.price}<span className="text-sm text-gray-400">/day</span></p>
                  <Link to={`/car/${car.id}`} className="btn-secondary w-full text-center inline-block mt-4 group-hover:bg-white group-hover:text-black transition duration-300">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 bg-gray-900/50 p-4 rounded-lg hover:bg-gray-900 transition">
                <item.icon className="w-5 h-5 text-white" />
                <span className="text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 mb-8">
            Get exclusive offers, new car alerts, and special discounts directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <Phone className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Call Us</h3>
              <p className="text-gray-400">+250 790 321 0519</p>
              <p className="text-gray-500 text-sm">Available 24/7</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <Mail className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Email Us</h3>
              <p className="text-gray-400">kingthierryi52@gmail.com</p>
              <p className="text-gray-500 text-sm">We reply within 24h</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <MapPin className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Visit Us</h3>
              <p className="text-gray-400">Kigali, Rwanda</p>
              <p className="text-gray-500 text-sm">Mon-Sat 8am-8pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;