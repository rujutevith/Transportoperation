import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit, Trash2, Car as CarIcon, Fuel, DollarSign, Gauge, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars');
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`/api/cars/${id}`);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        toast.error('Failed to delete car');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Car Inventory</h1>
        <button
          onClick={() => navigate('/add')}
          className="btn-primary flex items-center space-x-2"
        >
          <span>Add New Car</span>
        </button>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <CarIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No cars found. Add your first car!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 mb-4">Total Cars: {cars.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="card">
                {car.image_url && (
                  <img 
                    src={car.image_url} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{car.brand} {car.model}</h3>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{car.year}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit/${car.id}`)}
                        className="p-2 text-gray-400 hover:text-white transition duration-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-gray-300">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Price</span>
                      </div>
                      <span className="font-semibold">${parseFloat(car.price).toLocaleString()}</span>
                    </div>
                    
                    {car.color && (
                      <div className="flex items-center justify-between text-gray-300">
                        <span>Color</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-600" 
                            style={{ backgroundColor: car.color.toLowerCase() }}
                          ></div>
                          <span>{car.color}</span>
                        </div>
                      </div>
                    )}
                    
                    {car.fuel_type && (
                      <div className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Fuel className="w-4 h-4" />
                          <span>Fuel</span>
                        </div>
                        <span>{car.fuel_type}</span>
                      </div>
                    )}
                    
                    {car.transmission && (
                      <div className="flex items-center justify-between text-gray-300">
                        <span>Transmission</span>
                        <span>{car.transmission}</span>
                      </div>
                    )}
                    
                    {car.mileage && (
                      <div className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Gauge className="w-4 h-4" />
                          <span>Mileage</span>
                        </div>
                        <span>{parseInt(car.mileage).toLocaleString()} miles</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarList;