import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MyBookings = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-500 font-bold text-lg">Manage your service requests and history</p>
           </div>
           <Link to="/services" className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all text-center">
              + New Booking
           </Link>
        </div>

        {loading ? (
           <div className="space-y-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white h-32 rounded-[2rem] animate-pulse" />
              ))}
           </div>
        ) : bookings.length > 0 ? (
           <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking, index) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 hover:shadow-2xl hover:shadow-purple-600/5 hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden"
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center text-purple-600 shrink-0">
                            <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                  {booking.status}
                               </span>
                               <span className="text-gray-400 font-bold text-xs">#{booking.id.substring(0, 8)}</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">{booking.service}</h3>
                            <p className="text-gray-500 font-bold text-sm mt-1">Provider: {booking.worker_name}</p>
                         </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 md:gap-10">
                         <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                            <CalendarMonthIcon sx={{ fontSize: 18 }} className="text-gray-400" />
                            {booking.date}
                         </div>
                         <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                            <AccessTimeIcon sx={{ fontSize: 18 }} className="text-gray-400" />
                            {booking.time}
                         </div>
                         <div className="flex items-center gap-2 text-purple-600 font-black text-lg">
                            ₹ {booking.price}
                         </div>
                         <Link 
                          to="/tracking" 
                          className="flex items-center justify-center w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm"
                         >
                            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                         </Link>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        ) : (
           <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-8">
                 <ShoppingBagOutlinedIcon sx={{ fontSize: 48 }} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">No bookings yet</h2>
              <p className="text-gray-500 font-bold mt-2 mb-10">You haven't requested any services yet.</p>
              <Link to="/services" className="bg-purple-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all">
                 Browse Services
              </Link>
           </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;
