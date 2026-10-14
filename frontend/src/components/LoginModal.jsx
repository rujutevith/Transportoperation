import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Phone, KeyRound } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = '954770624824-vc9tci3jk9di1t1qo0tkgumei4qsu1aa.apps.googleusercontent.com';

const LoginModalContent = ({ isOpen, onClose }) => {
  const { login, register, googleLogin, forgotPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer'); // 'customer' | 'dealer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    const success = await forgotPassword(formData.email);
    setLoading(false);
    if (success) {
      setIsForgot(false);
      setIsLogin(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!isLogin && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    let success;
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.name, formData.email, formData.password, role);
    }
    
    if (success) {
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
      onClose();
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      toast.error('Google login failed');
      return;
    }
    
    setLoading(true);
    try {
      const success = await googleLogin(credentialResponse);
      if (success) {
        toast.success('Google login successful!');
        onClose();
      }
    } catch (error) {
      toast.error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please use email and password.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-extrabold mb-1 text-center">
          {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          {isForgot ? 'Enter your registered email to receive a secure reset link.' :
           isLogin ? 'Access your bookings, purchases, and dealer dashboard.' :
           'Join Rwanda’s premier car sales and rental marketplace.'}
        </p>

        {isForgot ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black py-2.5 rounded-xl font-bold text-xs transition"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsForgot(false); setIsLogin(true); }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      role === 'customer' ? 'bg-amber-400 text-black shadow' : 'bg-gray-900 text-gray-400'
                    }`}
                  >
                    Buyer / Renter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('dealer')}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      role === 'dealer' ? 'bg-amber-400 text-black shadow' : 'bg-gray-900 text-gray-400'
                    }`}
                  >
                    Car Dealer / Seller
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    {role === 'dealer' ? 'Dealership / Company Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder={role === 'dealer' ? "Elite Motors Ltd" : "John Doe"}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="+250 7..."
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-400">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold py-3 rounded-xl text-xs transition duration-200 shadow-md"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In to Account' : 'Complete Registration')}
            </button>
          </form>
        )}

        {!isForgot && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-gray-950 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                prompt="select_account"
                text="continue_with"
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
                }}
                className="text-xs text-gray-400 hover:text-amber-400 transition"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const LoginModal = ({ isOpen, onClose }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginModalContent isOpen={isOpen} onClose={onClose} />
    </GoogleOAuthProvider>
  );
};

export default LoginModal;