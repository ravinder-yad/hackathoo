import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from "../../assets/logo.png"
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import axios from 'axios';
import logoImage from '../../assets/hire-again.png';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
<<<<<<< HEAD
   const [isOnline, setIsOnline] = useState(true);
   const [notifications, setNotifications] = useState([]);
   const [isAccountOpen, setIsAccountOpen] = useState(false);
   const accountRef = useRef(null);
 
   useEffect(() => {
     if (isAuthenticated) {
       fetchNotifications();
       const interval = setInterval(fetchNotifications, 15000);
       if (user?.role === 'worker') {
         fetchWorkerStatus();
       }
       return () => clearInterval(interval);
     }
   }, [isAuthenticated, user]);

   const fetchNotifications = async () => {
     try {
       const response = await axios.get(`http://localhost:8000/notifications/${user.email}`);
       setNotifications(response.data);
     } catch (error) {
       console.error("Failed to fetch notifications");
     }
   };
 
   const fetchWorkerStatus = async () => {
     try {
       const response = await axios.get(`http://localhost:8000/worker/stats/${user.email}`);
       setIsOnline(response.data.is_online);
     } catch (error) {
       console.error("Error fetching worker status:", error);
     }
   };
 
   const handleToggleStatus = async () => {
     const newStatus = !isOnline;
     try {
       await axios.post('http://localhost:8000/worker/status', {
         email: user.email,
         is_online: newStatus
       });
       setIsOnline(newStatus);
       toast.success(newStatus ? "Online! ðŸŸ¢" : "Offline ðŸ”´");
     } catch (error) {
       toast.error("Failed to update status");
     }
   };
 
   const handleLogout = () => {
     logout();
     navigate('/login');
     setIsMobileMenuOpen(false);
   };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
