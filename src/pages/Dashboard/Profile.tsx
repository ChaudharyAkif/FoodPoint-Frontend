import React, { useState, useEffect } from 'react';
import {
  Key,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  Shield,
  Info,
  User as UserIcon,
  Mail,
  UserCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

interface User {
  name: string;
  email: string;
  role?: string;
}

const Profile: React.FC = () => {
  const [, setUser] = useState<User | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {role,user,getToken} = useAuth()
  useEffect(() => {
    
    if (user) {
      setUser({
        name: user.name || 'User',
        email: user.email || 'user@example.com',
        role: role || 'User',
      });
    } else {
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
      });
    }
  }, []);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType('error');
      return;
    }

    if (oldPassword === newPassword) {
      setMessage('New password must be different from old password');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      const token = getToken()

      if (!token) {
        setMessage('Authentication token not found. Please login again.');
        setMessageType('error');
        return;
      }

      const response = await axiosInstance.put(
        '/auth/change-password',
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // axios me response.data hota hai
      setMessage(response.data.message || 'Password changed successfully!');
      setMessageType('success');

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Optional redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } 
    catch (error  ) {
      console.error('Password change error:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'Failed to change password');
      } else {
        setMessage('Something went wrong. Please try again.');
      }

      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (strength === 4) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const requirements = [
    { met: newPassword.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(newPassword), text: 'One uppercase letter' },
    { met: /[a-z]/.test(newPassword), text: 'One lowercase letter' },
    { met: /[0-9]/.test(newPassword), text: 'One number' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#f95300] rounded-2xl blur-md opacity-50"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f95300] to-[#d94700] flex items-center justify-center shadow-xl">
                  <Shield className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Security Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Keep your account safe and secure
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-6 py-3 bg-white border-2 border-gray-200 hover:border-[#f95300] text-gray-700 hover:text-[#f95300] rounded-xl transition-all flex items-center gap-2 font-semibold shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* User Profile Card */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#f95300] to-[#ff6a1a] px-8 py-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCircle size={24} />
              Profile Information
            </h3>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-lg font-bold text-gray-800">{user?.name || 'Loading...'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-bold text-gray-800 break-all">
                    {user?.email || 'Loading...'}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Role
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#f95300] text-white font-bold text-sm">
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="relative bg-gradient-to-r from-[#f95300] to-[#ff6a1a] px-8 py-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Key size={28} />
                    Change Password
                  </h2>
                  <p className="text-orange-100 mt-2 text-sm">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                {message && (
                  <div
                    className={`mb-6 p-5 rounded-2xl border ${
                      messageType === 'success'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                    } flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        messageType === 'success' ? 'bg-emerald-100' : 'bg-red-100'
                      }`}
                    >
                      {messageType === 'success' ? (
                        <CheckCircle className="text-emerald-600" size={22} />
                      ) : (
                        <AlertCircle className="text-red-600" size={22} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-bold text-base ${
                          messageType === 'success' ? 'text-emerald-900' : 'text-red-900'
                        }`}
                      >
                        {messageType === 'success' ? 'Success!' : 'Error'}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          messageType === 'success' ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Old Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#f95300]/10 flex items-center justify-center">
                        <Lock size={14} className="text-[#f95300]" />
                      </div>
                      Current Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          setMessage('');
                        }}
                        className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#f95300] focus:border-transparent transition-all bg-gray-50 focus:bg-white font-medium text-gray-700"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#f95300] transition-colors"
                      >
                        {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#f95300]/10 flex items-center justify-center">
                        <Key size={14} className="text-[#f95300]" />
                      </div>
                      New Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setMessage('');
                        }}
                        className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#f95300] focus:border-transparent transition-all bg-gray-50 focus:bg-white font-medium text-gray-700"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#f95300] transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Password Strength
                          </span>
                          <span
                            className={`text-sm font-black px-3 py-1 rounded-lg ${
                              passwordStrength.strength === 100
                                ? 'bg-green-100 text-green-700'
                                : passwordStrength.strength >= 75
                                  ? 'bg-blue-100 text-blue-700'
                                  : passwordStrength.strength >= 50
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#f95300]/10 flex items-center justify-center">
                        <CheckCircle size={14} className="text-[#f95300]" />
                      </div>
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setMessage('');
                        }}
                        className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#f95300] focus:border-transparent transition-all bg-gray-50 focus:bg-white font-medium text-gray-700"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#f95300] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                        <AlertCircle size={16} />
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && newPassword && (
                      <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
                        <CheckCircle size={16} />
                        Passwords match
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`relative w-full px-6 py-5 bg-gradient-to-r from-[#f95300] to-[#ff6a1a] hover:from-[#e04d00] hover:to-[#f95300] text-white rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl font-bold text-lg overflow-hidden group ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                          <span className="relative">Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Key size={22} className="relative" />
                          <span className="relative">Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Password Requirements */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Info size={20} />
                  Requirements
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          req.met ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            req.met ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          req.met ? 'text-green-700' : 'text-gray-600'
                        }`}
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Security Tip */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f95300] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Security Tip</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Use a unique password that you don't use for other accounts. Consider using a
                    password manager for added security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
