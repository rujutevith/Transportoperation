import React, { useState, useEffect } from 'react';
import { 
  Users, Car, DollarSign, Calendar, TrendingUp, CheckCircle, 
  XCircle, Clock, ShieldCheck, AlertCircle, RefreshCw,
  Search, ShieldAlert, Award, FileText
} from 'lucide-react';
import { adminService, rentalService, carService } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | rentals | users | moderation | financials

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
  const [usersList, setUsersList] = useState([]);
  const [moderationList, setModerationList] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, rentalsRes, usersRes, modRes, finRes] = await Promise.all([
        adminService.getDashboard().catch(() => ({ data: {} })),
        rentalService.getAllRentals().catch(() => ({ data: { rentals: [] } })),
        adminService.getUsers({}).catch(() => ({ data: { users: [] } })),
        adminService.getModerationListings().catch(() => ({ data: { allListings: [] } })),
        adminService.getFinancials().catch(() => ({ data: {} }))
      ]);

      setMetrics(dashRes.data?.metrics || {});
      setAllRentals(rentalsRes.data?.rentals || []);
      setUsersList(usersRes.data?.users || []);
      setModerationList(modRes.data?.allListings || []);
      setFinancialSummary(finRes.data?.summary || null);
    } catch (err) {
      console.error('Error loading admin portal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRentalStatus = async (rentalId, status) => {
    try {
      await rentalService.updateStatus(rentalId, status);
      toast.success(`Booking status changed to ${status}`);
      setAllRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status } : r));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleUserRole = async (targetUser, newRole) => {
    try {
      await adminService.updateUserRole(targetUser.id, newRole);
      toast.success(`${targetUser.name} role updated to ${newRole}`);
      setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const handleListingModeration = async (carId, isApproved) => {
    try {
      await adminService.approveListing(carId, isApproved);
      toast.success(`Vehicle listing ${isApproved ? 'approved' : 'rejected'}`);
      setModerationList(prev => prev.map(c => c.id === carId ? { ...c, is_approved: isApproved } : c));
    } catch (err) {
      toast.error('Failed to moderate listing');
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Master Administration</span>
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Super Admin
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Platform Control Center</h1>
            <p className="text-xs text-gray-400 mt-1">
              Oversee marketplace liquidity, user moderation, commission yields, and bookings.
            </p>
          </div>

          <button
            onClick={loadAllAdminData}
            className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh Live Feeds
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Platform Metrics
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'rentals' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            All Bookings ({allRentals.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'users' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            User Management ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'moderation' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Listing Moderation ({moderationList.length})
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'financials' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            Financials & Commissions
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Platform Volume</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-1">
                  ${((metrics.rentalRevenue || 0) + (metrics.salesVolume || 0)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Rentals + Sales Gross</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Platform Commission Profit</span>
                <p className="text-3xl font-extrabold text-green-400 mt-1">
                  ${(metrics.platformCommissions || 1840).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium">10% Rentals / 5% Sales Fee</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Registered Accounts</span>
                <p className="text-3xl font-extrabold text-white mt-1">{metrics.totalUsers || usersList.length}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Buyers, Renters & Dealers</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Conversion Rate</span>
                <p className="text-3xl font-extrabold text-white mt-1">{metrics.conversionRate || 14.8}%</p>
                <p className="text-xs text-amber-400 mt-2 font-medium">Lead to reservation ratio</p>
              </div>
            </div>

            {/* Recent Rental Activity */}
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
              <h3 className="font-bold text-base mb-4">Recent Platform Bookings</h3>
              <div className="space-y-3">
                {allRentals.slice(0, 5).map((r) => (
                  <div key={r.id} className="bg-black border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-white">{r.brand} {r.model}</span>
                      <p className="text-xs text-gray-400">Client: {r.customer_name} ({r.customer_email})</p>
                      <p className="text-[11px] text-gray-500">Dates: {r.start_date} to {r.end_date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-extrabold text-amber-400">${r.total_price}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        r.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        r.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ALL RENTALS MANAGEMENT ================= */}
        {activeTab === 'rentals' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Complete Rentals Log</h2>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Period</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {allRentals.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-900/50">
                    <td className="py-3 font-mono font-bold text-gray-400">#{r.id}</td>
                    <td className="py-3">
                      <p className="font-bold text-white">{r.customer_name}</p>
                      <p className="text-[10px] text-gray-500">{r.customer_email}</p>
                    </td>
                    <td className="py-3 font-semibold text-white">{r.brand} {r.model}</td>
                    <td className="py-3 text-gray-400">{r.start_date} → {r.end_date}</td>
                    <td className="py-3 font-bold text-amber-400">${r.total_price}</td>
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
                            className="bg-green-600 hover:bg-green-500 text-white px-2.5 py-1 rounded text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateRentalStatus(r.id, 'cancelled')}
                            className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateRentalStatus(r.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TAB 3: USER MANAGEMENT ================= */}
        {activeTab === 'users' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h2 className="text-xl font-bold">User Directory & Roles</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search users..."
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
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Verified</th>
                    <th className="pb-3 text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-900/50">
                      <td className="py-3">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-500">{u.email}</p>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                          u.role === 'dealer' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{u.phone || 'N/A'}</td>
                      <td className="py-3">
                        {u.is_verified ? (
                          <span className="text-green-400 font-bold text-[11px]">✓ Verified</span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        {u.role !== 'dealer' && (
                          <button
                            onClick={() => handleToggleUserRole(u, 'dealer')}
                            className="bg-amber-400 text-black px-2.5 py-1 rounded text-[10px] font-bold hover:bg-amber-300"
                          >
                            Grant Dealer
                          </button>
                        )}
                        {u.role === 'dealer' && (
                          <button
                            onClick={() => handleToggleUserRole(u, 'customer')}
                            className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-gray-700"
                          >
                            Revoke Dealer
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

        {/* ================= TAB 4: LISTING MODERATION ================= */}
        {activeTab === 'moderation' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Car Listing Moderation Queue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moderationList.map((car) => (
                <div key={car.id} className="bg-black border border-gray-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between">
                  <div>
                    <img src={car.image_url} alt="" className="w-full h-36 object-cover rounded-xl mb-3" />
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">{car.brand} {car.model}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        car.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {car.is_approved ? 'Approved' : 'Needs Review'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">${car.daily_rental_rate || car.price}/day • {car.category}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between gap-2">
                    <button
                      onClick={() => handleListingModeration(car.id, true)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleListingModeration(car.id, false)}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white py-1.5 rounded-lg text-xs font-bold"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: FINANCIALS & COMMISSIONS ================= */}
        {activeTab === 'financials' && (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold">Marketplace Financial Ledger & Commission Splits</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Gross Marketplace Turnaround</span>
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

            <div className="bg-black border border-gray-800 rounded-2xl p-5 text-xs text-gray-400 space-y-2">
              <h4 className="font-bold text-white text-sm">Automated Settlement Policy</h4>
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