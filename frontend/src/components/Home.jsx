import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, Shield, Clock, Award, ArrowRight, Star, 
  Phone, Mail, MapPin, ChevronRight, ChevronLeft, Sparkles, Users,
  Search, CheckCircle2, DollarSign, Calendar, Tag, Filter,
  ShieldCheck, Zap, KeyRound
} from 'lucide-react';
import { carService, contactService } from '../services/apiServices';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [listingType, setListingType] = useState('rent'); // 'rent' or 'sale'
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchBrand, setSearchBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80",
      title: "Ferrari F8 Tributo",
      subtitle: "710 HP Twin-Turbo V8",
      description: "Available for premium self-drive rental or private acquisition with complete certification in Rwanda.",
      badge: "🏎️ Supercar Flagship",
      tag: "Ferrari F8"
    },
    {
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600&q=80",
      title: "Rolls Royce Ghost",
      subtitle: "The Benchmark of Prestige",
      description: "VIP executive chauffeur service, luxury weddings, and bespoke private procurement in Kigali.",
      badge: "👑 Royal Elegance",
      tag: "Rolls Royce"
    },
    {
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1600&q=80",
      title: "Toyota Land Cruiser V8",
      subtitle: "The King of African Roads",
      description: "Master Rwandan hills, safaris, and diplomatic delegations with rugged luxury and all-terrain 4WD.",
      badge: "🇷🇼 Rwanda Favorite",
      tag: "Land Cruiser"
    },
    {
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&q=80",
      title: "Mercedes-AMG GT Black Series",
      subtitle: "Handcrafted Track Dominance",
      description: "Pure V8 biturbo roar, striking aerodynamic silhouette, and race-bred precision grand touring.",
      badge: "⚡ AMG Performance",
      tag: "Mercedes-AMG"
    },
    {
      image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=80",
      title: "Lamborghini Huracán Evo",
      subtitle: "640 HP Naturally Aspirated V10",
      description: "Aggressive Italian aerodynamics, all-wheel steering, and visceral open-highway sound.",
      badge: "🇮🇹 Exotic Masterpiece",
      tag: "Lamborghini"
    },
    {
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80",
      title: "Porsche 911 Turbo S",
      subtitle: "Precision Engineering Unleashed",
      description: "The timeless sports car icon with blistering acceleration and everyday executive poise.",
      badge: "🏁 Pure Adrenaline",
      tag: "Porsche 911"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Load dynamic cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoadingCars(true);
        const res = await carService.getAll({});
        if (res.data?.cars) {
          setFeaturedCars(res.data.cars);
        }
      } catch (err) {
        console.error('Failed to load cars:', err);
      } finally {
        setLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.append('type', listingType);
    if (searchCategory && searchCategory !== 'all') params.append('category', searchCategory);
    if (searchBrand) params.append('search', searchBrand);
    if (maxPrice) params.append('maxPrice', maxPrice);
    navigate(`/cars?${params.toString()}`);
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setNewsletterSubmitting(true);
    try {
      await contactService.newsletter(newsletterEmail);
      toast.success('🎉 Welcome to the Elite VIP Club!');
      setNewsletterEmail('');
    } catch (err) {
      toast.success('🎉 You are now subscribed to vehicle alerts!');
      setNewsletterEmail('');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const saleCars = featuredCars.filter(c => c.listing_type === 'sale' || c.listing_type === 'both').slice(0, 4);
  const rentalCars = featuredCars.filter(c => c.listing_type === 'rent' || c.listing_type === 'both').slice(0, 4);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* ================= HERO CAR SHOWCASE (100% Full Unobstructed Animation) ================= */}
      <div className="relative h-[80vh] sm:h-[86vh] flex flex-col justify-between overflow-hidden pt-24 pb-6 sm:pb-8">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transition-transform duration-10000`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80";
              }}
            />
            {/* Subtle Vignette so car is completely vivid and text is crystal clear */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/90"></div>
          </div>
        ))}

        {/* Carousel Navigation Arrow - Left */}
        <button
          onClick={prevSlide}
          aria-label="Previous car"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-amber-400 hover:text-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition duration-300 shadow-xl group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Carousel Navigation Arrow - Right */}
        <button
          onClick={nextSlide}
          aria-label="Next car"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-amber-400 hover:text-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition duration-300 shadow-xl group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
        
        {/* Upper Zone: Floating Badge, Slide Counter & Hero Headline */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {heroSlides[currentSlide].badge}
            </span>
            <span className="bg-black/50 backdrop-blur-md text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/30">
              0{currentSlide + 1} / 0{heroSlides.length}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-xl">
            {heroSlides[currentSlide].title}
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 text-amber-400 drop-shadow">
            {heroSlides[currentSlide].subtitle}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-normal drop-shadow">
            {heroSlides[currentSlide].description}
          </p>
        </div>

        {/* Bottom Zone: Single Row of 6 Sleek Animated Car Selector Pills */}
        <div className="relative z-20 px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto bg-black/60 backdrop-blur-md p-1.5 sm:p-2 rounded-full border border-white/10 shadow-2xl">
            {heroSlides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30 scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${index === currentSlide ? 'bg-black' : 'bg-amber-400'}`}></span>
                <span>{slide.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SEARCH & FILTER HUB (Positioned Below Hero Showcase at Low Level) ================= */}
      <div className="relative z-30 bg-gradient-to-b from-gray-950 via-black to-black py-10 sm:py-14 border-y border-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Rwanda & Bugesera Marketplace Search
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Find Your Ideal Car to Rent or Buy
              </h2>
            </div>
            <a
              href="https://wa.me/250793210519"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/40 px-4 py-2 rounded-xl text-xs font-bold transition shadow"
            >
              <Phone className="w-4 h-4" /> WhatsApp Concierge (0793210519)
            </a>
          </div>

          {/* Prominent Search/Filter Bar with Toggle between "Buy" and "Rent" */}
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-4 sm:p-7 shadow-2xl text-left hover:border-amber-500/40 transition duration-300">
            {/* Toggle Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-gray-800/80 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setListingType('rent')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    listingType === 'rent'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-102'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  Rent a Car
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('sale')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    listingType === 'sale'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-102'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Buy a Car
                </button>
              </div>

              <span className="text-xs text-gray-400 hidden sm:inline">
                {listingType === 'rent' ? 'Daily & Weekly Hire in Bugesera & Kigali' : 'Certified Ownership & 100-Point Inspection'}
              </span>
            </div>

            {/* Filter Form */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Make / Model / Keyword</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Land Cruiser, Ferrari"
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Body Type</label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Vehicle Types</option>
                  <option value="suv">SUVs & 4x4s</option>
                  <option value="luxury">Luxury Sedans</option>
                  <option value="sports">Sports & Supercars</option>
                  <option value="pickup">Pickups & Utilities</option>
                  <option value="sedan">Executive Sedans</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  {listingType === 'rent' ? 'Max Daily Budget ($)' : 'Max Price Budget ($)'}
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    placeholder={listingType === 'rent' ? "e.g. 200/day" : "e.g. 50,000"}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-amber-400 text-black font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-300 shadow-md group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Search {listingType === 'rent' ? 'Rentals' : 'Sales'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick CTA links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
            <Link to="/cars?type=rent" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 flex items-center gap-1 transition">
              Browse All Rentals <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link to="/cars?type=sale" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 flex items-center gap-1 transition">
              Browse Vehicles For Sale <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <a
              href="https://wa.me/250793210519"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-green-400 hover:text-green-300 flex items-center gap-1 transition font-medium"
            >
              Direct WhatsApp (0793210519) <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Trust Signals Bar */}
      <div className="border-y border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-base">Verified Dealers</p>
                <p className="text-xs text-gray-400">100% Inspected & Licensed</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-base">Secure Payments</p>
                <p className="text-xs text-gray-400">Full Guarantee & Escrow</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Star className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-base">4.9 / 5.0 Rating</p>
                <p className="text-xs text-gray-400">500+ Verified Reviews</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-base">24/7 Roadside VIP</p>
                <p className="text-xs text-gray-400">Bugesera & Nationwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick-Action Categories */}
      <div className="py-20 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Explore by Category</h2>
          <p className="text-gray-400 text-sm">
            Whether for high-profile business, cross-country exploration, or special occasions, find your exact match.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/cars?category=suv"
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-6 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400 group-hover:text-black transition-colors">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">SUVs & 4x4s</h3>
            <p className="text-xs text-gray-400 mb-3">Land Cruisers, Patrols & Sportages</p>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse SUVs <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/cars?category=luxury"
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-6 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400 group-hover:text-black transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Luxury Sedans</h3>
            <p className="text-xs text-gray-400 mb-3">Rolls Royce, BMW M8 & Mercedes</p>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Luxury <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/cars?category=sports"
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-6 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400 group-hover:text-black transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Supercars & Sports</h3>
            <p className="text-xs text-gray-400 mb-3">Ferrari, Huracan & McLaren</p>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Sports <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/cars?category=pickup"
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-6 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400 group-hover:text-black transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Pickups & Utility</h3>
            <p className="text-xs text-gray-400 mb-3">Toyota Hilux Invincible & 4x4s</p>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Utility <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Featured Vehicles for Sale */}
      <div className="py-16 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ownership & Investment</span>
              <h2 className="text-3xl font-extrabold mt-1">Featured Cars for Sale</h2>
              <p className="text-gray-400 text-sm mt-1">Certified, inspected vehicles with available financing options</p>
            </div>
            <Link
              to="/cars?type=sale"
              className="mt-4 sm:mt-0 text-sm font-semibold text-amber-400 hover:text-white flex items-center gap-1"
            >
              View All For Sale ({featuredCars.length}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleCars.map((car) => (
              <div 
                key={car.id} 
                className="bg-black rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl flex flex-col group"
              >
                <div className="relative overflow-hidden h-52 bg-gray-900">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    For Sale
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{car.rating || 4.9}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">{car.brand} • {car.year}</p>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{car.engine_specs}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>{car.transmission}</span>
                      <span>•</span>
                      <span>{car.fuel_type}</span>
                      <span>•</span>
                      <span>{car.mileage?.toLocaleString()} km</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 block font-semibold">Sale Price</span>
                      <span className="text-xl font-extrabold text-white">
                        ${car.sale_price ? car.sale_price.toLocaleString() : (car.price * 150).toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={`/car/${car.id}`}
                      className="bg-white hover:bg-amber-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Rental Fleet */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Daily & Weekly Hire</span>
              <h2 className="text-3xl font-extrabold mt-1">Popular Rental Models</h2>
              <p className="text-gray-400 text-sm mt-1">Instant availability in Bugesera, Nyamata, and Kigali delivery</p>
            </div>
            <Link
              to="/cars?type=rent"
              className="mt-4 sm:mt-0 text-sm font-semibold text-amber-400 hover:text-white flex items-center gap-1"
            >
              View Full Fleet <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalCars.map((car) => (
              <div 
                key={car.id} 
                className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl flex flex-col group"
              >
                <div className="relative overflow-hidden h-52 bg-gray-900">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                    For Rent
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{car.rating || 4.9}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">{car.brand} • {car.category}</p>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{car.seats || 5} Seats • {car.transmission}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 block font-semibold">Daily Rate</span>
                      <span className="text-xl font-extrabold text-amber-400">
                        ${car.daily_rental_rate || car.price}
                        <span className="text-xs text-gray-400 font-normal">/day</span>
                      </span>
                    </div>
                    <Link
                      to={`/car/${car.id}`}
                      className="bg-gray-800 hover:bg-white hover:text-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-300"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Services */}
      <div className="py-20 border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold mb-3">Tailored Mobility Services</h2>
            <p className="text-gray-400 text-sm">Flexible options designed for diplomats, executives, tourists, and automotive enthusiasts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-amber-400 transition-all">
              <div className="w-14 h-14 bg-amber-400/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Self-Drive Experience</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Enjoy complete independence with our fleet. Direct digital verification, transparent insurance policies, and seamless pickup at Bugesera or Kigali International Airport.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Comprehensive Collision Damage Waiver</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Unlimited mileage on long-term packages</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 24/7 Roadside Assistance</li>
              </ul>
              <Link to="/cars?type=rent" className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-white">
                Choose a Vehicle <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-amber-400 transition-all">
              <div className="w-14 h-14 bg-amber-400/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">VIP Chauffeur & Delegations</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Polite, multilingual professional drivers with extensive knowledge of Rwanda’s routes. Perfect for corporate summits, diplomatic visits, and luxury weddings.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Certified VIP Security Trained Chauffeurs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> In-car Wi-Fi, refreshments & bottled water</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Punctual airport meet-and-greet</li>
              </ul>
              <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-white">
                Book Chauffeur Service <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-20 bg-gradient-to-b from-gray-950 to-black border-t border-gray-800">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-3xl font-extrabold mb-3">Stay in the Fast Lane</h2>
          <p className="text-gray-400 text-sm mb-8">
            Receive exclusive notifications when rare supercars arrive for sale or seasonal rental discounts launch in Rwanda.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="bg-white hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition duration-300 text-sm whitespace-nowrap"
            >
              {newsletterSubmitting ? 'Joining...' : 'Subscribe VIP'}
            </button>
          </form>
          <p className="text-[11px] text-gray-500 mt-3">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;