import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import EngineeringIcon from '@mui/icons-material/Engineering';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import StarRating from '../components/StarRating';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(user?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (user?.role === 'worker') {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await axios.get(`http://localhost:8000/reviews/${user.email}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-24 h-24 bg-purple-100 rounded-[2.5rem] flex items-center justify-center text-purple-600 mx-auto mb-8 shadow-xl">
             <PersonOutlinedIcon sx={{ fontSize: 48 }} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Identity Required</h2>
          <p className="text-gray-500 font-bold max-w-sm mx-auto mb-10 leading-relaxed">Please sign in to access your professional profile and personalized settings.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-12 py-5 bg-purple-600 text-white rounded-[2rem] font-black shadow-[0_20px_50px_rgba(124,58,237,0.3)] hover:bg-purple-700 transition-all active:scale-95"
          >
            Sign In to Profile
          </button>
        </motion.div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdate = async (updateData) => {
    const formData = new FormData();
    formData.append('email', user.email);
    
    Object.keys(updateData).forEach(key => {
      if (key === 'skills') {
        formData.append(key, JSON.stringify(updateData[key]));
      } else {
        formData.append(key, updateData[key]);
      }
    });

    setIsUpdating(true);
    try {
      const response = await axios.put('http://localhost:8000/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const loadingToast = toast.loading("Updating avatar...");
    try {
      await handleUpdate({ photo: file });
      toast.success("Identity visual updated! ✨", { id: loadingToast });
    } catch (error) {
      toast.error("Upload failed", { id: loadingToast });
    }
  };

  const saveProfileInfo = async () => {
    try {
      await handleUpdate({ address: tempAddress });
      toast.success("Profile updated! ✨");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const calculateCompletion = () => {
    let completion = 40; 
    if (user.photo) completion += 20;
    if (user.address) completion += 20;
    if (user.id_proof) completion += 20;
    return Math.min(completion, 100);
  };

  const photoUrl = user.photo ? (user.photo.startsWith('http') ? user.photo : `http://localhost:8000/${user.photo.replace(/^\//, '')}`) : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: IDENTITY CARD (4/12) */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[4rem] shadow-[0_30px_90px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden sticky top-32"
            >
              <div className="h-40 bg-gray-900 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"></div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              </div>

              <div className="px-10 pb-12">
                <div className="relative -mt-20 mb-8 group">
                   <div className="w-40 h-40 bg-white rounded-[3.5rem] p-3 shadow-2xl mx-auto relative overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                      <div className="w-full h-full bg-gray-100 rounded-[2.8rem] flex items-center justify-center text-purple-600 overflow-hidden relative">
                        {photoUrl ? (
                          <img src={photoUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl font-black">{user.name?.[0]}</span>
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-sm">
                           <CloudUploadIcon sx={{ fontSize: 32 }} />
                           <span className="text-[10px] font-black mt-2 uppercase tracking-widest">Update Photo</span>
                           <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                        </label>
                      </div>
                   </div>
                   {user.id_proof && (
                     <div className="absolute bottom-2 left-1/2 translate-x-12 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-xl">
                        <VerifiedIcon fontSize="small" />
                     </div>
                   )}
                </div>

                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                  <span className="inline-block mt-3 px-4 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{user.role}</span>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-gray-100 transition-all">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                         <EmailIcon fontSize="small" />
                      </div>
                      <div className="overflow-hidden">
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Email</p>
                         <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-gray-100 transition-all">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                         <LocationOnIcon fontSize="small" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Address</p>
                         <p className="text-sm font-bold text-gray-900">{user.address || 'Location not set'}</p>
                      </div>
                   </div>
                </div>

                <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col gap-4">
                   <button 
                    onClick={() => {
                      setTempAddress(user.address || '');
                      setIsEditModalOpen(true);
                    }}
                    className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-purple-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                   >
                      <EditIcon sx={{ fontSize: 18 }} /> Edit Profile Details
                   </button>
                   <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-3 active:scale-95">
                      <LogoutIcon sx={{ fontSize: 18 }} /> Sign Out
                   </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: ANALYTICS & SETTINGS (8/12) */}
          <div className="lg:col-span-8 space-y-12">
             
             {/* STATS OVERVIEW */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex items-center gap-8 group hover:shadow-2xl transition-all">
                   <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />
                   </div>
                   <div>
                      <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Total Services</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter">{user.total_bookings || 0}</p>
                   </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex items-center gap-8 group hover:shadow-2xl transition-all">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <VerifiedIcon sx={{ fontSize: 32 }} />
                   </div>
                   <div>
                      <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Loyalty Tier</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter">{user.id_proof ? 'Silver' : 'Basic'}</p>
                   </div>
                </motion.div>
             </div>

             {/* PROFILE COMPLETION COMMAND CENTER */}
             <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Profile Integrity</h3>
                        <p className="text-gray-400 font-bold">Complete your identity for faster verification</p>
                      </div>
                      <div className="text-right">
                         <span className="text-5xl font-black text-purple-600 tracking-tighter">{calculateCompletion()}%</span>
                         <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mt-1">Completion Score</p>
                      </div>
                   </div>
                   
                   <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden mb-12 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${calculateCompletion()}%` }} 
                        transition={{ duration: 1.5, ease: "circOut" }} 
                        className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 rounded-full" 
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Avatar', done: !!user.photo, icon: <PersonOutlinedIcon /> },
                        { label: 'Location', done: !!user.address, icon: <LocationOnIcon /> },
                        { label: 'Verified ID', done: !!user.id_proof, icon: <VerifiedIcon /> },
                      ].map((task, i) => (
                        <div key={i} className={`p-6 rounded-[2rem] border flex items-center gap-4 transition-all ${task.done ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                           {task.icon}
                           <span className="font-black text-xs uppercase tracking-widest">{task.label}</span>
                           {task.done && <VerifiedIcon sx={{ fontSize: 16, ml: 'auto' }} />}
                        </div>
                      ))}
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 blur-[100px] -z-0 rounded-full" />
             </div>

             {/* ACCOUNT SECURITY & DOCS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm group">
                   <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-8">Identity Verification</h3>
                   <div className="flex flex-col items-center text-center p-8 bg-gray-50/50 rounded-[2.5rem] border border-transparent group-hover:border-purple-100 transition-all">
                      {user.id_proof ? (
                        <>
                          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                             <VerifiedIcon sx={{ fontSize: 32 }} />
                          </div>
                          <p className="text-xl font-black text-gray-900 mb-2">Verified Partner</p>
                          <p className="text-xs font-bold text-gray-400">Your documents are safe with us.</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mb-4">
                             <WorkspacePremiumIcon sx={{ fontSize: 32 }} />
                          </div>
                          <p className="text-xl font-black text-gray-900 mb-2">Unverified</p>
                          <p className="text-xs font-bold text-gray-400 mb-6">Upload Aadhaar or ID to unlock premium features.</p>
                          <label className="px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-purple-600 transition-all shadow-xl active:scale-95">
                             Upload Now
                             <input type="file" hidden onChange={async (e) => {
                               const file = e.target.files[0];
                               if(file) {
                                  const tid = toast.loading("Verifying Identity...");
                                  try { await handleUpdate({ id_proof: file }); toast.success("ID Uploaded! Verification pending.", { id: tid }); }
                                  catch(err) { toast.error("Upload failed", { id: tid }); }
                               }
                             }} accept="image/*,application/pdf" />
                          </label>
                        </>
                      )}
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center relative overflow-hidden">
                   <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-10">Data & Security</h3>
                   <div className="space-y-4 relative z-10">
                      <button className="w-full py-5 bg-gray-50 text-gray-900 rounded-[2rem] font-black text-sm hover:bg-gray-100 transition-all border border-gray-100">
                         Change Password
                      </button>
                      <button className="w-full py-5 bg-gray-50 text-gray-900 rounded-[2rem] font-black text-sm hover:bg-gray-100 transition-all border border-gray-100">
                         Request Privacy Report
                      </button>
                      <button className="w-full py-5 text-red-600 font-black text-xs uppercase tracking-widest hover:underline mt-4">
                         Close Account
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* REFINED EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="relative bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-3xl overflow-hidden">
               <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Personal Details</h3>
               <p className="text-gray-400 font-bold mb-10 leading-relaxed">Update your primary service location for more accurate expert matching.</p>
               
               <div className="space-y-8 mb-12">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Service Address</label>
                     <textarea 
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        placeholder="e.g. 402, Luxury Heights, Jaipur"
                        className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] outline-none focus:border-purple-600 transition-all font-black text-gray-700 min-h-[160px] resize-none shadow-inner"
                     />
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={saveProfileInfo}
                    disabled={isUpdating}
                    className="flex-[2] py-6 bg-gray-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-purple-600 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? 'Synchronizing...' : 'Save Profile Changes'}
                  </button>
                  <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-6 bg-gray-100 text-gray-400 rounded-[2rem] font-black hover:bg-gray-200 transition-all">
                    Dismiss
                  </button>
               </div>
               
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl -z-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
