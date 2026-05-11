import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ConstructionIcon from '@mui/icons-material/Construction';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import StarRating from '../components/StarRating';
import WorkerDashboard from './Worker/WorkerDashboard';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SensorsIcon from '@mui/icons-material/Sensors';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recommendedWorkers, setRecommendedWorkers] = useState([]);
  const [latestBooking, setLatestBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommended();
      fetchLatestBooking();
    }
  }, [isAuthenticated]);

  const fetchLatestBooking = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/user/${user.email}`);
      if (response.data.length > 0) {
        // Find the first active/pending booking
        const active = response.data.find(b => b.status === 'pending' || b.status === 'arrived');
        setLatestBooking(active || response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in this browser. 🎙️");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    toast.loading("Listening for service... 🎙️", { id: 'voice' });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      toast.dismiss('voice');
      toast.success(`Recognized: "${transcript}" ✨`);
      navigate('/services', { state: { query: transcript } });
    };

    recognition.onerror = (event) => {
      toast.dismiss('voice');
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. ❌");
      } else {
        toast.error("Voice recognition failed. ❌");
      }
    };
  };

  const fetchRecommended = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/workers?min_rating=4');
      setRecommendedWorkers(response.data.slice(0, 4));
    } catch (error) {
      console.error("Error fetching recommended workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Electrician', icon: <ElectricBoltIcon />, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Plumber', icon: <WaterDropIcon />, color: 'bg-blue-50 text-blue-600' },
    { name: 'Cleaning', icon: <CleaningServicesIcon />, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'AC Repair', icon: <AcUnitIcon />, color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Carpenter', icon: <ConstructionIcon />, color: 'bg-orange-50 text-orange-600' },
    { name: 'Driver', icon: <DirectionsCarIcon />, color: 'bg-indigo-50 text-indigo-600' },
  ];

  if (isAuthenticated && user?.role === 'worker') {
    return <WorkerDashboard />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-50 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {!isAuthenticated ? (
            <div className="text-center py-10">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
                  <SensorsIcon sx={{ fontSize: 14 }} /> Real-time Service Marketplace
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-6xl md:text-8xl font-black text-gray-900 tracking-tightest mb-8 leading-[0.95]"
              >
                Experience <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Silent Luxury</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-500 font-bold max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Connecting you with India's most verified professionals for every home need. Simple, fast, and secure.
              </motion.p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/services" className="px-12 py-6 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-purple-600 transition-all shadow-2xl shadow-gray-900/20 active:scale-95 text-lg">
                  Explore Services
                </Link>
                <Link to="/register" className="px-12 py-6 bg-white border border-gray-100 text-gray-900 font-black rounded-[2rem] hover:bg-gray-50 transition-all active:scale-95 text-lg shadow-sm">
                  Partner with Us
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-end justify-between gap-10 py-10">
               <div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-3">
                      Hey, <span className="text-purple-600">{user.name.split(' ')[0]}</span>
                    </h1>
                    <div className="flex items-center gap-3">
                       <p className="text-gray-400 font-bold text-xl">Find your next expert</p>
                       <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
                    </div>
                  </motion.div>
               </div>
               
               <div className="w-full md:w-[500px]">
                  <div className="relative group">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Electrician, Plumber, AC..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && navigate('/services', { state: { query: searchQuery } })}
                      className="w-full pl-16 pr-16 py-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] outline-none focus:border-purple-600 focus:ring-8 focus:ring-purple-600/5 transition-all font-black text-lg placeholder:text-gray-300"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <button 
                        onClick={handleVoiceSearch}
                        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                       >
                          <MicIcon fontSize="small" />
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. ACTIVE TRACKING (Authenticated & Active Only) */}
      <AnimatePresence>
        {isAuthenticated && latestBooking && (latestBooking.status === 'pending' || latestBooking.status === 'arrived') && (
          <section className="max-w-7xl mx-auto px-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-[3.5rem] p-10 md:p-12 text-white relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
            >
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="px-5 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> Live Tracking
                    </span>
                    <span className="text-gray-500 font-bold text-xs">ID: #{latestBooking.id?.substring(0, 8)}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                    {latestBooking.worker_name} is <span className="text-emerald-400">Arriving Soon</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Service Type</p>
                       <p className="text-lg font-black text-white">{latestBooking.service}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Estimated Time</p>
                       <p className="text-lg font-black text-white">8-12 Mins</p>
                    </div>
                  </div>
                </div>
                <Link to="/tracking" className="w-full lg:w-auto px-12 py-6 bg-white text-gray-900 rounded-[2rem] font-black text-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-500/10">
                  Track on Map <ArrowForwardIcon />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/10 to-transparent -z-0 pointer-events-none" />
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* 3. CATEGORIES GRID */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-3">
                <TrendingUpIcon className="text-purple-600" />
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Popular Categories</h2>
             </div>
             <Link to="/services" className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-purple-600 transition-all flex items-center gap-2">
                All Services <ArrowForwardIcon sx={{ fontSize: 14 }} />
             </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((service, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -8 }}
                onClick={() => navigate('/services', { state: { category: service.name } })}
                className="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-purple-500/5 transition-all text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 ${service.color} rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                  {React.cloneElement(service.icon, { sx: { fontSize: 28 } })}
                </div>
                <h3 className="font-black text-gray-900 text-sm tracking-tight">{service.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECOMMENDED WORKERS */}
      <AnimatePresence>
        {isAuthenticated && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 bg-gray-50/70 rounded-[4.5rem] mx-4 mb-20"
          >
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-center md:text-left">
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Verified Professionals Nearby</h2>
                    <p className="text-gray-400 font-bold text-lg mt-2 italic">Exclusively picked based on your high-end preferences</p>
                  </div>
                  <Link to="/services" className="bg-white px-10 py-5 rounded-[2rem] font-black text-sm border border-gray-200 shadow-sm hover:shadow-xl transition-all">
                    Browse All Experts
                  </Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  {loading ? (
                    [1,2,3,4].map(n => (
                      <div key={n} className="bg-white h-80 rounded-[3rem] animate-pulse" />
                    ))
                  ) : (
                    recommendedWorkers.map((worker, index) => (
                      <motion.div 
                        key={worker.id}
                        whileHover={{ y: -12 }}
                        onClick={() => navigate('/booking', { state: { worker } })}
                        className="bg-white rounded-[3rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 hover:shadow-3xl transition-all cursor-pointer group"
                      >
                         <div className="flex justify-between items-start mb-8">
                            <div className="relative">
                               <img src={worker.photo ? (worker.photo.startsWith('http') ? worker.photo : `http://localhost:8000/${worker.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg group-hover:rotate-3 transition-transform" />
                               <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-lg border-4 border-white shadow-sm">
                                  <VerifiedUserIcon sx={{ fontSize: 14 }} />
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="flex items-center gap-1 text-amber-500 mb-1">
                                  <StarIcon sx={{ fontSize: 16 }} />
                                  <span className="text-sm font-black text-gray-900">{worker.average_rating || 4.8}</span>
                               </div>
                               <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{worker.total_reviews || 12} Reviews</span>
                            </div>
                         </div>
                         <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">{worker.name}</h3>
                         <p className="text-purple-600 font-black text-xs uppercase tracking-widest mb-6">{worker.skills?.[0] || 'Expert'}</p>
                         
                         <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                               <LocationOnIcon sx={{ fontSize: 14 }} className="text-purple-300" />
                               <span>{worker.address?.split(',')[0] || 'Nearby'}</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full">Available</span>
                         </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. HIGH-IMPACT EMERGENCY SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-600 rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16 shadow-[0_40px_80px_rgba(220,38,38,0.2)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-800/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>
            
            <div className="relative z-10 text-center lg:text-left max-w-xl">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">Critical <br />Help Now.</h2>
              <p className="text-red-100 font-bold mb-12 text-xl leading-relaxed opacity-80">Seconds matter. Our highest-rated emergency responders are on standby 24/7 for you.</p>
              <Link to="/emergency" className="inline-flex px-14 py-6 bg-white text-red-600 rounded-[2.5rem] font-black text-2xl shadow-3xl hover:scale-105 hover:bg-gray-50 active:scale-95 transition-all">
                Emergency Alert 🚨
              </Link>
            </div>
            
            <div className="hidden lg:block relative">
               <div className="w-72 h-72 rounded-[4rem] bg-red-700/30 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center text-white"
                  >
                     <SensorsIcon sx={{ fontSize: 80 }} />
                  </motion.div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES / WHY CHOOSE US */}
      <section className="py-32">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-6">Built for the Discerning.</h2>
               <p className="text-gray-400 font-bold text-lg">Every feature is designed to provide a seamless, premium service experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {[
                 { title: 'AI Matching', desc: 'Proprietary algorithms pair you with the absolute best provider for your specific issue.', icon: <AutoGraphIcon /> },
                 { title: 'Silent Privacy', desc: 'Your data is encrypted. No spam, no marketing calls. Just service.', icon: <VerifiedUserIcon /> },
                 { title: 'Live Command', desc: 'Total control over your booking with real-time tracking and updates.', icon: <SensorsIcon /> }
               ].map((f, i) => (
                 <div key={i} className="text-center p-4">
                    <div className="w-20 h-20 bg-gray-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                       {f.icon}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                    <p className="text-gray-500 font-bold leading-relaxed">{f.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;