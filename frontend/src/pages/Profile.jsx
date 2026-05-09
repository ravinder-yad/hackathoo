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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import StarRating from '../components/StarRating';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempSkills, setTempSkills] = useState(user?.skills || []);
  const [tempAddress, setTempAddress] = useState(user?.address || '');
  const [tempExperience, setTempExperience] = useState(user?.experience || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const availableSkills = ['Electrician', 'Plumber', 'Cleaning', 'AC Repair', 'Carpenter', 'Driver', 'Painter', 'Pest Control'];

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 mx-auto mb-6">
             <PersonOutlinedIcon sx={{ fontSize: 40 }} />
          </div>
          <p className="text-gray-500 font-black text-xl">Please login to view your profile.</p>
          <button onClick={() => navigate('/login')} className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-2xl font-black shadow-lg shadow-purple-600/20">Login Now</button>
        </div>
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
    
    const loadingToast = toast.loading("Updating profile picture...");
    try {
      await handleUpdate({ photo: file });
      toast.success("Photo updated successfully! 📸", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to upload photo", { id: loadingToast });
    }
  };

  const handleIdUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading ID Proof...");
    try {
      await handleUpdate({ id_proof: file });
      toast.success("Verification ID uploaded! 🛡️", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to upload ID", { id: loadingToast });
    }
  };

  const saveSkills = async () => {
    try {
      await handleUpdate({ skills: tempSkills });
      toast.success("Expertise updated successfully! ⚡");
      setIsSkillsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update expertise");
    }
  };

  const saveProfileInfo = async () => {
    try {
      await handleUpdate({ 
        address: tempAddress, 
        experience: parseInt(tempExperience) || 0 
      });
      toast.success("Profile updated successfully! ✨");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile info");
    }
  };

  const calculateCompletion = () => {
    if (user.role === 'worker') {
      let completion = 30; 
      if (user.phone) completion += 15;
      if (user.address) completion += 15;
      if (user.photo) completion += 20;
      if (user.skills && user.skills.length > 0) completion += 20;
      return Math.min(completion, 100);
    } else {
      let completion = 40; 
      if (user.photo) completion += 30;
      if (user.id_proof) completion += 30;
      return Math.min(completion, 100);
    }
  };

  const photoUrl = user.photo ? (user.photo.startsWith('http') ? user.photo : `http://localhost:8000/${user.photo.replace(/^\//, '')}`) : null;

  const handleSkillToggle = (skill) => {
    if (tempSkills.includes(skill)) {
      setTempSkills(tempSkills.filter(s => s !== skill));
    } else {
      setTempSkills([...tempSkills, skill]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden sticky top-24"
            >
              <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              <div className="px-8 pb-10">
                <div className="relative -mt-16 mb-6 group">
                   <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl mx-auto relative overflow-hidden">
                      <div className="w-full h-full bg-gray-50 rounded-[2rem] flex items-center justify-center text-purple-600 overflow-hidden relative">
                        {photoUrl ? (
                          <img src={photoUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-black">{user.name?.[0]}</span>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                           <EditIcon sx={{ fontSize: 20 }} />
                           <span className="text-[10px] font-black mt-1 text-center uppercase">Change Photo</span>
                           <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                        </label>
                      </div>
                   </div>
                   {user.role === 'worker' && user.id_proof && (
                     <div className="absolute bottom-2 right-1/2 translate-x-12 bg-blue-500 text-white p-1.5 rounded-xl border-4 border-white">
                        <VerifiedIcon fontSize="small" />
                     </div>
                   )}
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <StarRating rating={user.average_rating || 0} size="small" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.role}</span>
                  </div>
                </div>

                {/* Availability Toggle */}
                {user.role === 'worker' && (
                  <button 
                    onClick={() => setIsOnline(!isOnline)}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center justify-center gap-3 transition-all ${
                      isOnline ? 'bg-green-50 text-green-600 border border-green-100 shadow-sm shadow-green-500/10' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}
                  >
                    <PowerSettingsNewIcon fontSize="small" />
                    {isOnline ? 'Active Now' : 'Currently Offline'}
                  </button>
                )}

                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                         <EmailIcon fontSize="small" />
                      </div>
                      <div className="overflow-hidden">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                         <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                         <PhoneIcon fontSize="small" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                         <p className="text-sm font-bold text-gray-900">{user.phone || 'Not linked'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                         <LocationOnIcon fontSize="small" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                         <p className="text-sm font-bold text-gray-900">{user.address || 'Update location'}</p>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                   <button 
                    onClick={() => {
                      setTempAddress(user.address || '');
                      setTempExperience(user.experience || 0);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                   >
                      <EditIcon fontSize="small" /> {user.role === 'worker' ? 'Edit Prof. Info' : 'Update Location'}
                   </button>
                   <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                      <LogoutIcon fontSize="small" /> Logout
                   </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Dynamic Stats */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {user.role === 'worker' ? (
                  <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                       <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <EngineeringIcon />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verified Ratings</p>
                          <p className="text-3xl font-black text-gray-900">{user.average_rating || 0} ⭐</p>
                       </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                       <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <RateReviewIcon />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Reviews</p>
                          <p className="text-3xl font-black text-gray-900">{user.total_reviews || 0}</p>
                       </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                       <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CalendarMonthIcon />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Requests</p>
                          <p className="text-3xl font-black text-gray-900">{user.total_bookings || 0}</p>
                       </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                       <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <StarIcon />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Reward Points</p>
                          <p className="text-3xl font-black text-gray-900">450 pts</p>
                       </div>
                    </motion.div>
                  </>
                )}
             </div>

             {/* Progress Bar */}
             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-black text-gray-900">Profile Completion</h3>
                   <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-black rounded-lg">
                     {calculateCompletion()}% Complete
                   </span>
                </div>
                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: `${calculateCompletion()}%` }} 
                     transition={{ duration: 1 }} 
                     className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full" 
                   />
                </div>
                <p className="mt-4 text-sm font-bold text-gray-400 leading-relaxed">
                   {user.photo ? '✓ Profile photo added' : 'Add a profile photo'} and {user.id_proof ? '✓ Identity verified' : 'verify your ID'} for a <span className="text-purple-600">Pro Badge</span>.
                </p>
             </div>

             {/* Recent Reviews (Workers Only) */}
             {user.role === 'worker' && (
               <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 mb-8">Recent Testimonials</h3>
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                           <div className="flex justify-between items-start mb-3">
                              <div>
                                 <p className="text-sm font-black text-gray-900">{rev.user_name}</p>
                                 <p className="text-[10px] font-bold text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</p>
                              </div>
                              <StarRating rating={rev.rating} size="small" />
                           </div>
                           <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{rev.review || 'No written review provided.'}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 font-bold italic text-center py-10">No reviews received yet. Your hard work will pay off soon!</p>
                    )}
                  </div>
               </div>
             )}

             {/* Skills (Workers Only) */}
             {user.role === 'worker' && (
               <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-gray-900">Expertise & Skills</h3>
                    <button 
                     onClick={() => {
                       setTempSkills(user.skills || []);
                       setIsSkillsModalOpen(true);
                     }}
                     className="text-purple-600 font-black text-sm flex items-center gap-1 hover:underline"
                    >
                       <EditIcon sx={{ fontSize: 14 }} /> Update
                    </button>
                 </div>
                 <div className="flex flex-wrap gap-4">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <div key={index} className="px-6 py-3 bg-gray-50 text-gray-700 font-black text-sm rounded-2xl border border-gray-100 flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 transition-all cursor-default">
                           <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                           {skill}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 font-bold italic">No skills added yet.</p>
                    )}
                 </div>
               </div>
             )}

             {/* Verification Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {user.role === 'worker' && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Seniority</h3>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                           <WorkspacePremiumIcon />
                        </div>
                        <div>
                           <p className="text-xl font-black text-gray-900">{user.experience || 0} Years</p>
                           <p className="text-xs font-bold text-gray-400">Professional Exp.</p>
                        </div>
                     </div>
                  </div>
                )}

                <div className={`bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm ${user.role === 'user' ? 'md:col-span-2' : ''}`}>
                   <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Identity Verification</h3>
                   <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 ${user.id_proof ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} rounded-2xl flex items-center justify-center`}>
                            {user.id_proof ? <VerifiedIcon /> : <VerifiedIcon sx={{ opacity: 0.5 }} />}
                         </div>
                         <div>
                            <p className={`text-xl font-black ${user.id_proof ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {user.id_proof ? 'Verified Account' : 'Action Required'}
                            </p>
                            <p className="text-xs font-bold text-gray-400">
                              {user.id_proof ? 'Identity documents verified ✓' : 'Please upload Aadhaar / ID card'}
                            </p>
                         </div>
                      </div>
                      {!user.id_proof && (
                        <label className="px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-xs cursor-pointer hover:bg-purple-700 active:scale-95 transition-all">
                           UPLOAD ID
                           <input type="file" hidden onChange={handleIdUpload} accept="image/*,application/pdf" />
                        </label>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">Edit Profile Info</h3>
              <p className="text-gray-500 font-bold mb-8 text-sm">Keep your service details up-to-date</p>
              
              <div className="space-y-6 mb-10">
                 {user.role === 'worker' && (
                   <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Years of Experience</p>
                      <input 
                       type="number"
                       value={tempExperience}
                       onChange={(e) => setTempExperience(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-purple-600 transition-all font-bold"
                      />
                   </div>
                 )}
                 <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Address / Location</p>
                    <textarea 
                     value={tempAddress}
                     onChange={(e) => setTempAddress(e.target.value)}
                     placeholder="Enter your location..."
                     className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-purple-600 transition-all font-bold min-h-[120px] resize-none"
                    />
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={saveProfileInfo}
                  disabled={isUpdating}
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-600/25 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {isUpdating ? 'Saving...' : 'Update Profile'}
                 </button>
                 <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-200 transition-all"
                 >
                   Cancel
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Skills Modal */}
      <AnimatePresence>
        {isSkillsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSkillsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">Update Expertise</h3>
              <p className="text-gray-500 font-bold mb-8 text-sm">Select the skills you excel at</p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                 {availableSkills.map(skill => (
                   <div 
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-4 rounded-2xl border-2 text-center cursor-pointer font-black transition-all ${tempSkills.includes(skill) ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                   >
                     {skill}
                   </div>
                 ))}
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={saveSkills}
                  disabled={isUpdating}
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-600/25 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {isUpdating ? 'Saving Changes...' : 'Save Skills'}
                 </button>
                 <button 
                  onClick={() => setIsSkillsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-200 transition-all"
                 >
                   Cancel
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;