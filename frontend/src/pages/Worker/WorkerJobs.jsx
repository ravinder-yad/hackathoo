import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import HistoryIcon from '@mui/icons-material/History';
import TrackingIcon from '@mui/icons-material/MyLocation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const WorkerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/worker/${user.email}`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/bookings/${bookingId}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success(`Job marked as ${newStatus}! 🎉`);
      fetchJobs(); // Refresh
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const activeJobs = jobs.filter(j => j.status !== 'Completed');
  const pastJobs = jobs.filter(j => j.status === 'Completed');

  if (loading) return <div className="pt-32 text-center font-black animate-pulse">Fetching your active assignments...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight">Job Management</h1>
           <div className="bg-purple-100 text-purple-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
              {activeJobs.length} Active Assignments
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Active Jobs Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Ongoing & Pending</h2>
            </div>
            
            <AnimatePresence>
              {activeJobs.length > 0 ? activeJobs.map((job, i) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-white p-8 rounded-[3rem] border-2 shadow-2xl ${job.priority === 'high' ? 'border-red-100 shadow-red-500/5' : 'border-purple-50'}`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${job.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            {job.status}
                          </span>
                          {job.priority === 'high' && (
                            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-lg uppercase tracking-wider animate-pulse">Emergency</span>
                          )}
                       </div>
                       <h3 className="text-3xl font-black text-gray-900">{job.service}</h3>
                       <p className="text-gray-400 font-bold mt-1">Booking ID: #{job.id.substring(0, 8)}</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">₹{job.price || 500}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                     <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Customer Location</p>
                        <p className="text-sm font-black text-gray-700 flex items-center gap-2">
                           <GpsFixedIcon fontSize="small" className="text-emerald-500" /> {job.address}
                        </p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Scheduled Time</p>
                        <p className="text-sm font-black text-gray-700 flex items-center gap-2">
                           <AccessTimeIcon fontSize="small" className="text-blue-500" /> {job.time} ({job.date})
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {job.status === 'pending' ? (
                      <button 
                        onClick={() => updateStatus(job.id, 'Arrived')}
                        className="flex-1 py-5 bg-purple-600 text-white rounded-2xl font-black text-lg hover:bg-purple-700 shadow-xl shadow-purple-600/20"
                      >
                        I have Arrived
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(job.id, 'Completed')}
                        className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircleIcon /> Mark as Completed
                      </button>
                    )}
                    <a 
                      href={`tel:+91${job.user_phone || '9876543210'}`} 
                      className="px-8 py-5 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneIcon /> Call Customer
                    </a>
                  </div>
                </motion.div>
              )) : (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
                   <p className="text-gray-400 font-black uppercase tracking-widest">No active jobs</p>
                   <p className="text-gray-300 font-bold mt-2">Go to dashboard to see new requests</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Job History Section */}
          <div className="space-y-8">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Completed Jobs</h2>
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
               <div className="space-y-6">
                  {pastJobs.length > 0 ? pastJobs.map((job, i) => (
                    <div key={job.id} className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-50 group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircleIcon />
                         </div>
                         <div>
                            <p className="font-black text-gray-900">{job.service}</p>
                            <p className="text-xs font-bold text-gray-400">{job.date} • {job.user_email}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-lg">₹{job.price || 500}</p>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Paid</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 font-bold py-10">No history available yet.</p>
                  )}
               </div>
               {pastJobs.length > 5 && (
                 <button className="w-full mt-8 py-4 text-purple-600 font-black text-xs uppercase tracking-widest hover:bg-purple-50 rounded-2xl transition-all">
                    Load More History
                 </button>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkerJobs;
