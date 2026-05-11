import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const UserSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: ''
  });

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    offers: false,
    emergencyAlerts: true
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const calculateCompletion = () => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.email) score += 20;
    if (user?.phone) score += 20;
    if (user?.address) score += 20;
    if (user?.photo) score += 20;
    return score;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('name', profileData.name);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);

    try {
      const response = await axios.put('http://localhost:8000/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(response.data.user);
      toast.success("Profile updated! ✨");
    } catch (error) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tid = toast.loading("Uploading new avatar...");
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('photo', file);

    try {
      const response = await axios.put('http://localhost:8000/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(response.data.user);
      toast.success("Avatar updated! 📸", { id: tid });
    } catch (error) {
      toast.error("Upload failed", { id: tid });
    }
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      toast.loading("Detecting location...", { id: 'geo' });
      navigator.geolocation.getCurrentPosition((position) => {
        setProfileData({...profileData, address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)} (Auto-detected)`});
        toast.success("Location synchronized! 📍", { id: 'geo' });
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <PersonIcon /> },
    { id: 'address', label: 'Saved Addresses', icon: <LocationOnIcon /> },
    { id: 'account', label: 'Preferences', icon: <SettingsSuggestIcon /> },
    { id: 'security', label: 'Security', icon: <LockIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 1. LEFT SIDEBAR (TABS) */}
          <div className="w-full lg:w-[320px] space-y-2">
             <div className="mb-10 px-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-400 font-bold mt-1">Control your experience</p>
             </div>

             {tabs.map(tab => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-sm transition-all relative ${
                  activeTab === tab.id ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'
                }`}
               >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gray-900 -z-10 rounded-[2rem]" />}
               </button>
             ))}

             <div className="pt-10 border-t border-gray-100 mt-10 space-y-4 px-4">
                <button onClick={logout} className="text-red-500 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                   <DeleteForeverIcon sx={{ fontSize: 18 }} /> Sign Out of Account
                </button>
             </div>
          </div>

          {/* 2. MAIN CONTENT AREA */}
          <div className="flex-1 max-w-4xl">
             
             {/* Profile Completion Header */}
             <div className="bg-gray-50 rounded-[3rem] p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm font-black text-xl">
                      {calculateCompletion()}%
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-gray-900">Profile Strength</h3>
                      <p className="text-sm font-bold text-gray-400">Complete your profile to unlock premium features.</p>
                   </div>
                </div>
                <div className="w-full md:w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${calculateCompletion()}%` }} 
                    className="h-full bg-purple-600" 
                   />
                </div>
             </div>

             <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                     <div className="bg-white border border-gray-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-14">
                           <div className="relative group">
                              <div className="w-40 h-40 rounded-[3.5rem] bg-gray-50 overflow-hidden border-8 border-white shadow-2xl">
                                 <img 
                                  src={user?.photo ? (user.photo.startsWith('http') ? user.photo : `http://localhost:8000/${user.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} 
                                  className="w-full h-full object-cover" 
                                 />
                              </div>
                              <label className="absolute bottom-2 right-2 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-all shadow-xl">
                                 <PhotoCameraIcon fontSize="small" />
                                 <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                              </label>
                           </div>
                           <div className="text-center md:text-left">
                              <h2 className="text-3xl font-black text-gray-900">{user?.name}</h2>
                              <p className="text-gray-400 font-bold mb-4">{user?.email}</p>
                              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                 <VerifiedIcon sx={{ fontSize: 14 }} /> Verified Account
                              </span>
                           </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                              <input 
                                value={profileData.name}
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-8 py-5 outline-none font-bold transition-all"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Phone Number</label>
                              <input 
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-8 py-5 outline-none font-bold transition-all"
                              />
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Personal Email</label>
                              <input 
                                value={profileData.email}
                                disabled
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-8 py-5 outline-none font-bold text-gray-400 cursor-not-allowed"
                              />
                           </div>
                           <div className="md:col-span-2 pt-6">
                              <button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-purple-600 transition-all active:scale-95">
                                 {loading ? 'Saving Changes...' : 'Save Settings'}
                              </button>
                           </div>
                        </form>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'address' && (
                  <motion.div 
                    key="address"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                     <div className="bg-white border border-gray-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                           <h2 className="text-2xl font-black text-gray-900">Delivery Addresses</h2>
                           <button onClick={useCurrentLocation} className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest hover:underline">
                              <GpsFixedIcon sx={{ fontSize: 16 }} /> Use GPS Location
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                           <div className="p-8 border-2 border-purple-600 bg-purple-50 rounded-[2.5rem] relative">
                              <HomeIcon className="text-purple-600 mb-4" />
                              <h3 className="font-black text-gray-900">Home Address</h3>
                              <p className="text-sm font-bold text-gray-500 mt-2 leading-relaxed">{user.address || 'Address not set'}</p>
                              <div className="absolute top-6 right-6">
                                 <VerifiedIcon className="text-purple-600" fontSize="small" />
                              </div>
                           </div>
                           <div className="p-8 border-2 border-gray-50 bg-gray-50 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 border-dashed cursor-pointer hover:border-purple-200 transition-all">
                              <WorkIcon className="mb-4" />
                              <p className="font-black text-xs uppercase tracking-widest">+ Add Work Address</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Update Address</label>
                           <textarea 
                             value={profileData.address}
                             onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                             placeholder="Enter full address details..."
                             className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-[2rem] px-8 py-6 outline-none font-bold h-32 resize-none transition-all"
                           />
                           <button onClick={handleProfileUpdate} className="px-12 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl">
                              Save Address
                           </button>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div 
                    key="notif"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm"
                  >
                     <h2 className="text-2xl font-black text-gray-900 mb-10">Notification Preferences</h2>
                     <div className="space-y-4">
                        {[
                          { id: 'bookingUpdates', label: 'Booking Updates', desc: 'Get real-time tracking and status alerts' },
                          { id: 'offers', label: 'Offers & Discounts', desc: 'Personalized coupon codes and seasonal deals' },
                          { id: 'emergencyAlerts', label: 'Emergency Alerts', desc: 'Priority notifications for high-urgency tasks' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[2rem] hover:bg-gray-50 transition-all">
                             <div>
                                <h4 className="font-black text-gray-900">{item.label}</h4>
                                <p className="text-sm font-bold text-gray-400 mt-1">{item.desc}</p>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={notifications[item.id]} 
                                  onChange={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})} 
                                />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                             </label>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div 
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm"
                  >
                     <h2 className="text-2xl font-black text-gray-900 mb-10">Account Security</h2>
                     <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Current Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-8 py-5 outline-none font-bold transition-all" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-8 py-5 outline-none font-bold transition-all" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Confirm New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-8 py-5 outline-none font-bold transition-all" />
                           </div>
                        </div>
                        <button className="px-12 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl">Update Password</button>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>

             {/* 3. DANGER ZONE */}
             <div className="mt-16 p-10 md:p-14 bg-red-50 rounded-[4rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                   <h3 className="text-2xl font-black text-red-600">Delete Account</h3>
                   <p className="text-sm font-bold text-red-400 mt-2 max-w-sm">This action will permanently delete all your data and booking history. This cannot be undone.</p>
                </div>
                <button className="px-12 py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95">
                   Delete Forever
                </button>
             </div>

             <div className="mt-10 text-center">
                <p className="text-gray-300 font-black text-[10px] uppercase tracking-widest">WorkConnect Version 2.4.0 • Secured by 256-bit Encryption</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
