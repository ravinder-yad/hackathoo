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
import BoltIcon from '@mui/icons-material/Bolt';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Footer from '../components/footer/Footer';
import StarRating from '../components/StarRating';
import WorkerDashboard from './Worker/WorkerDashboard';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
         setLatestBooking(response.data[0]);
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
    <div className="bg-white">
      {/* 1. HERO SECTION (Dynamic based on Auth) */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {!isAuthenticated ? (
            <div className="text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-widest rounded-full mb-6">
                  #1 Service Marketplace in India
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.1]"
              >
                Find Trusted Workers <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Instantly.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-500 font-bold max-w-2xl mx-auto mb-10"
              >
                Book electricians, plumbers, cleaners, and more — all in one platform.
              </motion.p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/services" className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-purple-600 transition-all shadow-xl shadow-gray-900/20 active:scale-95">
                  Explore Services
                </Link>
                <Link to="/register" className="px-10 py-5 bg-white border border-gray-200 text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                  Sign Up Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
               <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2"
                  >
                    Hello, <span className="text-purple-600">{user.name.split(' ')[0]}!</span> 👋
                  </motion.h1>
                  <p className="text-gray-500 font-bold text-lg">What service do you need today?</p>
               </div>
               <div className="relative group w-full md:w-[400px]">
                  <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search for services..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/services', { state: { query: searchQuery } })}
                    className="w-full pl-14 pr-14 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all font-bold"
                  />
                  <MicIcon 
                    onClick={handleVoiceSearch}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600 transition-colors" 
                  />
               </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. QUICK SERVICES (Always Visible) */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quick Services</h2>
             <Link to="/services" className="text-purple-600 font-black text-sm flex items-center gap-1 hover:underline">
                View All <ArrowForwardIcon sx={{ fontSize: 16 }} />
             </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((service, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                onClick={() => navigate('/services', { state: { category: service.name } })}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-center group cursor-pointer"
              >
                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(service.icon, { fontSize: 'medium' })}
                </div>
                <h3 className="font-black text-gray-900 text-sm">{service.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. RECOMMENDED WORKERS (Authenticated Only) */}
      <AnimatePresence>
        {isAuthenticated && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 bg-gray-50/50 rounded-[4rem] mx-4"
          >
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex items-center justify-between mb-12 text-center md:text-left">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recommended for You</h2>
                    <p className="text-gray-500 font-bold mt-1">Based on high ratings and reliability</p>
                  </div>
                  <Link to="/services" className="hidden md:flex bg-white px-6 py-3 rounded-2xl font-black text-sm border border-gray-100 shadow-sm hover:bg-gray-50">
                    See More
                  </Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {loading ? (
                    [1,2,3,4].map(n => (
                      <div key={n} className="bg-white h-64 rounded-[2.5rem] animate-pulse" />
                    ))
                  ) : (
                    recommendedWorkers.map((worker, index) => (
                      <motion.div 
                        key={worker.id}
                        whileHover={{ y: -10 }}
                        onClick={() => navigate('/booking', { state: { worker } })}
                        className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 hover:shadow-2xl transition-all cursor-pointer"
                      >
                         <div className="flex justify-between items-start mb-6">
                            <img src={worker.photo ? (worker.photo.startsWith('http') ? worker.photo : `http://localhost:8000/${worker.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover" />
                            <StarRating rating={worker.average_rating || 4.8} size="small" />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-1">{worker.name}</h3>
                         <p className="text-purple-600 font-black text-xs uppercase tracking-widest mb-4">{worker.skills?.[0]}</p>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px]">
                               <LocationOnIcon sx={{ fontSize: 14 }} /> Near {user.address ? user.address.substring(0, 10) : 'You'}
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase">{worker.total_reviews || 0} Reviews</span>
                         </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4. EMERGENCY SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-500 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">Need Urgent Help?</h2>
              <p className="text-red-100 font-bold mb-10 text-lg">Quick response for electrical, plumbing, and medical emergencies.</p>
              <Link to="/emergency" className="inline-block px-12 py-5 bg-white text-red-600 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Emergency Request 🚨
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE BOOKING SECTION (FOR USERS) */}
      <AnimatePresence>
        {latestBooking && (
          <section className="max-w-7xl mx-auto px-6 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl"
            >
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Active Service</span>
                    <span className="text-gray-400 font-bold text-sm">Order #{latestBooking.id?.substring(0, 8)}</span>
                  </div>
                  <h2 className="text-4xl font-black mb-4">Your {latestBooking.service} is on the way!</h2>
                  <div className="flex flex-wrap gap-6 text-gray-400 font-bold">
                    <div className="flex items-center gap-2">
                      <GpsFixedIcon className="text-emerald-500" fontSize="small" />
                      <span>Worker: {latestBooking.worker_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AccessTimeIcon className="text-blue-400" fontSize="small" />
                      <span>ETA: 12 Mins</span>
                    </div>
                  </div>
                </div>
                <Link to="/tracking" className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all flex items-center gap-3 shadow-xl">
                  Track Live <ArrowForwardIcon />
                </Link>
              </div>
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent skew-x-12 transform translate-x-1/2"></div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* 5. HOW IT WORKS (Only for guests) */}
      {!isAuthenticated && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-10"></div>
              {[
                { step: '01', title: 'Search Service', desc: 'Find the service you need in seconds.' },
                { step: '02', title: 'Choose Worker', desc: 'Get AI-recommended nearby verified workers.' },
                { step: '03', title: 'Track & Complete', desc: 'Track live location and get your work done smoothly.' },
              ].map((item, index) => (
                <div key={index} className="bg-white px-4">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 font-black text-xl shadow-lg shadow-purple-200">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FEATURES SECTION */}
      <section className="py-24 bg-gray-900 rounded-[4rem] mx-4 my-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-4">Why Choose Us?</h2>
            <div className="h-1.5 w-20 bg-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'AI Smart Matching', desc: 'Get the best worker based on ratings, distance, and availability.', icon: <AutoGraphIcon /> },
              { title: 'Live Tracking', desc: 'Track your worker in real-time.', icon: <LocationOnIcon /> },
              { title: 'Voice Booking', desc: 'Book services using voice commands.', icon: <MicIcon /> },
              { title: 'Verified Workers', desc: 'All workers are verified for your safety.', icon: <VerifiedUserIcon /> },
            ].map((feature, index) => (
              <div key={index} className="p-8 bg-gray-800/50 rounded-3xl border border-gray-700 hover:border-purple-500/50 transition-all">
                <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 font-bold text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA (Only for guests) */}
      {!isAuthenticated && (
        <section className="py-32 bg-white relative overflow-hidden text-center">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-12">Start Booking Today</h2>
          <Link to="/services" className="px-12 py-6 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-2xl shadow-purple-600/20 active:scale-95">
            Get Started Now
          </Link>
        </section>
      )}

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;