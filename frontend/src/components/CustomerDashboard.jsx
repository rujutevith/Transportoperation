import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { Calendar, Car, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [cars, setCars] = useState([]);
  const [rentalForm, setRentalForm] = useState({
    car_id: '',
    start_date: '',
    end_date: '',
    pickup_location: '',
    dropoff_location: ''
  });

  useEffect(() => {
    fetchMyRentals();
    fetchCars();
  }, []);

  const fetchMyRentals = async () => {
    try {
      const response = await api.get('/api/rentals/my-rentals');
      setRentals(response.data.rentals);
    } catch (error) {
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await api.get('/api/cars');
      setCars(response.data.cars || []);
    } catch (error) {
      console.error('Failed to fetch cars');
    }
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/rentals/rent', rentalForm);
      toast.success(`Rental booked! Total: $${response.data.total_price}`);
      setShowRentModal(false);
      setRentalForm({
        car_id: '', start_date: '', end_date: '', pickup_location: '', dropoff_location: ''
      });
      fetchMyRentals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book rental');
    }
  };

  const handleCancelRental = async (rentalId) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      try {
        await api.put(`/api/rentals/cancel/${rentalId}`);
        toast.success('Rental cancelled');
        fetchMyRentals();
      } catch (error) {
        toast.error('Failed to cancel rental');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Pending</span>,
      approved: <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Approved</span>,
      completed: <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Completed</span>,
      cancelled: <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Cancelled</span>
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={() => setShowRentModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Car className="w-5 h-5" />
          <span>Rent a Car</span>
        </button>
      </div>

      {/* My Rentals Section */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          My Rentals
        </h2>
        
        {rentals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No rentals yet. Rent your first car!</p>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div key={rental.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={rental.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100"} 
                    alt={rental.model}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{rental.brand} {rental.model}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">Total: ${rental.total_price}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(rental.status)}
                  {rental.status === 'pending' && (
                    <button
                      onClick={() => handleCancelRental(rental.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rent Modal */}
      {showRentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setShowRentModal(false)}></div>
          <div className="relative bg-gray-900 rounded-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-xl font-bold mb-4">Rent a Car</h2>
            <form onSubmit={handleRentSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Select Car</label>
                <select
                  className="input-field"
                  value={rentalForm.car_id}
                  onChange={(e) => setRentalForm({...rentalForm, car_id: e.target.value})}
                  required
                >
                  <option value="">Choose a car</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} - ${car.price}/day
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={rentalForm.start_date}
                  onChange={(e) => setRentalForm({...rentalForm, start_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={rentalForm.end_date}
                  onChange={(e) => setRentalForm({...rentalForm, end_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Pickup Location</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Kigali, Rwanda"
                  value={rentalForm.pickup_location}
                  onChange={(e) => setRentalForm({...rentalForm, pickup_location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Dropoff Location</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Same as pickup"
                  value={rentalForm.dropoff_location}
                  onChange={(e) => setRentalForm({...rentalForm, dropoff_location: e.target.value})}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowRentModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Confirm Rental
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;