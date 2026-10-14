import React, { useState, useEffect } from 'react';
import { 
  Car, DollarSign, Calendar, TrendingUp, PlusCircle, 
  Check, X, AlertCircle, Clock, ShieldCheck, Edit,
  Lock, Unlock, Eye, Sparkles
} from 'lucide-react';
import { dealerService, carService } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DealerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | listings | new-listing | calendar | leads

  const [metrics, setMetrics] = useState({
    activeListingsCount: 0,
    totalEarnings: 0,
    activeRentals: 0,
    pendingRequests: 0,
    rentalUtilizationRate: 0
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar Management State
  const [selectedCalendarCar, setSelectedCalendarCar] = useState(null);
  const [calendarData, setCalendarData] = useState({ bookedRanges: [], blockedDates: [] });
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockReason, setBlockReason] = useState('Routine Inspection / Maintenance');

  // Multi-Step Add Vehicle Form State
  const [formStep, setFormStep] = useState(1);
  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    model: '',
    year: 2023,
    listing_type: 'both', // 'rent' | 'sale' | 'both'
    category: 'suv',
    daily_rental_rate: 120,
    weekly_rental_rate: 750,
    sale_price: 65000,
    color: 'Obsidian Black',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 15000,
    seats: 5,
    engine_specs: '2.5L Turbocharged, 250 HP',
    image_url: 'https://images.unsplash.com/photo-1549317661-bc2d8e8f4d9e?w=800&q=80',
    description: 'Immaculately maintained vehicle. Full service history and certified clean title.',
    features: 'Apple CarPlay, Dual-Zone A/C, Heated Seats, Leather Interior, Backup Camera',
    location: 'Bugesera, Nyamata, Rwanda'
  });
  const [submittingCar, setSubmittingCar] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await dealerService.getDashboard();
      if (res.data) {
        setMetrics(res.data.metrics || {});
        setListings(res.data.listings || []);
        if (res.data.listings?.length > 0) {
          setSelectedCalendarCar(res.data.listings[0]);
          loadCalendarForCar(res.data.listings[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading dealer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarForCar = async (carId) => {
    try {
      const res = await dealerService.getCalendar(carId);
      setCalendarData({
        bookedRanges: res.data?.bookedRanges || [],
        blockedDates: res.data?.blockedDates || []
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCarSelectForCalendar = (car) => {
    setSelectedCalendarCar(car);
    loadCalendarForCar(car.id);
  };

  const handleToggleBlockDate = async (e) => {
    e.preventDefault();
    if (!selectedCalendarCar || !blockDateInput) return;

    try {
      const res = await dealerService.toggleBlockDate({
        car_id: selectedCalendarCar.id,
        date: blockDateInput,
        reason: blockReason
      });
      toast.success(res.data?.message || 'Calendar updated');
      loadCalendarForCar(selectedCalendarCar.id);
      setBlockDateInput('');
    } catch (err) {
      toast.error('Failed to update calendar block');
    }
  };

  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingCar(true);

    try {
      const payload = {
        ...vehicleForm,
        price: vehicleForm.daily_rental_rate,
        features: vehicleForm.features.split(',').map(f => f.trim())
      };

      const res = await carService.create(payload);
      toast.success('Vehicle successfully listed on the marketplace!');
      setListings(prev => [res.data?.car, ...prev]);
      setActiveTab('listings');
      setFormStep(1);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish listing');
    } finally {
      setSubmittingCar(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Dealer Header */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Merchant Hub</span>
              <span className="bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Dealer Partner
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              {user?.dealer_company_name || `${user?.name} Dealership`}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Manage your fleet inventory, rental calendar dates, and buyer transaction leads.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new-listing')}
            className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" /> Add Vehicle Listing
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'listings' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            My Vehicles ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('new-listing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'new-listing' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            + Create Listing
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'calendar' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Rental Calendar & Blackout Dates
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Active Fleet</span>
                <p className="text-3xl font-extrabold text-white mt-1">{metrics.activeListingsCount}</p>
                <p className="text-xs text-green-400 mt-2 font-medium">Approved in Showroom</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Revenue Volume</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-1">${metrics.totalEarnings?.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Rentals + Sales Gross</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Rental Utilization</span>
                <p className="text-3xl font-extrabold text-white mt-1">{metrics.rentalUtilizationRate}%</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Fleet active occupancy</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Pending Leads</span>
                <p className="text-3xl font-extrabold text-white mt-1">{metrics.pendingRequests}</p>
                <p className="text-xs text-amber-400 mt-2 font-medium">Inquiries awaiting reply</p>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
              <h3 className="font-bold text-base mb-4">Quick Fleet Snapshot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {listings.slice(0, 3).map((car) => (
                  <div key={car.id} className="bg-black border border-gray-800 rounded-xl p-3 flex gap-3 items-center">
                    <img 
                      src={car.image_url} 
                      alt={car.brand} 
                      className="w-16 h-14 object-cover rounded-lg" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-white">{car.brand} {car.model}</h4>
                      <p className="text-[11px] text-amber-400">${car.daily_rental_rate || car.price}/day</p>
                      <span className="text-[10px] text-green-400">● {car.status || 'Available'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MY VEHICLES ================= */}
        {activeTab === 'listings' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Vehicle Listings ({listings.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((car) => (
                <div key={car.id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="relative h-44 bg-gray-900">
                    <img 
                      src={car.image_url} 
                      alt={car.brand} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {car.listing_type?.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{car.brand} {car.model} ({car.year})</h4>
                      <p className="text-xs text-gray-400 mt-1">{car.category} • {car.transmission}</p>
                      <div className="mt-2 text-xs">
                        <span className="text-amber-400 font-bold">${car.daily_rental_rate || car.price}/day</span>
                        {car.sale_price > 0 && (
                          <span className="text-gray-300 ml-2">| Sale: ${car.sale_price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
                      <span className="text-green-400">● {car.status || 'Available'}</span>
                      <button
                        onClick={() => {
                          setSelectedCalendarCar(car);
                          loadCalendarForCar(car.id);
                          setActiveTab('calendar');
                        }}
                        className="text-amber-400 hover:text-white font-semibold"
                      >
                        Manage Dates →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: MULTI-STEP ADD VEHICLE ================= */}
        {activeTab === 'new-listing' && (
          <div className="max-w-2xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-1">Add Vehicle to Showroom</h2>
            <p className="text-xs text-gray-400 mb-6">List a car for Sale, Rent, or Both with instant verification.</p>

            {/* Stepper indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`flex-1 h-1.5 rounded-full ${formStep >= 1 ? 'bg-amber-400' : 'bg-gray-800'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${formStep >= 2 ? 'bg-amber-400' : 'bg-gray-800'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${formStep >= 3 ? 'bg-amber-400' : 'bg-gray-800'}`}></div>
            </div>

            <form onSubmit={handleAddVehicleSubmit}>
              {/* STEP 1: Basic Information */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-amber-400">Step 1: Vehicle Make, Model & Category</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Make / Brand</label>
                      <input
                        type="text"
                        placeholder="e.g. Toyota, Ferrari"
                        value={vehicleForm.brand}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Model Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Land Cruiser VX-R"
                        value={vehicleForm.model}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Model Year</label>
                      <input
                        type="number"
                        value={vehicleForm.year}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                      <select
                        value={vehicleForm.category}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="suv">SUV & 4x4</option>
                        <option value="luxury">Luxury Sedan</option>
                        <option value="sports">Sports Car</option>
                        <option value="pickup">Pickup</option>
                        <option value="sedan">Sedan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Listing Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['rent', 'sale', 'both'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVehicleForm({ ...vehicleForm, listing_type: type })}
                          className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                            vehicleForm.listing_type === type ? 'bg-amber-400 text-black' : 'bg-gray-900 text-gray-400'
                          }`}
                        >
                          For {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="w-full bg-white hover:bg-gray-200 text-black py-2.5 rounded-xl text-xs font-bold mt-4"
                  >
                    Continue to Photos & Specs →
                  </button>
                </div>
              )}

              {/* STEP 2: Photos & Specifications */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-amber-400">Step 2: Photos & Technical Specs</h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Photo Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={vehicleForm.image_url}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, image_url: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Transmission</label>
                      <select
                        value={vehicleForm.transmission}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Fuel Type</label>
                      <select
                        value={vehicleForm.fuel_type}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, fuel_type: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Mileage (km)</label>
                      <input
                        type="number"
                        value={vehicleForm.mileage}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Engine Specifications</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.5L Twin-Turbo V8 Diesel"
                      value={vehicleForm.engine_specs}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, engine_specs: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="flex-1 bg-gray-900 text-gray-300 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="flex-1 bg-white hover:bg-gray-200 text-black py-2.5 rounded-xl text-xs font-bold"
                    >
                      Continue to Pricing →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Pricing & Features */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-amber-400">Step 3: Pricing & Description</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Daily Rental Rate ($)</label>
                      <input
                        type="number"
                        value={vehicleForm.daily_rental_rate}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, daily_rental_rate: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Sale Purchase Price ($)</label>
                      <input
                        type="number"
                        value={vehicleForm.sale_price}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, sale_price: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Key Features (comma separated)</label>
                    <input
                      type="text"
                      value={vehicleForm.features}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, features: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Public Description</label>
                    <textarea
                      rows="3"
                      value={vehicleForm.description}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="flex-1 bg-gray-900 text-gray-300 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={submittingCar}
                      className="flex-1 bg-amber-400 hover:bg-amber-300 text-black py-2.5 rounded-xl text-xs font-extrabold"
                    >
                      {submittingCar ? 'Publishing...' : 'Publish Vehicle'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ================= TAB 4: RENTAL CALENDAR MANAGEMENT ================= */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Car Picker */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Select Vehicle</h3>
              <div className="space-y-2">
                {listings.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleCarSelectForCalendar(car)}
                    className={`w-full text-left p-3 rounded-xl transition text-xs flex items-center gap-3 ${
                      selectedCalendarCar?.id === car.id ? 'bg-amber-400 text-black font-bold' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    <img 
                      src={car.image_url} 
                      alt="" 
                      className="w-10 h-8 rounded object-cover" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80";
                      }}
                    />
                    <div className="truncate">
                      <p className="truncate">{car.brand} {car.model}</p>
                      <p className="text-[10px] opacity-75">${car.daily_rental_rate || car.price}/day</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Calendar Controls & Blackout Dates */}
            <div className="md:col-span-2 bg-gray-950 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
                <div>
                  <h3 className="font-bold text-base text-white">
                    Availability: {selectedCalendarCar?.brand} {selectedCalendarCar?.model}
                  </h3>
                  <p className="text-xs text-gray-400">Block maintenance days or manage rental blackout intervals</p>
                </div>
              </div>

              {/* Block a date form */}
              <form onSubmit={handleToggleBlockDate} className="bg-black border border-gray-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Pick Date to Block/Unblock</label>
                  <input
                    type="date"
                    value={blockDateInput}
                    onChange={(e) => setBlockDateInput(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Reason</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2.5 rounded-xl w-full sm:w-auto"
                >
                  Toggle Date
                </button>
              </form>

              {/* Current Bookings & Blackouts */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Booked Intervals</h4>
                {calendarData.bookedRanges.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No booked rental dates for this vehicle.</p>
                ) : (
                  <div className="space-y-2">
                    {calendarData.bookedRanges.map((b) => (
                      <div key={b.id} className="bg-gray-900 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">📅 {b.start_date} to {b.end_date}</span>
                          <span className="text-gray-400 ml-2">({b.status})</span>
                        </div>
                        <span className="bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          Confirmed Rental
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider pt-4">Maintenance & Blocked Dates</h4>
                {calendarData.blockedDates.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No custom blocked maintenance dates.</p>
                ) : (
                  <div className="space-y-2">
                    {calendarData.blockedDates.map((b, i) => (
                      <div key={i} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-red-300">
                        <span>🔒 {b.date} - {b.reason}</span>
                        <span className="text-[10px] bg-red-500/30 px-2 py-0.5 rounded font-bold">Blocked</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerDashboard;
