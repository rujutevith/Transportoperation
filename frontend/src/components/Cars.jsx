import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Car, Search, Filter, SlidersHorizontal, Star, 
  ArrowUpDown, Grid, List as ListIcon, Heart, 
  RotateCcw, Check, Sparkles, Fuel, Gauge, Shield
} from 'lucide-react';
import { carService, wishlistService } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [wishlistIds, setWishlistIds] = useState([]);

  // Filter States
  const [listingType, setListingType] = useState(searchParams.get('type') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch cars with active filters
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        listing_type: listingType !== 'all' ? listingType : undefined,
        category: category !== 'all' ? category : undefined,
        brand: selectedBrand !== 'all' ? selectedBrand : undefined,
        fuel_type: selectedFuel !== 'all' ? selectedFuel : undefined,
        transmission: selectedTransmission !== 'all' ? selectedTransmission : undefined,
        price_max: maxPrice ? Number(maxPrice) : undefined,
        search: searchTerm || undefined,
        sort: sortBy
      };

      const response = await carService.getAll(params);
      setCars(response.data?.cars || []);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Unable to load vehicle catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [listingType, category, selectedBrand, selectedFuel, selectedTransmission, maxPrice, sortBy]);

  // Load wishlist if logged in
  useEffect(() => {
    if (isAuthenticated) {
      wishlistService.getWishlist()
        .then(res => setWishlistIds(res.data?.carIds || []))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handleToggleWishlist = async (carId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save vehicles to your wishlist');
      return;
    }

    try {
      const res = await wishlistService.toggle(carId);
      if (res.data?.isSaved) {
        setWishlistIds(prev => [...prev, carId]);
        toast.success('Saved to Wishlist');
      } else {
        setWishlistIds(prev => prev.filter(id => id !== carId));
        toast.success('Removed from Wishlist');
      }
    } catch (err) {
      toast.error('Could not update wishlist');
    }
  };

  const handleResetFilters = () => {
    setListingType('all');
    setCategory('all');
    setSearchTerm('');
    setSelectedBrand('all');
    setSelectedFuel('all');
    setSelectedTransmission('all');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Distinct brands for filter dropdown
  const brandsList = ['Ferrari', 'Lamborghini', 'Rolls Royce', 'McLaren', 'Mercedes-AMG', 'Aston Martin', 'Audi', 'BMW', 'Toyota', 'Kia', 'Nissan'];

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Header Banner */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Inventory Catalog</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">Vehicle Marketplace</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Browse our complete collection of certified vehicles for purchase or luxury rental in Rwanda.
          </p>
        </div>

        {/* Top Control Bar: Buy/Rent Switcher & Search */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Listing Type Toggle */}
          <div className="flex bg-gray-900 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setListingType('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                listingType === 'all' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Vehicles
            </button>
            <button
              onClick={() => setListingType('rent')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                listingType === 'rent' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => setListingType('sale')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                listingType === 'sale' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              For Sale
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by make, model, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-20 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-gray-800 hover:bg-amber-400 hover:text-black text-gray-300 text-xs px-3 py-1.5 rounded-lg font-semibold transition"
            >
              Search
            </button>
          </form>

          {/* View Toggles & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
              >
                <option value="newest" className="bg-gray-900">Newest Listings</option>
                <option value="price_asc" className="bg-gray-900">Price: Low to High</option>
                <option value="price_desc" className="bg-gray-900">Price: High to Low</option>
                <option value="rating" className="bg-gray-900">Top Rated</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Left Filter Sidebar + Right Inventory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
                <span className="font-bold text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filter Vehicles
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 mb-2">Vehicle Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Categories</option>
                  <option value="suv">SUVs & 4x4s</option>
                  <option value="luxury">Luxury Sedans</option>
                  <option value="sports">Sports & Supercars</option>
                  <option value="pickup">Pickups & Trucks</option>
                  <option value="sedan">Executive Sedans</option>
                </select>
              </div>

              {/* Brand / Make Filter */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 mb-2">Make / Manufacturer</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Brands</option>
                  {brandsList.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 mb-2">Fuel Type</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 mb-2">Transmission</label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Transmissions</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Max Budget */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  Max Budget ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-gray-500 text-center">
                  Showing {cars.length} vehicles matching criteria
                </p>
              </div>
            </div>
          </div>

          {/* Cars Grid / List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mb-3"></div>
                <p className="text-gray-400 text-sm">Searching Elite fleet...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center bg-gray-950 border border-red-900/40 rounded-2xl p-8">
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchCars}
                  className="bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Retry Loading
                </button>
              </div>
            ) : cars.length === 0 ? (
              <div className="py-20 text-center bg-gray-950 border border-gray-800 rounded-2xl p-8">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold">No vehicles found</h3>
                <p className="text-gray-400 text-xs mt-1 mb-4">Try clearing some filters or searching with different keywords.</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-white hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {cars.map((car) => {
                  const isWishlisted = wishlistIds.includes(car.id);
                  const isForSale = car.listing_type === 'sale' || car.listing_type === 'both';
                  const isForRent = car.listing_type === 'rent' || car.listing_type === 'both';

                  if (viewMode === 'list') {
                    return (
                      <div
                        key={car.id}
                        className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden p-4 flex flex-col sm:flex-row gap-5 hover:border-gray-600 transition"
                      >
                        <div className="relative w-full sm:w-56 h-44 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0">
                          <img
                            src={car.image_url}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                            }}
                          />
                          <button
                            onClick={(e) => handleToggleWishlist(car.id, e)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition ${
                              isWishlisted ? 'bg-red-500/80 text-white' : 'bg-black/60 text-gray-300 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                          </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                {car.brand} • {car.category}
                              </span>
                              <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {car.rating || 4.9} ({car.reviews_count || 12})
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{car.brand} {car.model}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{car.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                              <span>⛽ {car.fuel_type}</span>
                              <span>⚙️ {car.transmission}</span>
                              <span>💺 {car.seats || 5} Seats</span>
                              <span>📍 {car.location?.split(',')[0]}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {isForRent && (
                                <div>
                                  <span className="text-[10px] uppercase text-gray-400 font-semibold block">Rental</span>
                                  <span className="text-base font-extrabold text-amber-400">
                                    ${car.daily_rental_rate || car.price}<span className="text-xs font-normal text-gray-400">/day</span>
                                  </span>
                                </div>
                              )}
                              {isForSale && (
                                <div>
                                  <span className="text-[10px] uppercase text-gray-400 font-semibold block">Buy For</span>
                                  <span className="text-base font-extrabold text-white">
                                    ${car.sale_price ? car.sale_price.toLocaleString() : (car.price * 150).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <Link
                              to={`/car/${car.id}`}
                              className="bg-white hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Default Grid Card
                  return (
                    <div
                      key={car.id}
                      className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition flex flex-col group"
                    >
                      <div className="relative h-48 bg-gray-900 overflow-hidden">
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
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {isForRent && (
                            <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Rent
                            </span>
                          )}
                          {isForSale && (
                            <span className="bg-white text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Sale
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleToggleWishlist(car.id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                            isWishlisted ? 'bg-red-500 text-white' : 'bg-black/60 text-gray-300 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                            <span>{car.brand} • {car.year}</span>
                            <span className="flex items-center gap-1 text-white">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {car.rating || 4.9}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                            {car.brand} {car.model}
                          </h3>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-400 mt-2.5">
                            <span>⛽ {car.fuel_type}</span>
                            <span>⚙️ {car.transmission?.split(' ')[0]}</span>
                            <span>💺 {car.seats || 5} Seats</span>
                            <span>📍 Bugesera/Kigali</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-gray-800 flex items-center justify-between">
                          <div>
                            {listingType === 'sale' || (!isForRent && isForSale) ? (
                              <>
                                <span className="text-[10px] uppercase text-gray-400 block font-semibold">Sale Price</span>
                                <span className="text-base font-extrabold text-white">
                                  ${car.sale_price ? car.sale_price.toLocaleString() : (car.price * 150).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] uppercase text-gray-400 block font-semibold">Rate</span>
                                <span className="text-base font-extrabold text-amber-400">
                                  ${car.daily_rental_rate || car.price}
                                  <span className="text-xs font-normal text-gray-400">/day</span>
                                </span>
                              </>
                            )}
                          </div>
                          <Link
                            to={`/car/${car.id}`}
                            className="bg-white hover:bg-amber-400 text-black text-xs font-bold px-3.5 py-2 rounded-xl transition"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;