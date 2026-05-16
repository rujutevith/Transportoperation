import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, Car, Settings, BarChart, Trash2, Edit, Plus } from 'lucide-react';

const AdminPanel = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    color: '',
    fuel_type: '',
    transmission: '',
    mileage: '',
    image_url: ''
  });

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [activeTab, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cars') {
        const response = await axios.get('/api/cars');
        setCars(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get('/api/auth/users');
        setUsers(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await axios.put(`/api/cars/${editingCar.id}`, carForm);
        toast.success('Car updated successfully');
      } else {
        await axios.post('/api/cars', carForm);
        toast.success('Car added successfully');
      }
      setShowAddModal(false);
      setEditingCar(null);
      setCarForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        color: '',
        fuel_type: '',
        transmission: '',
        mileage: '',
        image_url: ''
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to save car');
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`/api/cars/${id}`);
        toast.success('Car deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete car');
      }
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarForm(car);
    setShowAddModal(true);
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('cars')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'cars'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Car className="w-5 h-5 inline mr-2" />
          Manage Cars
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'users'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'stats'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart className="w-5 h-5 inline mr-2" />
          Statistics
        </button>
      </div>

      {/* Cars Management */}
      {activeTab === 'cars' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Car Inventory</h2>
            <button
              onClick={() => {
                setEditingCar(null);
                setCarForm({
                  brand: '',
                  model: '',
                  year: new Date().getFullYear(),
                  price: '',
                  color: '',
                  fuel_type: '',
                  transmission: '',
                  mileage: '',
                  image_url: ''
                });
                setShowAddModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Car</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Brand</th>
                    <th className="px-4 py-3 text-left">Model</th>
                    <th className="px-4 py-3 text-left">Year</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b border-gray-800">
                      <td className="px-4 py-3">{car.id}</td>
                      <td className="px-4 py-3">{car.brand}</td>
                      <td className="px-4 py-3">{car.model}</td>
                      <td className="px-4 py-3">{car.year}</td>
                      <td className="px-4 py-3">${car.price}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="text-blue-500 hover:text-blue-400 mr-3"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">User Management</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {activeTab === 'stats' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Statistics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Car className="w-8 h-8 text-white" />
                <span className="text-3xl font-bold">{cars.length}</span>
              </div>
              <p className="text-gray-400">Total Cars</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-white" />
                <span className="text-3xl font-bold">{users.length}</span>
              </div>
              <p className="text-gray-400">Total Users</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart className="w-8 h-8 text-white" />
                <span className="text-3xl font-bold">
                  ${cars.reduce((sum, car) => sum + parseFloat(car.price), 0).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400">Total Value</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-gray-900 rounded-xl w-full max-w-2xl p-8 mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </h2>
            <form onSubmit={handleCarSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Brand *</label>
                  <input
                    type="text"
                    value={carForm.brand}
                    onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Model *</label>
                  <input
                    type="text"
                    value={carForm.model}
                    onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Year *</label>
                  <input
                    type="number"
                    value={carForm.year}
                    onChange={(e) => setCarForm({ ...carForm, year: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Price *</label>
                  <input
                    type="number"
                    value={carForm.price}
                    onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Color</label>
                  <input
                    type="text"
                    value={carForm.color}
                    onChange={(e) => setCarForm({ ...carForm, color: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Fuel Type</label>
                  <select
                    value={carForm.fuel_type}
                    onChange={(e) => setCarForm({ ...carForm, fuel_type: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Transmission</label>
                  <select
                    value={carForm.transmission}
                    onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Mileage</label>
                  <input
                    type="number"
                    value={carForm.mileage}
                    onChange={(e) => setCarForm({ ...carForm, mileage: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={carForm.image_url}
                    onChange={(e) => setCarForm({ ...carForm, image_url: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCar ? 'Update' : 'Add'} Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;