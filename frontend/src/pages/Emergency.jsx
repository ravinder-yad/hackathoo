import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LockIcon from '@mui/icons-material/Lock';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import PhoneIcon from '@mui/icons-material/Phone';
import StarRating from '../components/StarRating';

const Emergency = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Service Select, 2: Matching, 3: Worker List
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState('Detecting location...');
  const [workers, setWorkers] = useState([]);
  const [isLocating, setIsLocating] = useState(false);

  const emergencyServices = [
    { id: 'Electrician', name: 'Short Circuit / Fire', icon: <ElectricBoltIcon sx={{ fontSize: 40 }} />, color: 'bg-amber-500' },
    { id: 'Plumber', name: 'Pipe Burst / Flood', icon: <WaterDropIcon sx={{ fontSize: 40 }} />, color: 'bg-blue-500' },
    { id: 'Medical', name: 'Medical Help', icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />, color: 'bg-rose-500' },
    { id: 'Locksmith', name: 'Locked Out', icon: <LockIcon sx={{ fontSize: 40 }} />, color: 'bg-gray-700' },
  ];

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // In a real app, we would reverse geocode here. For demo, we use a placeholder.
        setTimeout(() => {
          setLocation("Malviya Nagar, Jaipur");
          setIsLocating(false);
        }, 1500);
      }, () => {
        setLocation("Jaipur, Rajasthan");
        setIsLocating(false);
      });
    }
  };

  const handleServiceSelect = (service) => {
    if (!isAuthenticated) {
      toast.error("Please login to request emergency help");
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setStep(2);
    findEmergencyWorkers(service.id);
  };

  const findEmergencyWorkers = async (skill) => {
    try {
      const response = await axios.get(`http://localhost:8000/workers?skill=${skill}`);
      // Simulate proximity sorting and availability
      setTimeout(() => {
        setWorkers(response.data.slice(0, 3));
        setStep(3);
      }, 2000);
    } catch (error) {
      toast.error("Failed to find nearby workers");
      setStep(1);
    }
  };

  const bookEmergency = async (worker) => {
    const loadingToast = toast.loading("Confirming Emergency Dispatch... 🚨");
    try {
      const bookingData = {
        user_email: user.email,
        worker_email: worker.email,
        worker_name: worker.name,
        service: selectedService.id,
        date: new Date().toLocaleDateString(),
        time: 'IMMEDIATE',
        address: location,
        priority: 'high',
        type: 'emergency'
      };
      
      await axios.post('http://localhost:8000/bookings/', bookingData);
      toast.success("Worker Dispatched! Arriving in 10 mins.", { id: loadingToast });
      navigate('/tracking');
    } catch (error) {
      toast.error("Emergency booking failed", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. SOS HEADER */}
      <section className="pt-32 pb-12 bg-red-600 text-white relative overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-500 scale-150 blur-3xl opacity-30"
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white/30"
           >
              <div className="w-10 h-10 bg-white rounded-full animate-ping" />
           </motion.div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Emergency Help</h1>
           <p className="text-red-100 font-bold text-lg max-w-xl mx-auto uppercase tracking-widest">Instant Dispatch • 24/7 Verified Experts</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-20 relative z-20">
         
         {/* 2. LOCATION BAR */}
         <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-gray-100 flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLocating ? 'bg-blue-50 text-blue-500 animate-pulse' : 'bg-emerald-50 text-emerald-500'}`}>
                  <GpsFixedIcon />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Current Location</p>
                  <p className="font-black text-gray-900">{location}</p>
               </div>
            </div>
            <button onClick={detectLocation} className="text-blue-600 font-black text-xs hover:underline uppercase tracking-widest">Refresh</button>
         </div>

         <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                 <h2 className="text-2xl font-black text-gray-900 mb-8">What happened?</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {emergencyServices.map(service => (
                      <motion.div 
                        key={service.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleServiceSelect(service)}
                        className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-red-500 transition-all cursor-pointer flex items-center gap-8 group"
                      >
                         <div className={`w-20 h-20 ${service.color} text-white rounded-[2rem] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                            {service.icon}
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-gray-900">{service.name}</h3>
                            <p className="text-gray-400 font-bold text-sm">Select for instant help</p>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                 <div className="relative w-40 h-40 mx-auto mb-10">
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-red-100 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center shadow-2xl">
                          <GpsFixedIcon sx={{ fontSize: 30 }} />
                       </div>
                    </div>
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 mb-2">Scanning for {selectedService.id}s</h2>
                 <p className="text-gray-500 font-bold">Contacting nearby available experts...</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Nearby {selectedService.id}s</h2>
                    <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Priority Mode Active</span>
                 </div>

                 <div className="space-y-6">
                    {workers.map((worker, i) => (
                      <motion.div 
                        key={worker.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8"
                      >
                         <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                            <img 
                              src={worker.photo ? (worker.photo.startsWith('http') ? worker.photo : `http://localhost:8000/${worker.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} 
                              className="w-24 h-24 rounded-[2rem] object-cover border-4 border-gray-50" 
                            />
                            <div>
                               <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                  <h3 className="text-2xl font-black text-gray-900">{worker.name}</h3>
                                  <StarRating rating={worker.average_rating || 4.8} size="small" />
                               </div>
                               <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                  <span className="text-emerald-600 font-black">● Available Now</span>
                                  <span>•</span>
                                  <span>{1.2 + i * 0.5} km away</span>
                                  <span>•</span>
                                  <span className="text-gray-900">ETA: {8 + i * 3} mins</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-3 w-full md:w-auto">
                            <a href={`tel:+91987654321${i}`} className="flex-1 md:flex-none px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200">
                               <PhoneIcon fontSize="small" /> Call
                            </a>
                            <button 
                              onClick={() => bookEmergency(worker)}
                              className="flex-1 md:flex-none px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all"
                            >
                               DISPATCH NOW
                            </button>
                         </div>
                      </motion.div>
                    ))}
                 </div>

                 <button 
                   onClick={() => setStep(1)}
                   className="w-full mt-12 py-4 text-gray-400 font-black hover:text-gray-600 uppercase tracking-widest text-sm"
                 >
                    Cancel & Go Back
                 </button>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default Emergency;
