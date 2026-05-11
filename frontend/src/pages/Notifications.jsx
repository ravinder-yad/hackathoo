import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { toast } from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds for semi-realtime feel
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/notifications/${user.email}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8000/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Error marking read");
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`http://localhost:8000/notifications/mark-all-read/${user.email}`);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success("All caught up! ✨");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />;
      case 'alert': return <BoltIcon sx={{ fontSize: 20 }} />;
      case 'offer': return <LocalOfferOutlinedIcon sx={{ fontSize: 20 }} />;
      default: return <NotificationsIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'booking': return 'bg-purple-50 text-purple-600';
      case 'alert': return 'bg-red-50 text-red-600';
      case 'offer': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-5xl font-black text-gray-900 tracking-tightest mb-4">Updates</h1>
              <p className="text-gray-400 font-bold text-xl flex items-center gap-2 italic">
                 Stay synchronized with your service lifecycle
              </p>
           </motion.div>
           {notifications.some(n => !n.read) && (
             <button 
              onClick={markAllRead}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
             >
                <DoneAllIcon sx={{ fontSize: 18 }} /> Mark All Read
             </button>
           )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
           {['all', 'booking', 'alert', 'offer'].map((filter) => (
             <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${
                activeFilter === filter 
                ? 'bg-gray-900 border-gray-900 text-white shadow-xl' 
                : 'bg-white border-transparent text-gray-400 hover:border-gray-200'
              }`}
             >
                {filter}
             </button>
           ))}
        </div>

        {loading ? (
          <div className="space-y-6">
             {[1, 2, 3].map(n => (
               <div key={n} className="bg-white h-24 rounded-[2rem] animate-pulse" />
             ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-4">
             {filteredNotifications.map((notif, index) => (
               <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                   markAsRead(notif.id);
                   if (notif.link) navigate(notif.link);
                }}
                className={`group relative p-8 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-8 ${
                  notif.read 
                  ? 'bg-white/60 border-transparent grayscale-[0.3]' 
                  : 'bg-white border-purple-100 shadow-[0_15px_40px_rgba(124,58,237,0.05)]'
                }`}
               >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${getBg(notif.type)}`}>
                     {getIcon(notif.type)}
                  </div>

                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-lg font-black tracking-tight ${notif.read ? 'text-gray-500' : 'text-gray-900'}`}>
                           {notif.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                           <AccessTimeIcon sx={{ fontSize: 12 }} /> 
                           {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                     </div>
                     <p className={`text-sm font-bold leading-relaxed ${notif.read ? 'text-gray-400' : 'text-gray-500'}`}>
                        {notif.message}
                     </p>
                  </div>

                  {!notif.read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse shrink-0"></div>
                  )}

                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                     <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                  </div>
               </motion.div>
             ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-[4rem] border border-gray-100 shadow-sm"
          >
             <div className="w-24 h-24 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-300 mx-auto mb-10">
                <NotificationsIcon sx={{ fontSize: 48 }} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">The Air is Silent</h2>
             <p className="text-gray-400 font-bold text-lg mt-4 max-w-xs mx-auto">No new updates found. We'll alert you as soon as something happens.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Notifications;
