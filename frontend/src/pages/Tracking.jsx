import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';

const Tracking = () => {
  const { user } = useAuth();
  const [latestBooking, setLatestBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBooking();
  }, []);

  const fetchLatestBooking = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/user/${user.email}`);
      if (response.data.length > 0) {
        setLatestBooking(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Booking Confirmed', status: 'completed' },
    { label: 'Worker Assigned', status: 'active' },
    { label: 'Arriving', status: 'pending' },
    { label: 'Service In Progress', status: 'pending' },
  ];

  if (loading) return <div className="pt-32 text-center font-bold">Loading your booking status...</div>;

  if (!latestBooking) return (
    <div className="pt-32 text-center">
       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
       </div>
       <h2 className="text-2xl font-black text-gray-900">No active bookings</h2>
       <p className="text-gray-500 font-bold mt-2">Book a service to track it here!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-10">
           
           {/* Left: Progress & Details */}
           <div className="flex-1 space-y-8">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100"
              >
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       {latestBooking.priority === 'high' ? (
                         <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Priority Emergency Dispatch</span>
                       ) : (
                         <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest">Live Tracking</span>
                       )}
                       <h2 className={`text-3xl font-black mt-4 ${latestBooking.priority === 'high' ? 'text-red-600' : 'text-gray-900'}`}>{latestBooking.service} Request</h2>
                       <p className="text-gray-400 font-bold mt-1">Order ID: #{latestBooking.id?.substring(0, 8)}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-gray-400 font-bold text-sm">Scheduled for</p>
                       <p className="text-gray-900 font-black text-lg">{latestBooking.date} • {latestBooking.time}</p>
                    </div>
                 </div>

                 {/* Stepper */}
                 <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    {steps.map((step, i) => (
                       <div key={i} className="flex gap-6 relative z-10">
                          <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${step.status === 'completed' ? 'bg-emerald-500' : step.status === 'active' ? 'bg-purple-600' : 'bg-gray-200'}`}>
                             {step.status === 'completed' && <CheckCircleIcon sx={{ fontSize: 14, color: 'white' }} />}
                          </div>
                          <div>
                             <p className={`font-black ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-900'}`}>{step.label}</p>
                             {step.status === 'active' && <p className="text-purple-600 text-sm font-bold">Worker is preparing to reach your location</p>}
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>

              {/* Security OTP Card */}
              <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                       <ShieldIcon />
                    </div>
                    <div>
                       <p className="text-emerald-900 font-black">Security OTP</p>
                       <p className="text-emerald-700/70 font-bold text-sm">Share this with worker only at start of service</p>
                    </div>
                 </div>
                 <div className="text-3xl font-black text-emerald-600 tracking-[0.5rem] bg-white px-6 py-3 rounded-2xl shadow-sm">
                    4821
                 </div>
              </div>

           </div>

           {/* Right: Worker & Map Mockup */}
           <div className="w-full lg:w-[400px] space-y-8">
              
              {/* Map Mockup */}
              <div className="bg-gray-200 h-[300px] rounded-[3rem] relative overflow-hidden shadow-inner border border-gray-100">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Map Visualization Placeholder</p>
                  </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl"
                    >
                       <LocationOnIcon />
                    </motion.div>
                 </div>
              </div>

              {/* Worker Card */}
              <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
                 <div className="flex items-center gap-6 mb-8">
                    <img 
                      src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=60" 
                      alt="Worker" 
                      className="w-20 h-20 rounded-3xl object-cover"
                    />
                    <div>
                       <h3 className="text-xl font-black text-gray-900">{latestBooking.worker_name}</h3>
                       <p className="text-gray-400 font-bold text-sm flex items-center gap-1">⭐ 4.8 Pro Partner</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all">
                       <PhoneIcon fontSize="small" /> Call
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-purple-50 text-purple-600 rounded-2xl font-black text-sm hover:bg-purple-100 transition-all">
                       <ChatIcon fontSize="small" /> Chat
                    </button>
                 </div>
              </div>

              <button className="w-full py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">
                 Cancel Booking
              </button>

           </div>

        </div>

      </div>
    </div>
  );
};

export default Tracking;