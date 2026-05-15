import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerifiedIcon from '@mui/icons-material/Verified';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/user/${user.email}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-5xl font-black text-gray-900 tracking-tightest mb-4">Service Archive</h1>
              <p className="text-gray-400 font-bold text-xl flex items-center gap-2">
                 Tracking {bookings.length} professional requests 
                 <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              </p>
           </motion.div>
           <div className="flex items-center gap-4">
              <Link to="/services" className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black shadow-2xl shadow-gray-900/20 hover:bg-purple-600 transition-all text-lg active:scale-95">
                 + New Request
              </Link>
           </div>
        </div>

        {loading ? (
           <div className="space-y-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white h-40 rounded-[3.5rem] animate-pulse border border-gray-100" />
              ))}
           </div>
        ) : bookings.length > 0 ? (
           <div className="grid grid-cols-1 gap-8">
              {bookings.map((booking, index) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-[4rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-3xl hover:shadow-purple-500/5 hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden"
                >
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                      <div className="flex items-center gap-8">
                         <div className="w-24 h-24 bg-purple-50 rounded-[2.5rem] flex items-center justify-center text-purple-600 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <ShoppingBagOutlinedIcon sx={{ fontSize: 36 }} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-3">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                  booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                  booking.status === 'arrived' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                               }`}>
                                  {booking.status}
                               </span>
                               <span className="text-gray-300 font-bold text-xs">REF: {booking.id.substring(0, 8)}</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-purple-600 transition-colors">{booking.service}</h3>
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                               <VerifiedIcon sx={{ fontSize: 16 }} className="text-blue-400" />
                               <span>Professional: {booking.worker_name}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-10 lg:gap-12 bg-gray-50/50 p-6 md:p-8 rounded-[3rem] border border-transparent group-hover:border-gray-100 group-hover:bg-white transition-all">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                               <CalendarMonthIcon sx={{ fontSize: 12 }} /> Scheduled
                            </p>
                            <p className="text-sm font-black text-gray-900">{booking.date}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                               <AccessTimeIcon sx={{ fontSize: 12 }} /> Preferred Time
                            </p>
                            <p className="text-sm font-black text-gray-900">{booking.time}</p>
                         </div>
                         <div className="space-y-1 text-right lg:text-left">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Premium Fee</p>
                            <p className="text-2xl font-black text-purple-600 tracking-tighter">₹ {booking.price}</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <Link 
                              to="/tracking" 
                              className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-all shadow-xl active:scale-90"
                            >
                               <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                            </Link>
                            <button className="w-12 h-12 bg-white text-gray-300 rounded-full flex items-center justify-center border border-gray-100 hover:text-gray-900 hover:border-gray-200 transition-all">
                               <MoreHorizIcon />
                            </button>
                         </div>
                      </div>
                   </div>
                   
                   {/* Background decorative curve */}
                   <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-purple-500/5 to-transparent skew-x-12 transform translate-x-1/2 group-hover:translate-x-0 transition-transform duration-700" />
                </motion.div>
              ))}
           </div>
        ) : (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-center py-32 bg-white rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden"
           >
              <div className="relative z-10">
                 <div className="w-32 h-32 bg-purple-50 rounded-[3.5rem] flex items-center justify-center text-purple-600 mx-auto mb-10 shadow-inner">
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 56 }} />
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">The Archive is Empty</h2>
                 <p className="text-gray-500 font-bold text-lg mb-12 max-w-sm mx-auto">Your journey with HireAgain hasn't started yet. Let's find your first expert.</p>
                 <Link to="/services" className="inline-block px-14 py-6 bg-purple-600 text-white rounded-[2.5rem] font-black text-xl shadow-[0_25px_60px_rgba(124,58,237,0.3)] hover:bg-purple-700 transition-all active:scale-95">
                    Browse Luxury Services
                 </Link>
              </div>
              <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 bg-purple-50 rounded-full blur-[100px] opacity-50" />
           </motion.div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;
