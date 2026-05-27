import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  Users, Car, Calendar, DollarSign, TrendingUp, 
  CheckCircle, XCircle, Clock, Eye, Search, 
  Download, RefreshCw, UserCheck, UserX 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [allRentals, setAllRentals] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerRentals, setCustomerRentals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRentals: 0,
    totalRevenue: 0,
    pendingRentals: 0,
    approvedRentals: 0,
    completedRentals: 0,
    cancelledRentals: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all customers
      const customersRes = await api.get('/api/rentals/customers');
      setCustomers(customersRes.data.customers || []);
      
      // Fetch all rentals
      const rentalsRes = await api.get('/api/rentals/all-rentals');
      const rentals = rentalsRes.data.rentals || [];
      setAllRentals(rentals);
      
      // Calculate stats
      const totalRevenue = rentals.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
      setStats({
        totalUsers: customersRes.data.customers?.length || 0,
        totalRentals: rentals.length,
        totalRevenue: totalRevenue,
        pendingRentals: rentals.filter(r => r.status === 'pending').length,
        approvedRentals: rentals.filter(r => r.status === 'approved').length,
        completedRentals: rentals.filter(r => r.status === 'completed').length,
        cancelledRentals: rentals.filter(r => r.status === 'cancelled').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerRentals = async (userId, userName) => {
    try {
      const response = await api.get(`/api/rentals/customer-rentals/${userId}`);
      setCustomerRentals(response.data.rentals || []);
      setSelectedCustomer({ id: userId, name: userName });
    } catch (error) {
      toast.error('Failed to fetch customer rentals');
    }
  };

  const updateRentalStatus = async (rentalId, status) => {
    try {
      await api.put(`/api/rentals/update-status/${rentalId}`, { status });
      toast.success(`Rental ${status} successfully`);
      fetchDashboardData();
      if (selectedCustomer) {
        fetchCustomerRentals(selectedCustomer.id, selectedCustomer.name);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>,
      approved: <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>,
      completed: <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>,
      cancelled: <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>
    };
    return badges[status] || badges.pending;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-200 text-sm">Total Rentals</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalRentals}</p>
            </div>
            <Car className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-200 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-yellow-200 text-sm">Pending Rentals</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.pendingRentals}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'overview'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Overview
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
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Rentals */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Rentals</h2>
            <div className="space-y-3">
              {allRentals.slice(0, 5).map((rental) => (
                <div key={rental.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{rental.user_name}</p>
                    <p className="text-sm text-gray-400">{rental.brand} {rental.model}</p>
                    <p className="text-xs text-gray-500">{new Date(rental.start_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${rental.total_price}</p>
                    {getStatusBadge(rental.status)}
                  </div>
                </div>
              ))}
              {allRentals.length === 0 && (
                <p className="text-gray-400 text-center py-4">No rentals yet</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Rental Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Pending</span>
                  <span>{stats.pendingRentals}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.pendingRentals / stats.totalRentals) * 100 || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Approved</span>
                  <span>{stats.approvedRentals}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.approvedRentals / stats.totalRentals) * 100 || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Completed</span>
                  <span>{stats.completedRentals}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.completedRentals / stats.totalRentals) * 100 || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Cancelled</span>
                  <span>{stats.cancelledRentals}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.cancelledRentals / stats.totalRentals) * 100 || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-1 bg-gray-900 rounded-xl p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => fetchCustomerRentals(customer.id, customer.name)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedCustomer?.id === customer.id ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                >
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-400">{customer.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{customer.total_rentals} rentals</p>
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="text-gray-400 text-center py-4">No customers found</p>
              )}
            </div>
          </div>

          {/* Customer Rentals */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-4">
            {selectedCustomer ? (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedCustomer.name}'s Rentals
                </h3>
                {customerRentals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No rentals yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {customerRentals.map((rental) => (
                      <div key={rental.id} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{rental.brand} {rental.model}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">Total: ${rental.total_price}</p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(rental.status)}
                            {rental.status === 'pending' && (
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() => updateRentalStatus(rental.id, 'approved')}
                                  className="text-green-400 hover:text-green-300 text-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateRentalStatus(rental.id, 'cancelled')}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {rental.status === 'approved' && (
                              <button
                                onClick={() => updateRentalStatus(rental.id, 'completed')}
                                className="text-blue-400 hover:text-blue-300 text-xs mt-2"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
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

      {/* All Rentals Tab */}
      {activeTab === 'rentals' && (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Customer</th>
                  <th className="px-4 py-3 text-left text-sm">Car</th>
                  <th className="px-4 py-3 text-left text-sm">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm">End Date</th>
                  <th className="px-4 py-3 text-left text-sm">Total</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allRentals.map((rental) => (
                  <tr key={rental.id} className="border-b border-gray-800">
                    <td className="px-4 py-3">
                      <p className="font-medium">{rental.user_name}</p>
                      <p className="text-xs text-gray-500">{rental.user_email}</p>
                    </td>
                    <td className="px-4 py-3">{rental.brand} {rental.model}</td>
                    <td className="px-4 py-3">{new Date(rental.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{new Date(rental.end_date).toLocaleDateString()}</td>
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
                {allRentals.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">
                      No rentals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;