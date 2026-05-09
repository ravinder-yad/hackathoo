import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const WorkerSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    experience: user?.experience || 0,
    skills: user?.skills || []
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sync state if user context updates
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        experience: user.experience || 0,
        skills: user.skills || []
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // We only allow updating Address and Experience/Skills now as per user request
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('address', profileData.address);
    formData.append('experience', profileData.experience);
    formData.append('skills', JSON.stringify(profileData.skills));
    
    try {
      const response = await axios.put('http://localhost:8000/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateUser(response.data.user);
      toast.success("Settings updated successfully! ✨");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: <PersonIcon /> },
    { id: 'work', label: 'Work & Skills', icon: <BusinessCenterIcon /> },
    { id: 'security', label: 'Security', icon: <LockIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings</h1>
           <p className="text-gray-500 font-bold mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                  activeTab === tab.id 
                  ? 'bg-white text-purple-600 shadow-[0_10px_30px_rgba(124,58,237,0.1)] border border-purple-100/50' 
                  : 'bg-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent z-0"
                  />
                )}
                <span className={`relative z-10 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-purple-600' : ''}`}>
                  {tab.icon}
                </span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
            <div className="pt-8 px-2">
               <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 bg-red-50/50 hover:bg-red-100 transition-all border border-red-100/50">
                  Logout Account
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 blur-[100px] -z-10 rounded-full" />
                 
                 <div className="flex justify-between items-start mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Profile Information</h2>
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm">
                       <CheckCircleIcon fontSize="small" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
                    </div>
                 </div>
                 
                 <div className="space-y-10">
                    {/* Fixed Info Alert */}
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
                       <InfoIcon className="text-blue-500 mt-1" />
                       <p className="text-sm font-bold text-blue-900 leading-relaxed">
                          For security reasons, your <b>Full Name</b>, <b>Phone Number</b>, and <b>Photo</b> cannot be changed after registration. Please contact support for identity updates.
                       </p>
                    </div>

                    <div className="flex items-center gap-10 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 opacity-80 grayscale-[0.5]">
                       <div className="relative">
                          <div className="w-40 h-40 rounded-[3rem] bg-white overflow-hidden border-8 border-white shadow-2xl">
                             <img 
                               src={user?.photo ? (user.photo.startsWith('http') ? user.photo : `http://localhost:8000/${user.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} 
                               className="w-full h-full object-cover" 
                             />
                          </div>
                       </div>
                       <div>
                          <p className="text-xl font-black text-gray-900">{user?.name}</p>
                          <p className="text-sm font-bold text-gray-400 mt-1">{user?.email}</p>
                          <span className="inline-block mt-3 px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-[10px] font-black uppercase">Role: {user?.role}</span>
                       </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name (Locked)</label>
                             <input 
                               value={profileData.name}
                               disabled
                               className="w-full bg-gray-100/50 border border-gray-200 rounded-[1.5rem] px-7 py-5 outline-none font-bold text-gray-400 cursor-not-allowed"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Phone Number (Locked)</label>
                             <input 
                               value={profileData.phone}
                               disabled
                               className="w-full bg-gray-100/50 border border-gray-200 rounded-[1.5rem] px-7 py-5 outline-none font-bold text-gray-400 cursor-not-allowed"
                             />
                          </div>
                          <div className="md:col-span-2 space-y-3">
                             <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest px-2 flex items-center gap-2">
                                Current Address <span className="text-[8px] bg-purple-100 px-2 py-0.5 rounded text-purple-600">Editable</span>
                             </label>
                             <textarea 
                               value={profileData.address}
                               onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                               placeholder="Enter your current service location..."
                               className="w-full bg-white border border-purple-100 rounded-[2rem] px-7 py-5 outline-none focus:ring-4 focus:ring-purple-600/5 focus:border-purple-600/30 font-bold text-gray-700 transition-all shadow-sm h-32 resize-none"
                             />
                          </div>
                       </div>

                       <div className="pt-6">
                          <button 
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-16 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-purple-600 transition-all duration-300 shadow-2xl shadow-gray-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                          >
                            {loading ? 'Updating...' : 'Update Service Address'}
                          </button>
                       </div>
                    </form>
                 </div>
              </motion.div>
            )}

            {activeTab === 'work' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-[100px] -z-10 rounded-full" />
                 <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Work Experience & Skills</h2>
                 
                 <div className="space-y-12">
                    <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                       <div className="flex items-center justify-between mb-4">
                          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Professional Experience</label>
                          <span className="text-3xl font-black text-emerald-700">{profileData.experience} Years</span>
                       </div>
                       <input 
                         type="range" min="0" max="30" 
                         value={profileData.experience}
                         onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value)})}
                         className="w-full h-3 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                       />
                       <p className="text-xs font-bold text-emerald-600/60 mt-4 text-center">Slide to update your years of expertise. This will be visible on your public profile.</p>
                    </div>

                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Services You Offer</label>
                       <div className="flex flex-wrap gap-4">
                          {['Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Driver', 'Painter', 'Carpenter'].map(skill => (
                            <button
                              key={skill}
                              onClick={() => {
                                const newSkills = profileData.skills.includes(skill)
                                  ? profileData.skills.filter(s => s !== skill)
                                  : [...profileData.skills, skill];
                                setProfileData({...profileData, skills: newSkills});
                              }}
                              className={`px-8 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                                profileData.skills.includes(skill)
                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-purple-200'
                              }`}
                            >
                               {skill}
                            </button>
                          ))}
                       </div>
                    </div>

                    <button 
                       onClick={handleProfileUpdate}
                       className="px-16 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl"
                    >
                       Save Work Settings
                    </button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm">
                 <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Account Security</h2>
                 <div className="space-y-8">
                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-center gap-6">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                          <LockIcon />
                       </div>
                       <p className="text-sm font-bold text-amber-900">Your session is protected by a secure token. Changing password will invalidate all active logins.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="md:col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Current Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-7 py-5 outline-none font-bold" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">New Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-7 py-5 outline-none font-bold" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-7 py-5 outline-none font-bold" />
                       </div>
                    </div>

                    <button className="px-16 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl">Update Password</button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm">
                 <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Notifications</h2>
                 <div className="space-y-4">
                    {[
                      { label: 'Job Alert Sounds', desc: 'Loud alerts for new service requests' },
                      { label: 'Push Notifications', desc: 'Stay updated on mobile while offline' },
                      { label: 'Email Reports', desc: 'Weekly earnings and performance summary' },
                      { label: 'SMS Alerts', desc: 'Critical emergency booking notifications' },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                         <div>
                            <p className="font-black text-gray-900">{pref.label}</p>
                            <p className="text-xs font-bold text-gray-400 mt-1">{pref.desc}</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                         </label>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            <div className="mt-12 bg-red-50 rounded-[3.5rem] p-12 border border-red-100 relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="text-center md:text-left">
                     <h3 className="text-2xl font-black text-red-600">Delete Account</h3>
                     <p className="text-sm font-bold text-red-400 mt-2 max-w-md">Permanently remove your worker profile and all earnings history. This action is irreversible.</p>
                  </div>
                  <button className="px-12 py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 whitespace-nowrap">
                     Delete Forever
                  </button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 blur-3xl rounded-full" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerSettings;
