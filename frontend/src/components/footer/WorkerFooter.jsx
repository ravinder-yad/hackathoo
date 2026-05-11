import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StarIcon from '@mui/icons-material/Star';
import CircleIcon from '@mui/icons-material/Circle';
import EngineeringIcon from '@mui/icons-material/Engineering';

const WorkerFooter = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkerStatus();
    }
  }, [user]);

  const fetchWorkerStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/worker/stats/${user.email}`);
      setIsOnline(response.data.is_online);
    } catch (error) {
      console.error("Error fetching worker status");
    }
  };

  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Worker Identity */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <EngineeringIcon />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Worker Hub</h2>
             </div>
             <p className="text-gray-400 font-bold text-sm leading-relaxed">
                Empowering India's skilled professionals. Manage your service requests, track your daily earnings, and maintain your expert profile.
             </p>
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm w-fit">
                <CircleIcon sx={{ fontSize: 10 }} className={isOnline ? 'text-emerald-500 animate-pulse' : 'text-gray-300'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                   {isOnline ? 'Active for Work' : 'Currently Offline'}
                </span>
             </div>
          </div>

          {/* 2. Operations */}
          <div>
             <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-6">Operations</h4>
             <ul className="space-y-3">
                {[
                  { label: 'Control Center', path: '/dashboard/worker', icon: <DashboardIcon sx={{ fontSize: 16 }} /> },
                  { label: 'Active Jobs', path: '/jobs', icon: <BusinessCenterIcon sx={{ fontSize: 16 }} /> },
                  { label: 'Earning Reports', path: '/earnings', icon: <AccountBalanceWalletIcon sx={{ fontSize: 16 }} /> },
                  { label: 'Public Profile', path: '/profile', icon: <StarIcon sx={{ fontSize: 16 }} /> },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="flex items-center gap-3 text-gray-400 hover:text-purple-600 font-bold text-sm transition-colors">
                       {item.icon} {item.label}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* 3. Resources */}
          <div>
             <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-6">Resources</h4>
             <ul className="space-y-3">
                {['Skill Upgrading', 'Safety Protocols', 'Community Forum', 'Service Guidelines', 'Equipment Partners'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-600 font-bold text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
             </ul>
          </div>

          {/* 4. Support */}
          <div>
             <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-6">Partner Support</h4>
             <ul className="space-y-3">
                {['Emergency Hotline', 'Report an Issue', 'Worker FAQ', 'Platform Terms', 'Insurance Coverage'].map((link) => (
                  <li key={link}>
                    <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-purple-600 font-bold text-sm transition-colors">
                       {link}
                    </a>
                  </li>
                ))}
             </ul>
             <div className="mt-8 p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                   <SupportAgentIcon fontSize="small" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-none">24/7 Hotline</p>
                   <p className="text-sm font-black text-purple-900 mt-1">1800-PARTNER</p>
                </div>
             </div>
          </div>

        </div>

        {/* Worker Performance Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-gray-100 bg-white/50 px-6 rounded-[2rem]">
           <div className="text-center md:text-left border-r border-gray-100 last:border-0 md:pr-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Earnings</p>
              <p className="text-2xl font-black text-gray-900">₹1,240.00</p>
           </div>
           <div className="text-center md:text-left border-r border-gray-100 last:border-0 md:px-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expert Rating</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                 <p className="text-2xl font-black text-gray-900">4.9</p>
                 <div className="flex text-amber-500">
                    <StarIcon sx={{ fontSize: 18 }} />
                    <StarIcon sx={{ fontSize: 18 }} />
                    <StarIcon sx={{ fontSize: 18 }} />
                    <StarIcon sx={{ fontSize: 18 }} />
                    <StarIcon sx={{ fontSize: 18 }} />
                 </div>
              </div>
           </div>
           <div className="text-center md:text-left last:border-0 md:pl-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
              <p className="text-2xl font-black text-emerald-500 uppercase">98% Positive</p>
           </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">
              © 2026 WorkConnect Partner Platform. Secured by Enterprise Gateway.
           </p>
           <div className="flex items-center gap-6">
              <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-lg text-[8px] font-black uppercase">Professional Tier: GOLD</span>
              <p className="text-gray-300 font-black text-[9px] uppercase tracking-widest">Version 2.4.0-W</p>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default WorkerFooter;
