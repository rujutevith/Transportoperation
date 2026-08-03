import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Shield, Clock, Award, ArrowRight, Star, 
  Phone, Mail, MapPin, ChevronRight, Wifi, Coffee, 
  Music, Snowflake, Sparkles, Users 
} from 'lucide-react';

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

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // HERO SLIDES
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
      title: "Premium Car Rentals",
      subtitle: "Experience Luxury & Elegance",
      description: "Discover our exclusive fleet of premium vehicles for an unforgettable journey",
      badge: "🌟 Elite Collection"
    },
    {
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
      title: "Ferrari F8 Tributo",
      subtitle: "Sports Car Excellence",
      description: "Feel the power of 710 HP in this stunning Ferrari",
      badge: "🏎️ Sports Car"
    },
    {
      image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",
      title: "Lamborghini Huracan",
      subtitle: "Supercar Performance",
      description: "640 HP of pure Italian engineering perfection",
      badge: "💛 Supercar"
    },
    {
      image: "https://images.unsplash.com/photo-1631295868223-63228b10f8a5?w=1200&q=80",
      title: "Rolls Royce Phantom",
      subtitle: "Ultimate Luxury",
      description: "Travel in absolute comfort and style with the world's finest sedan",
      badge: "👑 Luxury Sedan"
    },
    {
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
      title: "Luxury SUVs",
      subtitle: "Power & Comfort",
      description: "Perfect blend of performance and elegance in our premium SUVs",
      badge: "🚙 Premium SUVs"
    },
    {
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
      title: "Chauffeur Service",
      subtitle: "Professional & Discreet",
      description: "Sit back and relax while our expert drivers take you anywhere in luxury",
      badge: "👔 VIP Service"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // FEATURED CARS - 8 UNIQUE CARS (REMOVED Porsche 911 GT3 and Bentley)
  const featuredCars = [
    {
      id: 1,
      name: "Ferrari F8 Tributo",
      price: "$850",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80",
      rating: 4.9,
      type: "Sports Car",
      specs: "V8, 710 HP"
    },
    {
      id: 2,
      name: "Lamborghini Huracan",
      price: "$950",
      image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=500&q=80",
      rating: 4.9,
      type: "Supercar",
      specs: "V10, 640 HP"
    },
    {
      id: 3,
      name: "Rolls Royce Ghost",
      price: "$1,600",
      image: "https://images.unsplash.com/photo-1631295868223-63228b10f8a5?w=500&q=80",
      rating: 4.9,
      type: "Luxury Sedan",
      specs: "V12, 563 HP"
    },
    {
      id: 4,
      name: "McLaren 720S",
      price: "$1,650",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80",
      rating: 4.9,
      type: "Supercar",
      specs: "V8, 710 HP"
    },
    {
      id: 5,
      name: "Mercedes AMG GT",
      price: "$750",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&q=80",
      rating: 4.8,
      type: "Sports Car",
      specs: "V8, 630 HP"
    },
    {
      id: 6,
      name: "Aston Martin DBS",
      price: "$1,800",
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&q=80",
      rating: 4.9,
      type: "Grand Tourer",
      specs: "V12, 715 HP"
    },
    {
      id: 7,
      name: "Audi R8",
      price: "$720",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80",
      rating: 4.7,
      type: "Sports Car",
      specs: "V10, 602 HP"
    },
    {
      id: 8,
      name: "BMW M8 Competition",
      price: "$680",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80",
      rating: 4.7,
      type: "Luxury Coupe",
      specs: "V8, 617 HP"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
          </div>
        ))}
        
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <span className="bg-white/10 backdrop-blur-lg text-white px-6 py-2 rounded-full text-sm font-medium border border-white/20">
            {heroSlides[currentSlide].badge}
          </span>
        </div>

        <button 
          onClick={prevSlide}
          className="absolute left-4 z-20 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 z-20 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-10 h-2 bg-white rounded-full' 
                  : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in">
            {heroSlides[currentSlide].title}
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white/90 animate-fade-in-delay">
            {heroSlides[currentSlide].subtitle}
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay max-w-2xl mx-auto">
            {heroSlides[currentSlide].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Link to="/cars" className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-3 group">
              <span>Browse Fleet</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/cars" className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3 group">
              <span>Rent Now</span>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-y border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="animate-pulse">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-gray-400 text-sm">Happy Customers</p>
            </div>
            <div className="animate-pulse delay-100">
              <p className="text-2xl font-bold text-white">25+</p>
              <p className="text-gray-400 text-sm">Luxury Cars</p>
            </div>
            <div className="animate-pulse delay-200">
              <p className="text-2xl font-bold text-white">1000+</p>
              <p className="text-gray-400 text-sm">Successful Rentals</p>
            </div>
            <div className="animate-pulse delay-300">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-gray-400 text-sm">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose EliteRent?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Experience luxury, comfort, and reliability with Rwanda's premier car rental service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300 group">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Car className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-400">Top luxury cars from world brands</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300 group">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Insurance</h3>
              <p className="text-gray-400">Complete coverage for peace of mind</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300 group">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">Always here to assist you</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300 group">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-400">Competitive rates, no hidden fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars - 8 Unique Cars */}
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
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-56 object-cover group-hover:scale-110 transition duration-500" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80";
                    }}
                  />
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

      {/* Premium Services Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Premium Services</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We offer professional chauffeur and self-drive options to suit your needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8 text-center hover:transform hover:scale-105 transition duration-300">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Self-Drive</h3>
              <p className="text-gray-400">
                Drive yourself with our luxury cars. Flexible rental periods, 
                competitive rates, and full insurance coverage.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-8 text-center hover:transform hover:scale-105 transition duration-300">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Chauffeur Service</h3>
              <p className="text-gray-400">
                Professional, experienced drivers. Sit back and enjoy 
                the ride while our experts handle everything.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <Phone className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Phone</h3>
              <p className="text-gray-400">0790068051</p>
              <p className="text-gray-500 text-sm">Available 24/7</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <Mail className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-gray-400">isingizwekingthierry@gmail.com</p>
              <p className="text-gray-500 text-sm">Quick response</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl hover:transform hover:scale-105 transition duration-300">
              <MapPin className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="text-gray-400">Bugesera, Nyamata</p>
              <p className="text-gray-500 text-sm">Property Investment Area</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter & Social Media */}
      <div className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-gray-400 mb-8">
            Follow us on social media and subscribe to our newsletter
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition hover:scale-110">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com/zodiac45" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-full transition hover:scale-110">
              <InstagramIcon />
            </a>
            <a href="#" className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full transition hover:scale-110">
              <TwitterIcon />
            </a>
            <a href="#" className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition hover:scale-110">
              <YoutubeIcon />
            </a>
          </div>
          <form className="flex flex-col sm:flex-row gap-4">
            <input type="email" placeholder="Enter your email address" className="input-field flex-1" required />
            <button type="submit" className="btn-primary whitespace-nowrap hover:scale-105 transition-transform">
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">No spam, unsubscribe anytime. We respect your privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;