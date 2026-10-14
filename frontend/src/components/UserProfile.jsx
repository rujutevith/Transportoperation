import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-gray-900 rounded-xl p-8">
          <div className="flex items-center justify-center mb-6">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-amber-400 shadow-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80";
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-amber-700 text-black font-extrabold text-2xl rounded-full flex items-center justify-center shadow-xl">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'VIP'}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Full Name</span>
              </div>
              <span className="font-semibold">{user.name}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Email</span>
              </div>
              <span className="font-semibold">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Role</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {user.role}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Member Since</span>
              </div>
              <span className="font-semibold">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
