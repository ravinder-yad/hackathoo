import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BoltIcon from '@mui/icons-material/Bolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import StarRating from '../components/StarRating';

const categories = [
  { name: 'Electrician', icon: <BoltIcon />, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Plumber', icon: <WaterDropIcon />, color: 'bg-blue-50 text-blue-600' },
  { name: 'Cleaning', icon: <CleaningServicesIcon />, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'AC Repair', icon: <AcUnitIcon />, color: 'bg-cyan-50 text-cyan-600' },
  { name: 'Driver', icon: <DriveEtaIcon />, color: 'bg-purple-50 text-purple-600' },
];

const Services = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, [selectedCategory]);

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
      toast.success(`Searching for: "${transcript}" ✨`);
      setSearchQuery(transcript);
    };

    recognition.onerror = () => {
      toast.dismiss('voice');
      toast.error("Voice recognition failed. ❌");
    };
  };

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'All' ? `?skill=${selectedCategory}` : '';
      const response = await axios.get(`http://localhost:8000/workers${categoryParam}`);
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="mb-10">
           <h1 className="text-4xl font-black text-gray-900 mb-6">Find Professional Services</h1>
           
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                 <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                 <input 
                  type="text" 
                  placeholder="Search for electrician, plumber, ac repair..."
                  className="w-full pl-14 pr-14 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <button 
                   onClick={handleVoiceSearch}
                   className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-purple-600"
                 >
                    <MicIcon />
                 </button>
              </div>
              <button className="flex items-center justify-center gap-2 px-8 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm font-black text-gray-700 hover:border-purple-600 hover:text-purple-600 transition-all">
                 <FilterListIcon fontSize="small" /> Filters
              </button>
           </div>
        </div>

        {/* Categories */}
        <div className="mb-12 overflow-x-auto no-scrollbar py-2">
           <div className="flex gap-4 min-w-max">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`px-8 py-4 rounded-2xl font-black transition-all ${selectedCategory === 'All' ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'}`}
              >
                All Services
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${selectedCategory === cat.name ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'}`}
                >
                  <span className={selectedCategory === cat.name ? 'text-white' : 'text-purple-600'}>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
           </div>
        </div>

        {/* Worker Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           <AnimatePresence mode='wait'>
             {loading ? (
                [1,2,3,4,5,6,7,8].map(n => (
                  <div key={n} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 animate-pulse">
                     <div className="w-20 h-20 bg-gray-100 rounded-3xl mb-4" />
                     <div className="h-6 bg-gray-100 rounded-full w-2/3 mb-2" />
                     <div className="h-4 bg-gray-100 rounded-full w-1/2 mb-6" />
                     <div className="flex gap-2">
                        <div className="h-12 bg-gray-100 rounded-2xl flex-1" />
                        <div className="h-12 bg-gray-100 rounded-2xl flex-1" />
                     </div>
                  </div>
                ))
             ) : (
                workers.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase())).map((worker, index) => (
                  <motion.div 
                    key={worker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 hover:shadow-2xl hover:shadow-purple-600/10 hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden"
                  >
                     <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                           <img 
                            src={worker.photo ? (worker.photo.startsWith('http') ? worker.photo : `http://localhost:8000/${worker.photo.replace(/^\//, '')}`) : 'https://via.placeholder.com/150'} 
                            alt={worker.name} 
                            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-gray-50 group-hover:ring-purple-50 transition-all"
                           />
                           <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" />
                        </div>
                        <StarRating rating={worker.average_rating || 4.5} totalReviews={worker.total_reviews} size="small" />
                     </div>

                     <div className="mb-6">
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">{worker.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <p className="text-gray-400 font-bold text-sm flex items-center gap-1">
                              <LocationOnIcon sx={{ fontSize: 16 }} /> {worker.address ? (worker.address.length > 20 ? worker.address.substring(0, 20) + '...' : worker.address) : 'Near Jaipur'}
                           </p>
                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <p className="text-purple-600 font-black text-xs uppercase tracking-wider">{worker.experience || 0} Yrs Exp</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-8">
                        {worker.skills?.slice(0, 2).map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full text-xs font-black uppercase tracking-wider">{skill}</span>
                        ))}
                        {worker.skills?.length > 2 && <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full text-xs font-black">+{worker.skills.length - 2}</span>}
                     </div>

                     <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all">
                           Profile
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/booking', { state: { worker } });
                          }}
                          className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black text-sm hover:bg-purple-700 shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
                        >
                           Book Now
                        </button>
                     </div>
                  </motion.div>
                ))
             )}
           </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && workers.length === 0 && (
           <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-6">
                 <SearchIcon sx={{ fontSize: 40 }} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">No Workers Found</h3>
              <p className="text-gray-500 font-bold mt-2">Try changing the category or search query</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default Services;