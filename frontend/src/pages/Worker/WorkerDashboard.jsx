import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_earnings: 0,
    today_earnings: 0,
    average_rating: 0,
    total_reviews: 0,
    experience: 0,
    skills: []
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`http://localhost:8000/worker/stats/${user.email}`),
        axios.get(`http://localhost:8000/worker/history/${user.email}`)
      ]);
      
      setStats(statsRes.data);
      setIsOnline(statsRes.data.is_online);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load live data");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = !isOnline;
    try {
      await axios.post('http://localhost:8000/worker/status', {
        email: user.email,
        is_online: newStatus
      });
      setIsOnline(newStatus);
      toast.success(newStatus ? "You are now Online! 🟢" : "You are now Offline 🔴");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const statCards = [
    { title: 'Total Jobs', value: stats.total_jobs, icon: <EngineeringIcon />, color: 'bg-blue-600', trend: 'Live' },
    { title: "Today's Earnings", value: `₹${stats.today_earnings}`, icon: <MonetizationOnIcon />, color: 'bg-emerald-600', trend: 'Live' },
    { title: 'Avg Rating', value: stats.average_rating || '4.8', icon: <StarIcon />, color: 'bg-amber-500', trend: `${stats.total_reviews} Reviews` },
    { title: 'Work Experience', value: `${stats.experience} Yrs`, icon: <WorkspacePremiumIcon />, color: 'bg-indigo-600', trend: 'Verified' },
  ];

  if (loading) return <div className="pt-32 text-center font-black animate-pulse text-purple-600">Connecting to Live Command Center... 📡</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div className="flex items-center gap-6">
             <div className="relative">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl overflow-hidden border-4 border-white">
                   <img 
                     src={user?.photo ? (user.photo.startsWith('http') ? user.photo : `http://localhost:8000/${user.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} 
                     className="w-full h-full object-cover" 
                   />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
                   {stats.verified && <VerifiedIcon className="text-blue-500" />}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                   <p className="text-gray-500 font-bold flex items-center gap-1">
                      <EngineeringIcon sx={{ fontSize: 16 }} /> {stats.skills?.[0] || 'Professional'} Partner
                   </p>
                   <span className="text-gray-300">|</span>
                   <p className="text-gray-500 font-bold flex items-center gap-1">
                      <WorkspacePremiumIcon sx={{ fontSize: 16 }} /> {stats.experience} Years Experience
                   </p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
             <button 
               onClick={toggleStatus}
               className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all shadow-2xl active:scale-95 ${
                 isOnline 
                 ? 'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600' 
                 : 'bg-white text-gray-400 border border-gray-100'
               }`}
             >
               <PowerSettingsNewIcon />
               {isOnline ? 'ONLINE & ACTIVE' : 'OFFLINE'}
             </button>
             <Link to="/settings" className="p-5 bg-white text-gray-400 rounded-[2rem] border border-gray-100 hover:text-purple-600 hover:border-purple-100 transition-all shadow-sm">
                <EngineeringIcon />
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                   <div className={`w-14 h-14 rounded-2xl text-white ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                     {stat.icon}
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl">{stat.trend}</span>
                 </div>
                 <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.title}</p>
                 <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 rounded-full -z-0 group-hover:scale-150 transition-transform duration-700"></div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Real-time Request Alert */}
            <AnimatePresence>
              {showNewRequest && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 1 }}
                  className="bg-gray-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                >
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-2">
                           <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                           <span className="text-[10px] font-black uppercase tracking-widest">New Urgent Task</span>
                        </div>
                        <span className="text-gray-500 font-bold text-sm flex items-center gap-2"><LocationOnIcon sx={{ fontSize: 14 }} /> 2.4 km away</span>
                     </div>
                     <h2 className="text-4xl font-black mb-4">Emergency Pipe Burst Repair</h2>
                     <p className="text-gray-400 font-bold mb-10 leading-relaxed max-w-md">Client is reporting heavy water leakage in the kitchen area. Requires instant arrival.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                       <button onClick={() => setShowNewRequest(false)} className="flex-1 bg-white text-gray-900 py-5 rounded-2xl font-black text-lg hover:bg-emerald-500 hover:text-white transition-all">Accept Job</button>
                       <button onClick={() => setShowNewRequest(false)} className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition-all">Ignore</button>
                     </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Card */}
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-gray-900">Live Service Log</h3>
                  <Link to="/jobs" className="text-purple-600 font-black text-xs uppercase tracking-widest hover:underline">View All Jobs</Link>
               </div>
               <div className="space-y-4">
                  {history.length > 0 ? history.map((job, i) => (
                    <div key={i} className="group flex items-center justify-between p-6 bg-gray-50/50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-purple-500/5 transition-all border border-transparent hover:border-gray-100">
                       <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${job.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                             {job.status === 'Completed' ? <CheckCircleIcon /> : <AccessTimeIcon />}
                          </div>
                          <div>
                             <p className="font-black text-gray-900 text-lg">{job.service}</p>
                             <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mt-1">
                                <span><HistoryIcon sx={{ fontSize: 12 }} /> {job.date}</span>
                                <span>•</span>
                                <span>{job.user_email}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-gray-900">₹{job.price || 500}</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${job.status === 'Completed' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                             {job.status}
                          </span>
                       </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                       <p className="text-gray-400 font-black uppercase tracking-widest">No service history yet</p>
                       <p className="text-gray-300 font-bold mt-2">Activate your status to get bookings</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          <div className="space-y-10">
             {/* Profile Progress */}
             <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6">Profile Strength</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-black inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100">
                        85% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-8 text-xs flex rounded-full bg-gray-100">
                    <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-1000"></div>
                  </div>
                </div>
                <ul className="space-y-4">
                   <li className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <CheckCircleIcon className="text-emerald-500" fontSize="small" /> Photo Uploaded
                   </li>
                   <li className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <CheckCircleIcon className="text-emerald-500" fontSize="small" /> ID Proof Verified
                   </li>
                   <li className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div> Add Service Price
                   </li>
                </ul>
             </div>

             {/* Quick Support */}
             <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-xl font-black mb-4">Partner Support</h3>
                   <p className="text-indigo-100 font-bold text-sm mb-8 leading-relaxed">Need help with a job or payment? Our expert team is here for you 24/7.</p>
                   <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">Contact Help Center</button>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
