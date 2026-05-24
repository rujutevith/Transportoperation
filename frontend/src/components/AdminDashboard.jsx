import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { Users, Car, Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [allRentals, setAllRentals] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerRentals, setCustomerRentals] = useState([]);
  const [activeTab, setActiveTab] = useState('rentals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'rentals') {
        const response = await api.get('/api/rentals/all-rentals');
        setAllRentals(response.data.rentals);
      } else if (activeTab === 'customers') {
        const response = await api.get('/api/rentals/customers');
        setCustomers(response.data.customers);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerRentals = async (userId, userName) => {
    try {
      const response = await api.get(`/api/rentals/customer-rentals/${userId}`);
      setCustomerRentals(response.data.rentals);
      setSelectedCustomer({ id: userId, name: userName });
    } catch (error) {
      toast.error('Failed to fetch customer rentals');
    }
  };

  const updateRentalStatus = async (rentalId, status) => {
    try {
      await api.put(`/api/rentals/update-status/${rentalId}`, { status });
      toast.success(`Rental ${status}`);
      fetchData();
      if (selectedCustomer) {
        fetchCustomerRentals(selectedCustomer.id, selectedCustomer.name);
      }
    } catch (error) {
      toast.error('Failed to update status');
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
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome back, {user?.name}!</p>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('rentals')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'rentals'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          All Rentals
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'customers'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Customers
        </button>
      </div>

      {/* All Rentals Tab */}
      {activeTab === 'rentals' && (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Customer</th>
                  <th className="px-4 py-3 text-left text-sm">Car</th>
                  <th className="px-4 py-3 text-left text-sm">Dates</th>
                  <th className="px-4 py-3 text-left text-sm">Total</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allRentals.map((rental) => (
                  <tr key={rental.id} className="border-b border-gray-800">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{rental.user_name}</p>
                        <p className="text-xs text-gray-500">{rental.user_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {rental.brand} {rental.model}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">
                        {new Date(rental.start_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        to {new Date(rental.end_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">${rental.total_price}</td>
                    <td className="px-4 py-3">{getStatusBadge(rental.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {rental.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRentalStatus(rental.id, 'approved')}
                              className="text-green-400 hover:text-green-300"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => updateRentalStatus(rental.id, 'cancelled')}
                              className="text-red-400 hover:text-red-300"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {rental.status === 'approved' && (
                          <button
                            onClick={() => updateRentalStatus(rental.id, 'completed')}
                            className="text-blue-400 hover:text-blue-300"
                            title="Complete"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold mb-4">All Customers</h3>
            <div className="space-y-2">
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => fetchCustomerRentals(customer.id, customer.name)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-400">{customer.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{customer.total_rentals} rentals</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-4">
            {selectedCustomer ? (
              <>
                <h3 className="font-semibold mb-4">
                  {selectedCustomer.name}'s Rentals
                </h3>
                {customerRentals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No rentals yet</p>
                ) : (
                  <div className="space-y-3">
                    {customerRentals.map((rental) => (
                      <div key={rental.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{rental.brand} {rental.model}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm">${rental.total_price}</p>
                        </div>
                        <div>{getStatusBadge(rental.status)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">Select a customer to view their rentals</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;