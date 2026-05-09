import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Booking = () => {
  const { state } = useLocation();
  const worker = state?.worker;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!worker) {
    return <div className="pt-32 text-center font-bold">No worker selected. Please go back to services.</div>;
  }

  const handleBooking = async () => {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/bookings/', {
        user_email: user.email,
        worker_id: worker.id,
        worker_name: worker.name,
        service: worker.skills?.[0] || 'General Service',
        date,
        time,
        price: 200, // Default for now
        address: user.address || 'User Address'
      });
      
      setIsSuccess(true);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/tracking'); // Navigate to tracking after success
      }, 3000);
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-purple-600 transition-all"
        >
          <ArrowBackIcon fontSize="small" /> Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           {/* Left: Summary */}
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100"
           >
              <h2 className="text-3xl font-black text-gray-900 mb-8">Service Summary</h2>
              
              <div className="flex items-center gap-6 mb-10 p-6 bg-purple-50 rounded-[2rem] border border-purple-100">
                 <img 
                  src={worker.photo || 'https://via.placeholder.com/150'} 
                  alt={worker.name} 
                  className="w-24 h-24 rounded-3xl object-cover"
                 />
                 <div>
                    <h3 className="text-xl font-black text-gray-900">{worker.name}</h3>
                    <p className="text-purple-600 font-black">{worker.skills?.[0]}</p>
                    <p className="text-gray-400 font-bold text-sm mt-1">⭐ 4.8 Rating • 2.5km</p>
                 </div>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-500 font-bold">Service Fee</span>
                    <span className="text-gray-900 font-black flex items-center"><CurrencyRupeeIcon sx={{ fontSize: 18 }} /> 200</span>
                 </div>
                 <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-500 font-bold">Visiting Charges</span>
                    <span className="text-gray-900 font-black flex items-center"><CurrencyRupeeIcon sx={{ fontSize: 18 }} /> 49</span>
                 </div>
                 <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center text-2xl">
                    <span className="text-gray-900 font-black">Total</span>
                    <span className="text-purple-600 font-black flex items-center"><CurrencyRupeeIcon sx={{ fontSize: 24 }} /> 249</span>
                 </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl flex items-start gap-4">
                 <CheckCircleIcon className="text-emerald-500" />
                 <p className="text-emerald-700 font-bold text-sm">Free cancellation until 2 hours before the service.</p>
              </div>
           </motion.div>

           {/* Right: Booking Form */}
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100"
           >
              <h3 className="text-2xl font-black text-gray-900 mb-8">Schedule Service</h3>
              
              <div className="space-y-8">
                 <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Select Date</label>
                    <div className="relative">
                       <CalendarMonthIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                        type="date" 
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-purple-600 transition-all font-bold"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Select Time</label>
                    <div className="relative">
                       <AccessTimeIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                       <select 
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-purple-600 transition-all font-bold appearance-none"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                       >
                          <option value="">Choose a slot</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Service Address</label>
                    <div className="relative">
                       <LocationOnIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                       <div className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 truncate">
                          {user?.address || 'Set address in profile'}
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={handleBooking}
                  disabled={loading || isSuccess}
                  className="w-full py-6 bg-purple-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-purple-600/30 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 mt-4"
                 >
                   {loading ? 'Confirming...' : isSuccess ? 'Confirmed! ✨' : 'Confirm & Book Now'}
                 </button>
              </div>
           </motion.div>
        </div>

      </div>

      {/* Success Modal */}
      <AnimatePresence>
         {isSuccess && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-white w-full max-w-md rounded-[3rem] p-10 text-center shadow-2xl overflow-hidden"
              >
                 <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8">
                    <CheckCircleIcon sx={{ fontSize: 60 }} />
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 mb-4">Booking Successful!</h2>
                 <p className="text-gray-500 font-bold mb-8">Ravi Kumar has been notified and will arrive at your location on {date} at {time}.</p>
                 <div className="p-6 bg-emerald-50 rounded-2xl font-black text-emerald-700 text-sm">
                    Redirecting to tracking page...
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default Booking;