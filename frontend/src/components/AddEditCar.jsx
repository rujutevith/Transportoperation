import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const AddEditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`/api/cars/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch car details');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (id) {
        await axios.put(`/api/cars/${id}`, formData);
        toast.success('Car updated successfully');
      } else {
        await axios.post('/api/cars', formData);
        toast.success('Car added successfully');
      }
      navigate('/');
    } catch (error) {
      toast.error(id ? 'Failed to update car' : 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Car' : 'Add New Car'}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Brand *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Toyota"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Camry"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="2024"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="25000"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="input-field"
              placeholder="Black"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Fuel Type</label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Mileage (miles)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="input-field"
              placeholder="0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/car-image.jpg"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : (id ? 'Update Car' : 'Add Car')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCar;