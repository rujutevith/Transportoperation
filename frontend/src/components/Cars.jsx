import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Fuel, Settings, Users, Star, Search } from 'lucide-react';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://transportoperation-1.onrender.com';

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/cars`);
      console.log('API Response:', response.data);
      
      // Handle different response formats
      let carsArray = [];
      if (response.data && response.data.success && Array.isArray(response.data.cars)) {
        carsArray = response.data.cars;
      } else if (Array.isArray(response.data)) {
        carsArray = response.data;
      } else if (response.data && response.data.cars && Array.isArray(response.data.cars)) {
        carsArray = response.data.cars;
      } else {
        carsArray = [];
      }
      
      setCars(carsArray);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars. Please try again later.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car => {
    const search = searchTerm.toLowerCase();
    return (car.brand || '').toLowerCase().includes(search) ||
           (car.model || '').toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">{error}</p>
        <button 
          onClick={fetchCars} 
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">Our Fleet</h1>
      <p className="text-gray-400 text-center mb-12">Choose from our exclusive collection of premium vehicles</p>
      
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
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
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {searchTerm ? 'No cars found matching your search.' : 'No cars available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl transition duration-300">
              <div className="relative overflow-hidden h-64">
                <img 
                  src={car.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80"} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80";
                  }}
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  4.9
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                    <p className="text-gray-400 text-sm">{car.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${car.price}</p>
                    <p className="text-gray-400 text-xs">/day</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Fuel className="w-4 h-4" />
                    <span>{car.fuel_type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Settings className="w-4 h-4" />
                    <span>{car.transmission || 'Auto'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>4 Seats</span>
                  </div>
                </div>
                
                <Link to={`/car/${car.id}`} className="btn-primary w-full block text-center text-sm py-3">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;