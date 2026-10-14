import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Car, Shield, Clock, Award, Star, ArrowLeft, 
  Calendar, CheckCircle, Heart, DollarSign, Calculator,
  MessageSquare, Sparkles, MapPin, Gauge, Fuel, Check,
  AlertCircle, Share2, Compass
} from 'lucide-react';
import { carService, rentalService, salesService, wishlistService, messageService, reviewService } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab mode for dual-purpose vehicles
  const [activeTab, setActiveTab] = useState('rent'); // 'rent' | 'sale'

  // Rental Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Bugesera, Nyamata');
  const [dropoffLocation, setDropoffLocation] = useState('Bugesera, Nyamata');
  const [insuranceOption, setInsuranceOption] = useState('basic');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Financing Calculator State
  const [downPayment, setDownPayment] = useState(20000);
  const [loanTerm, setLoanTerm] = useState(48); // 24, 36, 48, 60 months
  const [interestRate] = useState(6.5);

  // Test Drive Modal
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('11:00 AM');
  const [testDriveNotes, setTestDriveNotes] = useState('');
  const [testDriveLoading, setTestDriveLoading] = useState(false);

  // Message Modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);

  // Review submission
  const [newRating, setNewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Wishlist
  const [isSaved, setIsSaved] = useState(false);

  // 360 Tour / Multi-angle view simulation
  const [viewAngle, setViewAngle] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await carService.getById(id);
        const carData = res.data?.car;
        if (!carData) {
          setError('Vehicle not found');
          return;
        }
        setCar(carData);
        setReviews(res.data?.reviews || []);
        setSimilarCars(res.data?.similar || []);

        if (carData.listing_type === 'sale') {
          setActiveTab('sale');
        } else {
          setActiveTab('rent');
        }

        // Set default down payment to 20% of sale price
        const price = carData.sale_price || (carData.price * 150);
        setDownPayment(Math.round(price * 0.2));

        // Default start date = tomorrow, end date = +3 days
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const endDay = new Date();
        endDay.setDate(endDay.getDate() + 4);
        setStartDate(tomorrow.toISOString().split('T')[0]);
        setEndDate(endDay.toISOString().split('T')[0]);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Check wishlist
  useEffect(() => {
    if (isAuthenticated && car) {
      wishlistService.getWishlist()
        .then(res => {
          setIsSaved((res.data?.carIds || []).includes(car.id));
        })
        .catch(() => {});
    }
  }, [isAuthenticated, car]);

  // Calculate rental pricing
  const calculateRentalTotal = () => {
    if (!startDate || !endDate || !car) return { days: 1, base: 0, insurance: 0, total: 0 };
    const s = new Date(startDate);
    const e = new Date(endDate);
    const days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));

    const rate = car.daily_rental_rate || car.price || 100;
    const base = rate * days;

    let insuranceRate = 0;
    if (insuranceOption === 'basic') insuranceRate = 15;
    else if (insuranceOption === 'premium') insuranceRate = 35;
    else if (insuranceOption === 'full') insuranceRate = 50;

    const insurance = insuranceRate * days;
    return { days, base, insurance, total: base + insurance };
  };

  const rentalCosts = calculateRentalTotal();

  // Financing calculation
  const calculateMonthly = () => {
    const salePrice = car?.sale_price || (car?.price * 150) || 50000;
    const principal = Math.max(0, salePrice - downPayment);
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) return Math.round(principal / loanTerm);
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return Math.round(monthly);
  };

  const handleBookRental = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to book a rental');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await rentalService.book({
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        insurance_option: insuranceOption
      });

      toast.success(res.data?.message || 'Rental reserved! Check your dashboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking request failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePurchaseInquiry = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a purchase inquiry');
      return;
    }

    try {
      const res = await salesService.submitInquiry({
        car_id: car.id,
        financing_selected: true,
        down_payment: downPayment,
        monthly_term_months: loanTerm,
        notes: `Interested in acquiring ${car.brand} ${car.model}. Estimated down payment: $${downPayment.toLocaleString()}.`
      });

      toast.success(res.data?.message || 'Purchase inquiry sent! Our team will contact you.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Inquiry submission failed');
    }
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to schedule a test drive');
      return;
    }

    setTestDriveLoading(true);
    try {
      const res = await salesService.scheduleTestDrive({
        car_id: car.id,
        scheduled_date: testDriveDate,
        scheduled_time: testDriveTime,
        notes: testDriveNotes
      });

      toast.success(res.data?.message || 'Test drive confirmed!');
      setShowTestDriveModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to schedule test drive');
    } finally {
      setTestDriveLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to contact the seller');
      return;
    }

    setMessageLoading(true);
    try {
      await messageService.send({
        receiver_id: car.owner_id || 1,
        car_id: car.id,
        content: messageContent
      });

      toast.success('Message delivered to dealer! Check your dashboard messages.');
      setMessageContent('');
      setShowMessageModal(false);
    } catch (err) {
      toast.error('Could not send message');
    } finally {
      setMessageLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to write a review');
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await reviewService.submit({
        car_id: car.id,
        rating: newRating,
        comment: newReviewComment
      });

      toast.success('Review posted! Thank you for sharing your experience.');
      setReviews(prev => [res.data?.review, ...prev]);
      setNewReviewComment('');
    } catch (err) {
      toast.error('Could not post review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save this vehicle');
      return;
    }
    try {
      const res = await wishlistService.toggle(car.id);
      setIsSaved(res.data?.isSaved);
      toast.success(res.data?.message);
    } catch (err) {
      toast.error('Could not update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading vehicle portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">{error || 'Vehicle Not Found'}</h2>
          <p className="text-xs text-gray-400 mb-6">The requested car may have been sold or moved from the showroom.</p>
          <Link to="/cars" className="bg-amber-400 text-black px-6 py-2.5 rounded-xl font-bold text-xs inline-block">
            Return to Fleet
          </Link>
        </div>
      </div>
    );
  }

  const isSaleAvailable = car.listing_type === 'sale' || car.listing_type === 'both';
  const isRentAvailable = car.listing_type === 'rent' || car.listing_type === 'both';

  return (
    <div className="bg-black text-white min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Fleet
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-xl border border-gray-800 transition ${
                isSaved ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-gray-950 text-gray-300 hover:text-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-400' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success('Vehicle link copied to clipboard!');
              }}
              className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 hover:text-white transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Gallery with 360-degree tour toggle */}
        <div className="bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden mb-8">
          <div className="relative h-[380px] sm:h-[480px] bg-gray-900 overflow-hidden flex items-center justify-center">
            <img
              src={car.image_url}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
              style={{
                filter: viewAngle === 1 ? 'hue-rotate(20deg) brightness(1.05)' : viewAngle === 2 ? 'contrast(1.1) saturate(1.1)' : 'none'
              }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {isRentAvailable && (
                <span className="bg-amber-400 text-black text-xs font-extrabold px-3 py-1 rounded-full shadow">
                  Available for Rent
                </span>
              )}
              {isSaleAvailable && (
                <span className="bg-white text-black text-xs font-extrabold px-3 py-1 rounded-full shadow">
                  Certified for Sale
                </span>
              )}
            </div>

            {/* 360 Tour / Multi-Angle Control Bar */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 backdrop-blur-md border border-gray-700 rounded-full px-4 py-1.5 flex items-center gap-3 text-xs">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="text-gray-300 font-semibold hidden sm:inline">Showroom View:</span>
              <button
                onClick={() => setViewAngle(0)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${viewAngle === 0 ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Exterior Angle
              </button>
              <button
                onClick={() => setViewAngle(1)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${viewAngle === 1 ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Front 3/4
              </button>
              <button
                onClick={() => setViewAngle(2)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${viewAngle === 2 ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Interior Cockpit
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Details on Left + Action Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Specifications & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Key Highlights */}
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {car.brand} • {car.category} • Model Year {car.year}
                </span>
                <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{car.rating || 4.9}</span>
                  <span className="text-gray-400">({car.reviews_count || reviews.length || 24} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{car.brand} {car.model}</h1>
              <p className="text-gray-300 text-sm mt-4 leading-relaxed">{car.description}</p>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-2xl text-center">
                  <Fuel className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400">Fuel Type</p>
                  <p className="text-xs font-bold mt-0.5">{car.fuel_type}</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-2xl text-center">
                  <Gauge className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400">Transmission</p>
                  <p className="text-xs font-bold mt-0.5">{car.transmission}</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-2xl text-center">
                  <Car className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400">Engine / Power</p>
                  <p className="text-xs font-bold mt-0.5">{car.engine_specs || 'High Performance'}</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-2xl text-center">
                  <MapPin className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400">Location</p>
                  <p className="text-xs font-bold mt-0.5">{car.location?.split(',')[0]}</p>
                </div>
              </div>
            </div>

            {/* Comprehensive Features List */}
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold mb-4">Equipment & Premium Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Array.isArray(car.features) ? car.features : [
                  "Factory Certified Warranty",
                  "Touchscreen Infotainment with Apple CarPlay",
                  "Climate Control with Dual-Zone A/C",
                  "Reverse Parking Camera & Sensors",
                  "Full Leather Interior with Heated Seats",
                  "Keyless Entry & Push-to-Start",
                  "All-Terrain Stability Management",
                  "Emergency Automatic Braking Assist"
                ]).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dealer & Trust Profile */}
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold text-xl">
                  ER
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">EliteRent Certified Operations</h4>
                  <p className="text-xs text-gray-400">Bugesera, Nyamata - Property Investment Area</p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                    <span className="text-amber-400 font-bold">✓ Verified Dealer</span>
                    <span>•</span>
                    <span>Direct Concierge Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMessageModal(true)}
                className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Inquire with Dealer
              </button>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Customer Reviews ({reviews.length})</h3>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {car.rating || 4.9} out of 5
                </span>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-black border border-gray-800 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-gray-300 mb-2">Share Your Experience with this Vehicle</p>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">{newRating} Stars</span>
                </div>
                <textarea
                  rows="2"
                  placeholder="How did the car perform? Interior condition, drive quality..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 mb-3"
                  required
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-300 transition"
                >
                  {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </form>

              {/* Review List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to review this vehicle!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-800 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{rev.user_name || 'Verified Customer'}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Dual-Purpose Action Box (Rental vs Purchase) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sticky top-24 shadow-2xl">
              {/* Tab Selector if Both are available */}
              {isRentAvailable && isSaleAvailable && (
                <div className="flex bg-gray-900 p-1 rounded-2xl mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('rent')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      activeTab === 'rent' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Rent This Car
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sale')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      activeTab === 'sale' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Buy This Car
                  </button>
                </div>
              )}

              {/* ========== RENTAL TAB ========== */}
              {activeTab === 'rent' && isRentAvailable && (
                <div>
                  <div className="mb-6 pb-4 border-b border-gray-800">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Daily Rental Rate</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-amber-400">
                        ${car.daily_rental_rate || car.price}
                      </span>
                      <span className="text-xs text-gray-400">/day</span>
                    </div>
                    {car.weekly_rental_rate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Weekly discount: <strong className="text-white">${car.weekly_rental_rate}/week</strong>
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleBookRental} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Pick-up Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Drop-off Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Insurance Add-on</label>
                      <select
                        value={insuranceOption}
                        onChange={(e) => setInsuranceOption(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="basic">Standard Coverage (+$15/day)</option>
                        <option value="premium">Comprehensive Plus (+$35/day)</option>
                        <option value="full">Full Collision Damage Zero-Deductible (+$50/day)</option>
                      </select>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-900/60 rounded-xl p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Duration:</span>
                        <span className="text-white font-medium">{rentalCosts.days} Day(s)</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Vehicle Hire:</span>
                        <span className="text-white font-medium">${rentalCosts.base}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Insurance Add-on:</span>
                        <span className="text-white font-medium">${rentalCosts.insurance}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Security Deposit (Refundable):</span>
                        <span className="text-white font-medium">$250</span>
                      </div>
                      <div className="pt-2 border-t border-gray-800 flex justify-between font-bold text-sm">
                        <span>Estimated Total:</span>
                        <span className="text-amber-400">${rentalCosts.total}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold py-3 rounded-xl transition duration-300 text-sm shadow-lg shadow-amber-400/20"
                    >
                      {bookingLoading ? 'Reserving...' : 'Book Rental Now'}
                    </button>
                  </form>
                </div>
              )}

              {/* ========== SALES TAB ========== */}
              {(activeTab === 'sale' || !isRentAvailable) && isSaleAvailable && (
                <div>
                  <div className="mb-6 pb-4 border-b border-gray-800">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Purchase Price</span>
                    <div className="text-3xl font-extrabold text-white mt-1">
                      ${car.sale_price ? car.sale_price.toLocaleString() : (car.price * 150).toLocaleString()}
                    </div>
                    <p className="text-xs text-amber-400 mt-1 font-semibold">
                      Estimated ~${calculateMonthly().toLocaleString()}/mo with financing
                    </p>
                  </div>

                  {/* Financing Calculator */}
                  <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 mb-5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-gray-200 mb-3">
                      <Calculator className="w-3.5 h-3.5 text-amber-400" /> Financing Estimator
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                          <span>Down Payment:</span>
                          <span className="text-white font-semibold">${downPayment.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={car.sale_price ? car.sale_price * 0.8 : 50000}
                          step="1000"
                          value={downPayment}
                          onChange={(e) => setDownPayment(Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Term Length</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[24, 36, 48, 60].map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => setLoanTerm(term)}
                              className={`py-1.5 rounded-lg font-bold text-[11px] transition ${
                                loanTerm === term ? 'bg-amber-400 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
                              }`}
                            >
                              {term} Mo
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs">
                        <span className="text-gray-400">Monthly Est. Payment:</span>
                        <span className="text-base font-extrabold text-amber-400">${calculateMonthly()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handlePurchaseInquiry}
                      className="w-full bg-white hover:bg-amber-400 text-black font-extrabold py-3 rounded-xl transition duration-300 text-sm shadow"
                    >
                      Inquire to Purchase
                    </button>
                    <button
                      onClick={() => setShowTestDriveModal(true)}
                      className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-amber-400" /> Schedule Test Drive
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Scheduling Modal */}
      {showTestDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-1">Schedule VIP Test Drive</h3>
            <p className="text-xs text-gray-400 mb-4">{car.brand} {car.model} • Bugesera Showroom</p>

            <form onSubmit={handleTestDriveSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Select Date</label>
                <input
                  type="date"
                  value={testDriveDate}
                  onChange={(e) => setTestDriveDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Preferred Time Window</label>
                <select
                  value={testDriveTime}
                  onChange={(e) => setTestDriveTime(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="09:00 AM">Morning: 09:00 AM</option>
                  <option value="11:00 AM">Morning: 11:00 AM</option>
                  <option value="02:00 PM">Afternoon: 02:00 PM</option>
                  <option value="04:30 PM">Afternoon: 04:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Special Requirements (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Interested in highway performance, bring license details..."
                  value={testDriveNotes}
                  onChange={(e) => setTestDriveNotes(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTestDriveModal(false)}
                  className="flex-1 bg-gray-900 text-gray-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testDriveLoading}
                  className="flex-1 bg-amber-400 text-black py-2.5 rounded-xl text-xs font-bold hover:bg-amber-300"
                >
                  {testDriveLoading ? 'Confirming...' : 'Confirm Test Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Dealer Inquiries Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-1">Message Vehicle Manager</h3>
            <p className="text-xs text-gray-400 mb-4">Direct inquiry regarding {car.brand} {car.model}</p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows="4"
                placeholder="Ask about vehicle condition, pricing flexibility, delivery options to Kigali..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 bg-gray-900 text-gray-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={messageLoading}
                  className="flex-1 bg-white hover:bg-amber-400 text-black py-2.5 rounded-xl text-xs font-bold transition"
                >
                  {messageLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;