=======
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      if (user?.role === 'worker') {
        fetchWorkerStatus();
      }
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/notifications/${user.email}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const fetchWorkerStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/worker/stats/${user.email}`);
      setIsOnline(response.data.is_online);
    } catch (error) {
      console.error("Error fetching worker status:", error);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = !isOnline;
    try {
      await axios.post('http://localhost:8000/worker/status', {
        email: user.email,
        is_online: newStatus
      });
      setIsOnline(newStatus);
      toast.success(newStatus ? "Online! 🟢" : "Offline 🔴");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
<<<<<<< HEAD
    <nav className="fixed top-0 w-full bg-white shadow-md border-b z-[1000] px-4 md:px-8 py-2 md:py-3">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4 min-h-[64px]">
        
        {/* 1. Logo Section (Left) */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="shrink-0">
            <img src={logoImage} alt="HireAgain logo" className="w-24 h-24 md:w-28 md:h-28 object-contain rounded-2xl" />
=======
    <nav className="fixed top-0 w-full bg-white shadow-sm border-b z-[1000] px-4 md:px-8 h-24 flex items-center">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4 w-full">

        {/* 1. Logo Section (Left) */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src={logo}
              alt="WorkConnect Logo"
              className="h-20 w-60 object-contain"
            />
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8
          </Link>
        </div>

        {/* 2. Search Bar Section (Center - Flexible) */}
        <div className="hidden lg:flex items-center flex-1 justify-center px-4">
          <div className="flex items-center border border-gray-200 rounded-full px-5 py-2.5 w-full max-w-[450px] bg-gray-50 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-500/5 focus-within:border-purple-500/30 transition-all duration-300">
            <SearchIcon className="text-gray-400" fontSize="small" />
            <input
              className="bg-transparent outline-none w-full text-sm text-gray-700 px-3"
              placeholder="What service are you looking for?"
            />
            <MicIcon className="text-gray-400 hover:text-purple-600 cursor-pointer ml-2" fontSize="small" />
          </div>
        </div>

        {/* 3. Menu Section (Right) */}
        <div className="hidden md:flex items-center gap-6 shrink-0">

          {!isAuthenticated || user?.role === 'user' ? (
            <div className="flex items-center gap-6">
              <div className="relative" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
                <button className="text-gray-600 hover:text-purple-600 font-bold text-sm flex items-center gap-1 transition-colors">
                  Services <KeyboardArrowDownIcon fontSize="small" />
                </button>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 z-50 overflow-hidden"
                    >
                      <Link to="/services" className="block px-5 py-2.5 hover:bg-purple-50 text-sm font-medium transition-colors">Electrician</Link>
                      <Link to="/services" className="block px-5 py-2.5 hover:bg-purple-50 text-sm font-medium transition-colors">Plumber</Link>
                      <Link to="/services" className="block px-5 py-2.5 hover:bg-purple-50 text-sm font-medium transition-colors">Cleaning</Link>
                      <Link to="/services" className="block px-5 py-2.5 hover:bg-purple-50 text-sm font-medium transition-colors">AC Repair</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/emergency" className="bg-red-500 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 flex items-center gap-1">
                Emergency ðŸš¨
              </Link>

              {isAuthenticated ? (
                <Link to="/bookings" className="text-gray-600 hover:text-purple-600 font-bold text-sm transition-colors flex items-center gap-1">
                  <ShoppingBagOutlinedIcon fontSize="small" /> My Bookings
                </Link>
              ) : (
                <Link to="/register?role=worker" className="text-gray-600 hover:text-purple-600 font-bold text-sm transition-colors whitespace-nowrap">
                  Become a Worker
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/dashboard/worker" className="flex items-center gap-1 text-gray-600 hover:text-purple-600 font-bold text-sm">
                <DashboardOutlinedIcon fontSize="small" /> Dashboard
              </Link>
              <Link to="/jobs" className="text-gray-600 hover:text-purple-600 font-bold text-sm">Jobs</Link>
              <Link to="/earnings" className="text-gray-600 hover:text-purple-600 font-bold text-sm">Earnings</Link>

              <div className="h-6 w-[1px] bg-gray-100 mx-1"></div>

              {/* Online/Offline Toggle in Navbar */}
              <button
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isOnline
                  ? 'bg-green-50 text-green-600 border border-green-100 shadow-sm shadow-green-500/10'
                  : 'bg-red-50 text-red-600 border border-red-100'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
          )}

          <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-black font-black text-sm px-2">
                Login
              </Link>
              <Link to="/register" className="bg-purple-600 text-white px-7 py-2.5 rounded-full font-black text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 whitespace-nowrap">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="text-gray-400 hover:text-purple-600 relative transition-colors w-10 h-10 flex items-center justify-center rounded-xl hover:bg-purple-50 group"
              >
                <NotificationsNoneIcon className="group-hover:scale-110 transition-transform" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
<<<<<<< HEAD
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 pl-3 pr-2 border border-gray-100 rounded-2xl cursor-pointer hover:border-purple-600 hover:bg-gray-50 transition-all"
                  aria-expanded={isAccountOpen}
                >
                  <div className="hidden lg:flex flex-col items-end">
=======
              <div className="relative">
                <div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 p-1 pl-3 pr-2 border rounded-2xl cursor-pointer transition-all ${isProfileOpen ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-600 hover:bg-gray-50'}`}
                >
                  <div className="flex flex-col items-end hidden lg:flex">
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8
                    <span className="text-xs font-black text-gray-900 leading-none mb-0.5">{user?.name || 'User'}</span>
                    <span className="text-[10px] font-bold text-gray-400 capitalize tracking-wider leading-none">{user?.role}</span>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 overflow-hidden border-2 border-white shadow-sm">
                    {user?.photo ? (
                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-lg">{user?.name?.[0] || 'U'}</span>
                    )}
                  </div>
