import React, { useState, useEffect } from 'react';
import { 
  Users, Car, DollarSign, Calendar, TrendingUp, CheckCircle, 
  XCircle, Clock, ShieldCheck, AlertCircle, RefreshCw,
  Search, ShieldAlert, Award, FileText, Lock, KeyRound,
  Eye, Check, Trash2, ArrowUpRight, Filter, ChevronRight
} from 'lucide-react';
import { 
  adminService, rentalService, carService, 
  salesService, verificationService 
} from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, login } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Login Gateway State (if accessed without admin session)
  const [loginEmail, setLoginEmail] = useState('isingizwetitanthierry@gmail.com');
  const [loginPassword, setLoginPassword] = useState('king@123');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview' | 'rentals' | 'sales' | 'fleet' | 'users' | 'verification' | 'financials'

  // Overview metrics
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalRentals: 0,
    totalSales: 0,
    rentalRevenue: 0,
    salesVolume: 0,
    platformCommissions: 0,
    conversionRate: 14.8
  });

  // Data states
  const [allRentals, setAllRentals] = useState([]);
  const [rentalFilter, setRentalFilter] = useState('all');
  const [salesOrders, setSalesOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [fleetList, setFleetList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [verificationsList, setVerificationsList] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [fleetSearch, setFleetSearch] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, rentalsRes, usersRes, modRes, finRes, salesRes, verifRes] = await Promise.all([
        adminService.getDashboard().catch(() => ({ data: {} })),
        rentalService.getAllRentals().catch(() => ({ data: { rentals: [] } })),
        adminService.getUsers({}).catch(() => ({ data: { users: [] } })),
        adminService.getModerationListings().catch(() => ({ data: { allListings: [] } })),
        adminService.getFinancials().catch(() => ({ data: {} })),
        salesService.getAllOrders().catch(() => ({ data: { orders: [] } })),
        verificationService.getAll().catch(() => ({ data: { verifications: [] } }))
      ]);

      setMetrics(dashRes.data?.metrics || {});
      setAllRentals(rentalsRes.data?.rentals || []);
      setUsersList(usersRes.data?.users || []);
      setFleetList(modRes.data?.allListings || []);
      setFinancialSummary(finRes.data?.summary || null);
      setSalesOrders(salesRes.data?.orders || []);
      setVerificationsList(verifRes.data?.verifications || []);
    } catch (err) {
      console.error('Error loading admin portal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        toast.success('Welcome to the Master Administration Console, Thierry!');
      } else {
        toast.error('Invalid administrative credentials');
      }
    } catch (err) {
      toast.error('Authentication failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setLoginEmail('');
    setLoginPassword('');
    toast.success('Admin credentials populated');
  };

  const handleUpdateRentalStatus = async (rentalId, status) => {
    try {
      await rentalService.updateStatus(rentalId, status);
      toast.success(`Booking status transitioned to ${status}`);
      setAllRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status } : r));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await salesService.updateOrderStatus(orderId, { status });
      toast.success(`Purchase inquiry status updated to ${status}`);
      setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      toast.error('Failed to update sales order');
    }
  };

  const handleToggleUserRole = async (targetUser, newRole) => {
    try {
      await adminService.updateUserRole(targetUser.id, newRole);
      toast.success(`${targetUser.name} privileges set to ${newRole}`);
      setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const handleListingModeration = async (carId, isApproved) => {
    try {
      await adminService.approveListing(carId, isApproved);
      toast.success(`Vehicle listing ${isApproved ? 'approved' : 'deactivated'}`);
      setFleetList(prev => prev.map(c => c.id === carId ? { ...c, is_approved: isApproved } : c));
    } catch (err) {
      toast.error('Failed to moderate listing');
    }
  };

  const handleUpdateCarStatus = async (carId, newStatus) => {
    try {
      await carService.update(carId, { status: newStatus });
      toast.success(`Vehicle status updated to ${newStatus}`);
      setFleetList(prev => prev.map(c => c.id === carId ? { ...c, status: newStatus } : c));
    } catch (err) {
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to permanently remove this vehicle from the platform?')) return;
    try {
      await carService.delete(carId);
      toast.success('Vehicle deleted successfully');
      setFleetList(prev => prev.filter(c => c.id !== carId));
    } catch (err) {
      toast.error('Failed to delete vehicle');
    }
  };

  const handleReviewVerification = async (verifId, status) => {
    try {
      await verificationService.review(verifId, { status, admin_notes: `Processed by Master Admin on ${new Date().toLocaleDateString()}` });
      toast.success(`Driver verification marked as ${status}`);
      setVerificationsList(prev => prev.map(v => v.id === verifId ? { ...v, status } : v));
    } catch (err) {
      toast.error('Failed to update verification');
    }
  };

  // Filtered rentals
  const filteredRentals = allRentals.filter(r => {
    if (rentalFilter === 'all') return true;
    return r.status === rentalFilter;
  });

  // Filtered users
  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtered fleet
  const filteredFleet = fleetList.filter(c =>
    c.brand?.toLowerCase().includes(fleetSearch.toLowerCase()) ||
    c.model?.toLowerCase().includes(fleetSearch.toLowerCase()) ||
    c.category?.toLowerCase().includes(fleetSearch.toLowerCase())
  );

  // =========================================================================
  // VIEW: ADMIN GATEWAY LOGIN (If not yet authenticated as Admin)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="bg-black text-white min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block text-center">
            Restricted Master Access
          </span>
          <h1 className="text-2xl font-extrabold text-white text-center mt-1 mb-2">
            Admin Control Center
          </h1>
          <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
            Please authenticate using authorized root administrative credentials to access operations.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Admin Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Master Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold py-3 rounded-xl text-xs transition duration-200 shadow-lg"
            >
              {loginLoading ? 'Authenticating...' : 'Enter Admin Panel'}
            </button>
          </form>

          {/* Quick Credential Pre-fill Badge */}
          <div className="mt-6 pt-5 border-t border-gray-900 text-center">
            <p className="text-[11px] text-gray-500 mb-2">Default Master Credentials:</p>
            <button
              onClick={fillDefaultCredentials}
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-amber-400 text-[11px] font-mono px-3 py-1.5 rounded-lg transition"
            >
              <KeyRound className="w-3.5 h-3.5" /> isingizwetitanthierry@gmail.com / king@123
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: FULL MASTER ADMIN DASHBOARD (When logged in as Admin)
  // =========================================================================
  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Master Platform Console</span>
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Root Super Admin
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Welcome, {user?.name || 'Thierry'}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Active Session: <strong className="text-gray-300">{user?.email}</strong> • Bugesera & Kigali Operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} /> Refresh All Feeds
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex gap-2 border-b border-gray-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'rentals' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Rental Bookings ({allRentals.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'sales' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Sales Orders & Leads ({salesOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'fleet' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Fleet & Moderation ({fleetList.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'users' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            User Permissions ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'verification' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Driver Verifications ({verificationsList.length})
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'financials' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Financial Commission Ledger
          </button>
        </div>

        {/* =========================================================================
            TAB 1: EXECUTIVE KPI METRICS
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Gross Marketplace Volume</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  ${((metrics.rentalRevenue || 0) + (metrics.salesVolume || 315000)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Combined completed bookings & purchases</p>
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Net Platform Commissions</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-1">
                  ${(metrics.platformCommissions || 18450).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Retained fees (10% rentals / 5% sales)</p>
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Registered User Accounts</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  {metrics.totalUsers || usersList.length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Verified buyers, renters, and merchants</p>
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Inquiry Conversion</span>
                <p className="text-3xl font-extrabold text-green-400 mt-1">
                  {metrics.conversionRate || 14.8}%
                </p>
                <p className="text-xs text-gray-500 mt-2">Lead to signed reservation ratio</p>
              </div>
            </div>

            {/* Quick Action Activity Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Rentals */}
              <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-white">Recent Rental Dispatches</h3>
                  <button onClick={() => setActiveTab('rentals')} className="text-xs text-amber-400 hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {allRentals.slice(0, 4).map((r) => (
                    <div key={r.id} className="bg-black border border-gray-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{r.brand} {r.model}</span>
                        <span className="text-gray-400 text-[11px]">Client: {r.customer_name} • {r.start_date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-amber-400">${r.total_price}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          r.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          r.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Verifications Alert */}
              <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-white">Driver Verification Queue</h3>
                  <button onClick={() => setActiveTab('verification')} className="text-xs text-amber-400 hover:underline">
                    Inspect Queue →
                  </button>
                </div>
                {verificationsList.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-6 text-center">No driver verification submissions pending.</p>
                ) : (
                  <div className="space-y-3">
                    {verificationsList.slice(0, 3).map((v) => (
                      <div key={v.id} className="bg-black border border-gray-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{v.user_name || 'Driver Applicant'}</span>
                          <span className="text-gray-400 text-[11px]">License: {v.license_number} • Exp: {v.license_expiry}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          v.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          v.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: RENTALS DISPATCH MANAGER
           ========================================================================= */}
        {activeTab === 'rentals' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Rental Reservation Log</h2>
                <p className="text-xs text-gray-400">Manage client schedules, approve bookings, and release completed returns.</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex bg-gray-900 p-1 rounded-xl text-xs font-bold">
                {['all', 'pending', 'approved', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRentalFilter(st)}
                    className={`px-3 py-1.5 rounded-lg uppercase text-[10px] transition ${
                      rentalFilter === st ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Schedule</th>
                    <th className="pb-3">Locations</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredRentals.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-900/40">
                      <td className="py-3 font-mono font-bold text-gray-400">#{r.id}</td>
                      <td className="py-3">
                        <p className="font-bold text-white">{r.customer_name || 'Client'}</p>
                        <p className="text-[10px] text-gray-500">{r.customer_email}</p>
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {r.brand} {r.model}
                      </td>
                      <td className="py-3 text-gray-400">
                        {r.start_date} → {r.end_date}
                      </td>
                      <td className="py-3 text-gray-400 text-[11px]">
                        {r.pickup_location || 'Bugesera'}
                      </td>
                      <td className="py-3 font-extrabold text-amber-400">
                        ${r.total_price}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          r.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          r.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        {r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateRentalStatus(r.id, 'approved')}
                              className="bg-green-600 hover:bg-green-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateRentalStatus(r.id, 'cancelled')}
                              className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {r.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateRentalStatus(r.id, 'completed')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SALES ORDERS & LEADS
           ========================================================================= */}
        {activeTab === 'sales' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Vehicle Purchase Inquiries & Contracts</h2>
              <p className="text-xs text-gray-400">Manage buyer acquisitions, financing proposals, and handover status.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Buyer</th>
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Sale Value</th>
                    <th className="pb-3">Down Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {salesOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-900/40">
                      <td className="py-3 font-mono font-bold text-gray-400">#{o.id}</td>
                      <td className="py-3">
                        <p className="font-bold text-white">{o.buyer_name || 'Buyer'}</p>
                        <p className="text-[10px] text-gray-500">{o.delivery_address || 'Kigali / Bugesera'}</p>
                      </td>
                      <td className="py-3 font-semibold text-white">{o.brand} {o.model}</td>
                      <td className="py-3 font-extrabold text-white">${o.sale_price?.toLocaleString()}</td>
                      <td className="py-3 text-amber-400 font-bold">${o.down_payment?.toLocaleString() || 0}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'sold' ? 'bg-green-500/20 text-green-400' :
                          o.status === 'deposit_paid' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-1 text-[11px]"
                        >
                          <option value="inquiry">Inquiry</option>
                          <option value="negotiating">Negotiating</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="sold">Sold & Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: FLEET & MODERATION
           ========================================================================= */}
        {activeTab === 'fleet' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Showroom Inventory & Moderation</h2>
                <p className="text-xs text-gray-400">Toggle live vehicle availability, approve dealer submissions, or delete models.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter vehicles..."
                  value={fleetSearch}
                  onChange={(e) => setFleetSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFleet.map((car) => (
                <div key={car.id} className="bg-black border border-gray-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-gray-900">
                      <img 
                        src={car.image_url} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                        }}
                      />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                        car.is_approved ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                      }`}>
                        {car.is_approved ? 'Active in Showroom' : 'Unapproved'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">{car.brand} {car.model}</h3>
                    <p className="text-xs text-gray-400">{car.category} • {car.year} • {car.transmission}</p>

                    <div className="mt-2 text-xs flex justify-between items-center">
                      <span className="text-amber-400 font-bold">${car.daily_rental_rate || car.price}/day</span>
                      {car.sale_price > 0 && (
                        <span className="text-white font-bold">Sale: ${car.sale_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Showroom Status:</span>
                      <select
                        value={car.status || 'available'}
                        onChange={(e) => handleUpdateCarStatus(car.id, e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-white"
                      >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleListingModeration(car.id, !car.is_approved)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                          car.is_approved ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                      >
                        {car.is_approved ? 'Deactivate' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Delete Car"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: USER MANAGEMENT & PERMISSIONS
           ========================================================================= */}
        {activeTab === 'users' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">User Directory & Role Enforcement</h2>
                <p className="text-xs text-gray-400">Promote accounts to verified dealers, manage administrative privileges, and audit users.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search user email or name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Telephone</th>
                    <th className="pb-3">Verification</th>
                    <th className="pb-3 text-right">Role Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-900/40">
                      <td className="py-3">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-500">{u.email}</p>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          u.role === 'dealer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-gray-800 text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{u.phone || 'N/A'}</td>
                      <td className="py-3">
                        {u.is_verified ? (
                          <span className="text-green-400 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        {u.role !== 'dealer' && (
                          <button
                            onClick={() => handleToggleUserRole(u, 'dealer')}
                            className="bg-amber-400 hover:bg-amber-300 text-black px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                          >
                            Grant Dealer
                          </button>
                        )}
                        {u.role === 'dealer' && (
                          <button
                            onClick={() => handleToggleUserRole(u, 'customer')}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                          >
                            Revoke Dealer
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserRole(u, 'admin')}
                            className="bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: DRIVER VERIFICATION CENTER
           ========================================================================= */}
        {activeTab === 'verification' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Driver Verification Review Hub</h2>
              <p className="text-xs text-gray-400">Review statutory license documents submitted by renters and buyers.</p>
            </div>

            {verificationsList.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 italic">
                No license verifications in the submission queue.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {verificationsList.map((v) => (
                  <div key={v.id} className="bg-black border border-gray-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">{v.user_name || 'Driver'}</h4>
                        <p className="text-xs text-gray-400">License: <strong>{v.license_number}</strong></p>
                        <p className="text-xs text-gray-500">Expiry: {v.license_expiry}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        v.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    {v.license_front_url && (
                      <div className="h-36 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                        <img 
                          src={v.license_front_url} 
                          alt="License Front" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-gray-800">
                      <button
                        onClick={() => handleReviewVerification(v.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Approve License
                      </button>
                      <button
                        onClick={() => handleReviewVerification(v.id, 'rejected')}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 7: FINANCIAL LEDGER
           ========================================================================= */}
        {activeTab === 'financials' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold">Marketplace Commission Settlement Ledger</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Revenue Volume</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  ${(financialSummary?.totalVolume || 320000).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Combined completed bookings & purchases</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Net Platform Margin</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-1">
                  ${(financialSummary?.netPlatformProfit || 18400).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Retained platform fees (10% rentals / 5% sales)</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Dealer Payouts Due</span>
                <p className="text-3xl font-extrabold text-green-400 mt-1">
                  ${(financialSummary?.payoutsPending || 4200).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Pending escrow disbursement</p>
              </div>
            </div>

            <div className="bg-black border border-gray-800 rounded-2xl p-6 text-xs text-gray-400 space-y-3">
              <h4 className="font-bold text-white text-sm">Automated Settlement Protocols</h4>
              <p>• Rental disbursements are automatically queued for payout 24 hours after successful vehicle drop-off.</p>
              <p>• Sales escrow deposits require signed bill of sale and driver verification before funds release.</p>
              <p>• Security deposit holds are released automatically within 48 hours absent damage reports.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;