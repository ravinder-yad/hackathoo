import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';

const WorkerEarnings = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    if (user?.email && user?.role === 'worker') {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/worker/stats/${user.email}`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-32 text-center font-black animate-pulse">Calculating your financial success... 💰</div>;

  const summaryCards = [
    { period: 'Today', amount: `₹${stats.today_earnings}`, jobs: stats.weekly_breakdown?.find(d => d.day.includes('Today'))?.jobs || 0 },
    { period: 'This Week', amount: `₹${stats.this_week_earnings}`, jobs: stats.weekly_breakdown?.reduce((acc, curr) => acc + curr.jobs, 0) },
    { period: 'Lifetime', amount: `₹${stats.total_earnings}`, jobs: stats.total_jobs },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Earnings Center</h1>
            <p className="text-gray-500 font-bold mt-1">Track your performance and financial growth</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-purple-600 transition-all shadow-xl active:scale-95">
            <FileDownloadIcon fontSize="small"/> Export Statement
          </button>
        </div>

        {/* Earning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {summaryCards.map((data, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{data.period}</p>
                <h2 className="text-5xl font-black text-gray-900 mb-3 tracking-tighter">{data.amount}</h2>
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                      <TrendingUpIcon sx={{ fontSize: 14 }} />
                   </div>
                   <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                      {data.jobs} {data.jobs === 1 ? 'Job' : 'Jobs'} Completed
                   </p>
                </div>
              </div>
              <AccountBalanceWalletIcon className="absolute -bottom-6 -right-6 text-gray-50 text-[120px] group-hover:text-purple-50/50 transition-colors" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Detailed Weekly Chart */}
           <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-2xl font-black text-gray-900">Weekly Performance</h3>
                 <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <HistoryIcon fontSize="small" /> Last 7 Days
                 </div>
              </div>
              
              <div className="space-y-10">
                 {stats.weekly_breakdown?.map((item, i) => (
                   <div key={i} className="group">
                      <div className="flex justify-between items-end mb-3 px-1">
                        <div>
                          <span className={`text-xs font-black uppercase tracking-widest ${item.day.includes('Today') ? 'text-purple-600' : 'text-gray-400'}`}>
                            {item.day}
                          </span>
                          <p className="text-[10px] font-bold text-gray-300">{item.jobs} jobs completed</p>
                        </div>
                        <span className="text-lg font-black text-gray-900">₹{item.amount}</span>
                      </div>
                      <div className="h-5 w-full bg-gray-50 rounded-2xl overflow-hidden p-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1.5, ease: "easeOut" }}
                          className={`h-full rounded-xl shadow-lg ${item.day.includes('Today') ? 'bg-gradient-to-r from-purple-600 to-indigo-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}
                        />
                      </div>
                   </div>
                 ))}
              </div>

              {/* Chart Legend */}
              <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 <span>Performance Scale (Daily Goal: ₹2,000)</span>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-600 rounded-full"></span> Today</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-gray-300 rounded-full"></span> Past</div>
                 </div>
              </div>
           </div>

           {/* Insights Card */}
           <div className="space-y-8">
              <div className="bg-gray-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="relative z-10">
                    <h3 className="text-xl font-black mb-6">Financial Insight 💡</h3>
                    <p className="text-gray-400 font-bold text-sm leading-relaxed mb-8">
                       Your best performing day was <span className="text-white">Wednesday</span> with a total of <span className="text-emerald-400">₹1,800</span>. You are 12% ahead of your last week's average!
                    </p>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Estimated Next Payout</p>
                       <p className="text-3xl font-black text-white">₹{stats.this_week_earnings}</p>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
              </div>

              <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                 <h3 className="text-xl font-black mb-6">Tax Summary</h3>
                 <p className="text-gray-400 font-bold text-sm mb-6">Download your TDS certificates and annual earnings summary for tax filing.</p>
                 <button className="w-full py-4 border-2 border-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">
                    Download 2025-26 Summary
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerEarnings;