<<<<<<< HEAD
                  <KeyboardArrowDownIcon
                    className={`text-gray-400 transition-transform ${isAccountOpen ? 'rotate-180 text-purple-600' : ''}`}
                    fontSize="small"
                  />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-3 w-64 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-[2rem] border border-gray-50 py-4 z-50 overflow-hidden transform-gpu ${isAccountOpen ? 'block' : 'hidden'} animate-in fade-in slide-in-from-top-4 duration-300`}>
                   {/* Dropdown Header */}
                   <div className="px-6 py-4 bg-gray-50/50 mb-2">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
                      <p className="text-sm font-black text-gray-900 truncate">{user?.name || 'User Account'}</p>
                      <p className="text-[11px] font-bold text-gray-500 truncate">{user?.email || 'ravi@example.com'}</p>
                   </div>
=======
                  <KeyboardArrowDownIcon 
                    className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-purple-600' : ''}`} 
                    fontSize="small" 
                  />
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-[2rem] border border-gray-50 py-4 z-50 overflow-hidden"
                    >
                      {/* Dropdown Header */}
                      <div className="px-6 py-4 bg-gray-50/50 mb-2">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
                        <p className="text-sm font-black text-gray-900 truncate">{user?.name || 'User Account'}</p>
                        <p className="text-[11px] font-bold text-gray-500 truncate">{user?.email || 'ravi@example.com'}</p>
                      </div>
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8

                      <Link 
                        to="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group/item"
                      >
                        <PersonOutlinedIcon className="text-gray-400 group-hover/item:text-purple-600" fontSize="small" />
                        <span className="text-sm font-bold">My Profile</span>
                      </Link>

                      {user?.role === 'worker' ? (
                        <>
                          <Link to="/dashboard/worker" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group/item">
                            <DashboardOutlinedIcon className="text-gray-400 group-hover/item:text-purple-600" fontSize="small" />
                            <span className="text-sm font-bold">Dashboard</span>
                          </Link>
                          <Link to="/jobs" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group/item">
                            <EngineeringIcon className="text-gray-400 group-hover/item:text-purple-600" fontSize="small" />
                            <span className="text-sm font-bold">My Jobs</span>
                          </Link>
                          <Link to="/earnings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group/item">
                            <MonetizationOnIcon className="text-gray-400 group-hover/item:text-purple-600" fontSize="small" />
                            <span className="text-sm font-bold">Earnings</span>
                          </Link>
                        </>
                      ) : (
                        <Link to="/bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group/item">
                          <ShoppingBagOutlinedIcon className="text-gray-400 group-hover/item:text-purple-600" fontSize="small" />
                          <span className="text-sm font-bold">My Bookings</span>
                        </Link>
                      )}

                      <Link to={user?.role === 'worker' ? "/settings" : "/settings/user"} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group/item">
                        <SettingsOutlinedIcon className="text-gray-400 group-hover/item:text-purple-600" fontSize="small" />
                        <span className="text-sm font-bold">Settings</span>
                      </Link>

                      <hr className="my-3 border-gray-50 mx-6" />

                      <button onClick={() => { handleLogout(); setIsProfileOpen(false); }} className="flex items-center gap-3 w-full text-left px-6 py-3 hover:bg-red-50 text-red-500 transition-colors group/item">
                        <LogoutOutlinedIcon fontSize="small" className="group-hover/item:scale-110 transition-transform" />
                        <span className="text-sm font-black uppercase tracking-wider">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Mobile View Toggles */}
        <div className="md:hidden flex items-center gap-4">
          <button className="text-gray-400"><SearchIcon fontSize="small" /></button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 p-1 hover:bg-gray-100 rounded-lg">
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t mt-4 overflow-hidden pt-4 pb-8 flex flex-col gap-2 px-2"
          >
<<<<<<< HEAD
             <Link to="/services" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">All Services</Link>
             <Link to="/emergency" className="text-red-500 font-black px-4 py-3 hover:bg-red-50 rounded-xl">Emergency ðŸš¨</Link>
             <hr className="my-2 border-gray-50" />
             {!isAuthenticated ? (
               <>
                 <Link to="/register?role=worker" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">Become a Worker</Link>
                 <div className="grid grid-cols-2 gap-4 px-4 mt-4">
                    <Link to="/login" className="px-6 py-3.5 border border-gray-200 text-center font-bold rounded-2xl">Login</Link>
                    <Link to="/register" className="px-6 py-3.5 bg-purple-600 text-white text-center font-bold rounded-2xl shadow-lg shadow-purple-600/20">Sign Up</Link>
                 </div>
               </>
             ) : (
               <>
                  <Link to="/booking" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">My Bookings</Link>
                  <Link to="/profile" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">My Profile</Link>
                  <button onClick={handleLogout} className="text-left text-red-500 font-black px-4 py-3 hover:bg-red-50 rounded-xl mt-2">Logout</button>
               </>
             )}
=======
            <Link to="/services" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">All Services</Link>
            <Link to="/emergency" className="text-red-500 font-black px-4 py-3 hover:bg-red-50 rounded-xl">Emergency 🚨</Link>
            <hr className="my-2 border-gray-50" />
            {!isAuthenticated ? (
              <>
                <Link to="/register?role=worker" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">Become a Worker</Link>
                <div className="grid grid-cols-2 gap-4 px-4 mt-4">
                  <Link to="/login" className="px-6 py-3.5 border border-gray-200 text-center font-bold rounded-2xl">Login</Link>
                  <Link to="/register" className="px-6 py-3.5 bg-purple-600 text-white text-center font-bold rounded-2xl shadow-lg shadow-purple-600/20">Sign Up</Link>
                </div>
              </>
            ) : (
              <>
                <Link to="/booking" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">My Bookings</Link>
                <Link to="/profile" className="text-gray-900 font-bold px-4 py-3 hover:bg-gray-50 rounded-xl">My Profile</Link>
                <button onClick={handleLogout} className="text-left text-red-500 font-black px-4 py-3 hover:bg-red-50 rounded-xl mt-2">Logout</button>
              </>
            )}
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
<<<<<<< HEAD



=======
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8
