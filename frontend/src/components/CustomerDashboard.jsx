import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Car, Calendar, ShoppingBag, MessageSquare, 
  Heart, ShieldCheck, Clock, CheckCircle, XCircle, 
  AlertCircle, Upload, Send, Trash2, ArrowUpRight,
  MapPin, Phone, Mail, Edit3, KeyRound
} from 'lucide-react';
import { 
  rentalService, salesService, wishlistService, 
  messageService, verificationService, carService 
} from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings | purchases | wishlist | messages | verification | profile

  // Rentals state
  const [rentals, setRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);

  // Sales state
  const [purchases, setPurchases] = useState([]);
  const [testDrives, setTestDrives] = useState([]);

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);

  // Messages state
  const [conversations, setConversations] = useState([]);
  const [activeThreadUser, setActiveThreadUser] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [replyText, setReplyText] = useState('');

  // Verification state
  const [verificationStatus, setVerificationStatus] = useState('none');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licenseFrontUrl, setLicenseFrontUrl] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Quick Rent Modal
  const [showRentModal, setShowRentModal] = useState(false);
  const [availableCars, setAvailableCars] = useState([]);
  const [rentalForm, setRentalForm] = useState({
    car_id: '',
    start_date: '',
    end_date: '',
    pickup_location: 'Bugesera, Nyamata',
    dropoff_location: 'Bugesera, Nyamata'
  });

  useEffect(() => {
    loadRentals();
    loadPurchases();
    loadWishlist();
    loadConversations();
    loadVerification();

    carService.getAll({}).then(res => setAvailableCars(res.data?.cars || [])).catch(() => {});
  }, []);

  const loadRentals = async () => {
    try {
      setRentalsLoading(true);
      const res = await rentalService.getMyRentals();
      setRentals(res.data?.rentals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRentalsLoading(false);
    }
  };

  const loadPurchases = async () => {
    try {
      const res = await salesService.getMyPurchases();
      setPurchases(res.data?.purchases || []);
      setTestDrives(res.data?.testDrives || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await wishlistService.getWishlist();
      setWishlist(res.data?.wishlist || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await messageService.getConversations();
      setConversations(res.data?.conversations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadVerification = async () => {
    try {
      const res = await verificationService.getStatus();
      setVerificationStatus(res.data?.status || 'none');
      if (res.data?.verification) {
        setLicenseNumber(res.data.verification.license_number || '');
        setLicenseExpiry(res.data.verification.license_expiry || '');
        setLicenseFrontUrl(res.data.verification.license_front_url || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelRental = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await rentalService.cancel(id);
      toast.success('Rental request cancelled');
      loadRentals();
    } catch (err) {
      toast.error('Could not cancel rental');
    }
  };

  const handleSelectConversation = async (conv) => {
    setActiveThreadUser(conv.otherUser);
    try {
      const res = await messageService.getThread(conv.otherUser.id);
      setThreadMessages(res.data?.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadUser) return;

    try {
      const res = await messageService.send({
        receiver_id: activeThreadUser.id,
        content: replyText
      });
      setThreadMessages(prev => [...prev, res.data?.message]);
      setReplyText('');
      toast.success('Message sent');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setVerificationLoading(true);
    try {
      await verificationService.upload({
        license_number: licenseNumber,
        license_expiry: licenseExpiry,
        license_front_url: licenseFrontUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
        license_back_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80'
      });
      toast.success('Driver documents submitted! Under expedited review.');
      setVerificationStatus('pending');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleQuickRentSubmit = async (e) => {
    e.preventDefault();
    try {
      await rentalService.book(rentalForm);
      toast.success('Booking requested! Concierge will review.');
      setShowRentModal(false);
      loadRentals();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-extrabold text-2xl shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">Welcome, {user?.name}</h1>
                <span className="text-[10px] font-bold uppercase bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{user?.email} • Member since 2024</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowRentModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Book a Rental
            </button>
            <Link
              to="/cars"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <Car className="w-4 h-4" /> Browse Catalog
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-800 pb-3 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'bookings' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Bookings ({rentals.length})
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'purchases' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Sales & Test Drives ({purchases.length + testDrives.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'wishlist' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'messages' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Inquiries & Chat ({conversations.length})
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'verification' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white bg-gray-950'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Driver's Verification
            {verificationStatus === 'approved' && <span className="w-2 h-2 rounded-full bg-green-400"></span>}
          </button>
        </div>

        {/* ================= TAB 1: RENTAL BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Rental Booking History</h2>
              <button
                onClick={loadRentals}
                className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1"
              >
                Refresh
              </button>
            </div>

            {rentalsLoading ? (
              <div className="py-20 text-center text-gray-500">Loading rentals...</div>
            ) : rentals.length === 0 ? (
              <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10 text-center">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-bold text-base">No active rentals</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">Book your first luxury car for business or leisure.</p>
                <button
                  onClick={() => setShowRentModal(true)}
                  className="bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Book a Vehicle Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((r) => (
                  <div key={r.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Booking #{r.id}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          r.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          r.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          r.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {r.status}
                        </span>
                      </div>

                      {r.image_url && (
                        <img
                          src={r.image_url}
                          alt={r.brand}
                          className="w-full h-36 object-cover rounded-xl mb-3"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                          }}
                        />
                      )}

                      <h3 className="text-base font-bold text-white">{r.brand} {r.model}</h3>
                      <div className="text-xs text-gray-400 space-y-1 mt-2">
                        <p>📅 {r.start_date} to {r.end_date}</p>
                        <p>📍 Pickup: {r.pickup_location || 'Bugesera'}</p>
                        <p>🛡️ Insurance: {r.insurance_option || 'Standard'}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Total Cost</span>
                        <span className="text-base font-extrabold text-amber-400">${r.total_price}</span>
                      </div>

                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRental(r.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PURCHASES & TEST DRIVES ================= */}
        {activeTab === 'purchases' && (
          <div className="space-y-8">
            {/* Purchase Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4">Vehicle Purchase Inquiries</h2>
              {purchases.length === 0 ? (
                <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 text-center text-xs text-gray-400">
                  You have not submitted any car purchase inquiries yet. Explore our For Sale inventory.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchases.map((p) => (
                    <div key={p.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{p.brand} {p.model}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 uppercase">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Inquiry Price: ${p.sale_price?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Down Payment Est: ${p.down_payment?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-2 italic">{p.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Drive Bookings */}
            <div>
              <h2 className="text-xl font-bold mb-4">Scheduled Test Drives</h2>
              {testDrives.length === 0 ? (
                <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 text-center text-xs text-gray-400">
                  No test drives scheduled. You can book one directly on any vehicle page.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testDrives.map((td) => (
                    <div key={td.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{td.brand} {td.model}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">📅 {td.scheduled_date} at {td.scheduled_time}</p>
                        <p className="text-xs text-amber-400 mt-1 font-semibold">📍 Bugesera / Nyamata Showroom</p>
                      </div>
                      <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full uppercase">
                        {td.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: SAVED WISHLIST ================= */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Saved Vehicles ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10 text-center">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-bold text-base">Your wishlist is empty</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">Bookmark cars while browsing to compare or book later.</p>
                <Link to="/cars" className="bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold inline-block">
                  Discover Fleet
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((car) => (
                  <div key={car.id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                    <img 
                      src={car.image_url} 
                      alt={car.brand} 
                      className="w-full h-44 object-cover" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";
                      }}
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">{car.brand} {car.model}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{car.year} • {car.category}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                        <span className="font-extrabold text-amber-400 text-sm">
                          ${car.daily_rental_rate || car.price}/day
                        </span>
                        <Link to={`/car/${car.id}`} className="bg-white hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-xl transition">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: MESSAGES & CHAT ================= */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden min-h-[480px]">
            {/* Conversation List */}
            <div className="border-r border-gray-800 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Conversations</h3>
              {conversations.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No chat history yet.</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectConversation(c)}
                      className={`w-full text-left p-3 rounded-xl transition text-xs ${
                        activeThreadUser?.id === c.otherUser.id ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-gray-900/60 hover:bg-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{c.otherUser.name}</span>
                        {c.unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        )}
                      </div>
                      <p className="text-gray-400 truncate">{c.lastMessage?.content}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thread Window */}
            <div className="md:col-span-2 p-5 flex flex-col justify-between">
              {activeThreadUser ? (
                <>
                  <div className="border-b border-gray-800 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{activeThreadUser.name}</h4>
                      <p className="text-[11px] text-gray-400">Verified Dealer Concierge</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[320px]">
                    {threadMessages.map((m) => {
                      const isMe = m.sender_id === user?.id;
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                            isMe ? 'bg-amber-400 text-black font-medium' : 'bg-gray-900 text-white'
                          }`}>
                            <p>{m.content}</p>
                            <span className="text-[9px] opacity-75 block text-right mt-1">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="bg-amber-400 text-black px-4 rounded-xl font-bold text-xs hover:bg-amber-300 transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-xs text-gray-500">
                  Select a conversation thread on the left to read and send messages.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: DRIVER'S VERIFICATION ================= */}
        {activeTab === 'verification' && (
          <div className="max-w-2xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-400/10 text-amber-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Driver License & Identity Verification</h3>
                <p className="text-xs text-gray-400">Required before self-drive rental handovers and test drives.</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl mb-6 text-xs flex items-center justify-between ${
              verificationStatus === 'approved' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
              verificationStatus === 'pending' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
              'bg-gray-900 border border-gray-800 text-gray-300'
            }`}>
              <div className="flex items-center gap-2">
                {verificationStatus === 'approved' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                <span>
                  Status: <strong>{verificationStatus.toUpperCase()}</strong>
                </span>
              </div>
              {verificationStatus === 'approved' && <span>✓ You are authorized to rent & test-drive</span>}
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Driver's License Number</label>
                <input
                  type="text"
                  placeholder="e.g. RW-DL-982341"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">License Front Photo URL (or Cloudinary / Image URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={licenseFrontUrl}
                  onChange={(e) => setLicenseFrontUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Ensure all details (name, expiry, photo) are legible. Securely processed under GDPR guidelines.
                </p>
              </div>

              <button
                type="submit"
                disabled={verificationLoading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold py-3 rounded-xl text-xs transition duration-300"
              >
                {verificationLoading ? 'Submitting Documents...' : 'Submit Documents for Verification'}
              </button>
            </form>
          </div>
        )}

        {/* Quick Rental Modal */}
        {showRentModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-3">Quick Vehicle Rental</h3>
              <form onSubmit={handleQuickRentSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Select Car</label>
                  <select
                    value={rentalForm.car_id}
                    onChange={(e) => setRentalForm({ ...rentalForm, car_id: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  >
                    <option value="">-- Choose a Car --</option>
                    {availableCars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.brand} {c.model} (${c.daily_rental_rate || c.price}/day)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={rentalForm.start_date}
                      onChange={(e) => setRentalForm({ ...rentalForm, start_date: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={rentalForm.end_date}
                      onChange={(e) => setRentalForm({ ...rentalForm, end_date: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={rentalForm.pickup_location}
                    onChange={(e) => setRentalForm({ ...rentalForm, pickup_location: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRentModal(false)}
                    className="flex-1 bg-gray-900 text-gray-300 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-400 text-black py-2.5 rounded-xl text-xs font-bold"
                  >
                    Reserve Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;