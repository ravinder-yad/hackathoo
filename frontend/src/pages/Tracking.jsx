import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Tracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestBooking, setLatestBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    fetchLatestBooking();
  }, []);

  useEffect(() => {
    if (latestBooking && !loading && !mapInstance.current) {
      initMap();
    }
  }, [latestBooking, loading]);

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

  const initMap = () => {
    if (!window.L || !mapRef.current) return;

    // Use user's general location (mocked Jaipur coords for demo)
    const userPos = [26.9124, 75.7873];
    const workerPos = [26.9200, 75.7950];

    mapInstance.current = window.L.map(mapRef.current, {
      center: userPos,
      zoom: 14,
      zoomControl: false
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance.current);

    // Custom Icon for User
    const userIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-10 h-10 bg-white p-1 rounded-full shadow-xl border-2 border-purple-600 overflow-hidden"><img src="${user.photo ? (user.photo.startsWith('http') ? user.photo : `http://localhost:8000/${user.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'}" class="w-full h-full rounded-full object-cover"/></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Custom Icon for Worker
    const workerIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-10 h-10 bg-gray-900 p-1 rounded-full shadow-xl border-2 border-emerald-500 overflow-hidden"><img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400" class="w-full h-full rounded-full object-cover"/></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    window.L.marker(userPos, { icon: userIcon }).addTo(mapInstance.current).bindPopup('<b>You</b>').openPopup();
    window.L.marker(workerPos, { icon: workerIcon }).addTo(mapInstance.current).bindPopup(`<b>${latestBooking.worker_name}</b>`);

    // Draw route line
    const polyline = window.L.polyline([userPos, workerPos], { color: '#7c3aed', weight: 4, dashArray: '10, 10' }).addTo(mapInstance.current);
    mapInstance.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`http://localhost:8000/bookings/${latestBooking.id}`);
      toast.success("Booking cancelled successfully! 🔴");
      navigate('/bookings');
    } catch (error) {
      toast.error("Failed to cancel booking.");
    }
  };

  const steps = [
    { label: 'Booking Confirmed', status: 'completed' },
    { label: 'Worker Assigned', status: 'completed' },
    { label: 'Arriving', status: 'active' },
    { label: 'Service In Progress', status: 'pending' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 font-black tracking-widest uppercase text-xs">Syncing Live Map...</p>
       </div>
    </div>
  );

  if (!latestBooking) return (
    <div className="pt-32 text-center px-6">
       <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <MapIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
       </div>
       <h2 className="text-3xl font-black text-gray-900 tracking-tight">No Live Tracking</h2>
       <p className="text-gray-500 font-bold mt-4 max-w-sm mx-auto mb-10">You don't have any active service requests at the moment.</p>
       <button onClick={() => navigate('/services')} className="px-10 py-5 bg-purple-600 text-white rounded-[2rem] font-black shadow-xl shadow-purple-600/20">Find an Expert</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-10">
           
           {/* Left Column (Details) */}
           <div className="flex-1 space-y-8">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100 relative overflow-hidden"
              >
                 <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                    <div>
                       {latestBooking.priority === 'high' ? (
                         <span className="px-5 py-2 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Critical Emergency Response</span>
                       ) : (
                         <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Secure Session Active</span>
                       )}
                       <h2 className={`text-4xl font-black mt-6 tracking-tight ${latestBooking.priority === 'high' ? 'text-red-600' : 'text-gray-900'}`}>{latestBooking.service} Specialist</h2>
                       <p className="text-gray-400 font-bold mt-2">Transaction: #{latestBooking.id?.substring(0, 8)}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center md:text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
                       <p className="text-2xl font-black text-gray-900">Today • 12 Mins</p>
                    </div>
                 </div>

                 {/* Stepper Implementation */}
                 <div className="relative space-y-12 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-[3px] before:bg-gray-50">
                    {steps.map((step, i) => (
                       <div key={i} className="flex gap-8 relative z-10">
                          <div className={`w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-colors duration-500 ${step.status === 'completed' ? 'bg-emerald-500' : step.status === 'active' ? 'bg-purple-600' : 'bg-gray-200'}`}>
                             {step.status === 'completed' && <CheckCircleIcon sx={{ fontSize: 18, color: 'white' }} />}
                             {step.status === 'active' && <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>}
                          </div>
                          <div>
                             <p className={`text-lg font-black transition-colors ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-900'}`}>{step.label}</p>
                             {step.status === 'active' && <p className="text-purple-600 text-sm font-bold mt-1 italic">Worker is traversing the optimal route to your location...</p>}
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Decorative element */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full blur-3xl -z-0"></div>
              </motion.div>

              {/* Security Card with Real OTP */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
              >
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center text-emerald-400 backdrop-blur-md border border-white/10">
                       <ShieldIcon sx={{ fontSize: 32 }} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black mb-1">Arrival OTP</h3>
                       <p className="text-gray-400 font-bold text-sm">Authentication code for your safety</p>
                    </div>
                 </div>
                 <div className="bg-emerald-500 text-white px-10 py-6 rounded-[2rem] text-5xl font-black tracking-[0.4em] shadow-xl relative z-10">
                    {latestBooking.otp || '----'}
                 </div>
                 {/* Background Glow */}
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
              </motion.div>

           </div>

           {/* Right Column (Map & Worker) */}
           <div className="w-full lg:w-[450px] space-y-10">
              
              {/* Real Leaflet Map */}
              <div className="bg-white p-4 rounded-[4rem] shadow-xl border border-gray-100 group">
                 <div 
                  ref={mapRef} 
                  className="h-[350px] w-full rounded-[3.5rem] z-0 shadow-inner"
                  style={{ cursor: 'crosshair' }}
                 ></div>
                 <div className="p-6 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                       <SensorsIcon sx={{ fontSize: 14 }} className="text-emerald-500 animate-pulse" /> Live Satellite Link Established
                    </p>
                 </div>
              </div>

              {/* Worker & Communication */}
              <div className="bg-white rounded-[4rem] p-10 shadow-xl border border-gray-100 relative">
                 <div className="flex items-center gap-8 mb-10">
                    <div className="relative">
                       <img 
                         src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400" 
                         alt="Worker" 
                         className="w-24 h-24 rounded-[2.5rem] object-cover shadow-2xl"
                       />
                       <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                          <CheckCircleIcon sx={{ fontSize: 16 }} />
                       </div>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-900 mb-1">{latestBooking.worker_name}</h3>
                       <p className="text-gray-400 font-bold text-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Professional Partner
                       </p>
                       <div className="flex items-center gap-1 text-amber-500 mt-2 font-black">
                          4.9 ⭐ <span className="text-gray-300 font-bold text-[10px] ml-1">Verified Expert</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <a 
                      href={`tel:+919876543210`} // Mocked real phone number
                      className="flex items-center justify-center gap-3 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl active:scale-95"
                    >
                       <PhoneIcon /> Call
                    </a>
                    <a 
                      href={`https://wa.me/919876543210?text=Hello ${latestBooking.worker_name}, I am tracking your arrival for my ${latestBooking.service} service.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-6 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black text-lg hover:bg-emerald-100 transition-all border border-emerald-100 active:scale-95"
                    >
                       <WhatsAppIcon /> Chat
                    </a>
                 </div>

                 <button 
                  onClick={handleCancel}
                  className="w-full mt-10 py-5 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 rounded-[2rem] transition-all flex items-center justify-center gap-2"
                 >
                    <CloseIcon sx={{ fontSize: 18 }} /> Cancel Request
                 </button>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
};

// Mock Icon for sensors/updates
const SensorsIcon = ({ className, sx }) => (
  <svg className={className} style={sx} viewBox="0 0 24 24" fill="currentColor">
     <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 4a8 8 0 110 16 8 8 0 010-16z"/>
     <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default Tracking;
