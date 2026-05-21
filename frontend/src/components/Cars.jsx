import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Filter, Star, Fuel, Users, Settings } from 'lucide-react';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'https://transportoperation-1.onrender.com';

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      console.log('Fetching cars from:', `${API_URL}/api/cars`);
      
      const response = await axios.get(`${API_URL}/api/cars`);
      console.log('API Response:', response.data);
      
      // Extract cars array from response
      let carsArray = [];
      if (response.data && Array.isArray(response.data)) {
        carsArray = response.data;
      } else if (response.data && response.data.cars && Array.isArray(response.data.cars)) {
        carsArray = response.data.cars;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        carsArray = response.data.data;
      } else {
        carsArray = [];
      }
      
      setCars(carsArray);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      toast.error('Failed to fetch cars');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering - only if cars is an array
  const filteredCars = Array.isArray(cars) && cars.length > 0
    ? cars.filter(car => {
        const brandMatch = (car.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
        const modelMatch = (car.model || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = brandMatch || modelMatch;
        const matchesFilter = filterType === 'all' || (car.fuel_type || '') === filterType;
        return matchesSearch && matchesFilter;
      })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Fleet</h1>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by brand or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {searchTerm || filterType !== 'all' 
              ? 'No cars found matching your criteria.' 
              : 'No cars available. Please check back later.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300">
              <img 
                src={car.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500"} 
                alt={`${car.brand || ''} ${car.model || ''}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500";
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
                    <p className="text-gray-400 text-sm">{car.year || 'N/A'}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm ml-1">4.8</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Fuel className="w-4 h-4" />
                      <span>Fuel</span>
                    </div>
                    <span>{car.fuel_type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Transmission</span>
                    </div>
                    <span>{car.transmission || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Seats</span>
                    </div>
                    <span>5 seats</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-white">${car.price || '0'}</span>
                    <span className="text-gray-400">/day</span>
                  </div>
                  <Link to={`/car/${car.id}`} className="btn-primary px-4 py-2">
                    Rent Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;