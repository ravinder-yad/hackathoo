import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || null;
  const navigate = useNavigate();

  // States
  const [role, setRole] = useState(initialRole); // 'user' or 'worker'
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    skills: [],
    experience: 0,
    address: '',
    idProof: null,
    photo: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      
      // Generate Preview
      const previewUrl = URL.createObjectURL(file);
      if (name === 'photo') setPhotoPreview(previewUrl);
      if (name === 'idProof') setIdPreview(previewUrl);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkillToggle = (skill) => {
    const newSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validation
    if (role === 'user') {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
        toast.error("Please fill all fields to sign up");
        return;
      }
    } else if (role === 'worker') {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.address || formData.skills.length === 0) {
        toast.error("Complete all steps to submit your profile");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
        skills: formData.skills,
        phone: formData.phone,
        address: formData.address,
        experience: parseInt(formData.experience) || 0,
        joined_at: new Date().toISOString()
      };

      const form = new FormData();
      form.append("data", JSON.stringify(payload));
      if (formData.photo) form.append("photo", formData.photo);
      if (formData.idProof) form.append("id_proof", formData.idProof);

      const response = await axios.post('http://localhost:8000/auth/register', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.access_token) {
        login(response.data);
        toast.success(response.data.message);
        navigate(role === 'worker' ? '/dashboard/worker' : '/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
           <h1 className="text-4xl font-black text-gray-900 text-center mb-4 tracking-tighter">Choose Your Path</h1>
           <p className="text-gray-500 text-center mb-12 font-bold">How do you want to use HireAgain?</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setRole('user')}
                className="bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-purple-600 transition-all cursor-pointer shadow-sm text-center group"
              >
                 <div className="w-20 h-20 bg-purple-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <PersonOutlineIcon sx={{ fontSize: 40 }} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2">I'm a User</h3>
                 <p className="text-gray-400 font-bold text-sm">I want to book professionals for my work.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setRole('worker')}
                className="bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-blue-600 transition-all cursor-pointer shadow-sm text-center group"
              >
                 <div className="w-20 h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <EngineeringIcon sx={{ fontSize: 40 }} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2">I'm a Worker</h3>
                 <p className="text-gray-400 font-bold text-sm">I want to provide my services and earn.</p>
              </motion.div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-xl w-full">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20"></div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">HireAgain</h1>
        </Link>

        {/* Form Sections */}
        <AnimatePresence mode="wait">
          {/* USER FLOW: Single Step Simple Form */}
          {role === 'user' && (
            <motion.div 
              key="user-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50"
            >
               <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
               <p className="text-gray-500 font-bold mb-8">Join the HireAgain community</p>
               
               <div className="space-y-4 mb-8">
                  <div className="relative">
                     <PersonOutlineIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                      type="text" name="fullName" placeholder="Full Name" 
                      value={formData.fullName} onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:border-purple-600 transition-all font-bold" 
                     />
                  </div>
                  <div className="relative">
                     <input 
                      type="tel" name="phone" placeholder="Phone Number" 
                      value={formData.phone} onChange={handleInputChange}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:border-purple-600 transition-all font-bold" 
                     />
                  </div>
                  <div className="relative">
                     <input 
                      type="email" name="email" placeholder="Email Address" 
                      value={formData.email} onChange={handleInputChange}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:border-purple-600 transition-all font-bold" 
                     />
                  </div>
                  <div className="relative">
                     <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" placeholder="Create Password" 
                      value={formData.password} onChange={handleInputChange}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:border-purple-600 transition-all font-bold" 
                     />
                     <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
                     >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                     </button>
                  </div>
               </div>

               <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
               >
                 {loading ? 'Creating Account...' : 'Create Account'}
               </button>
               
               <p className="text-center mt-8 text-gray-500 font-bold">
                 Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
               </p>
            </motion.div>
          )}

          {/* WORKER FLOW: Multi-Step Form */}
          {role === 'worker' && (
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <h2 className="text-3xl font-black text-gray-900 mb-2">Basic Info</h2>
                   <p className="text-gray-500 font-bold mb-8">Tell us who you are</p>
                    <div className="space-y-5">
                       <input 
                         type="text" name="fullName" placeholder="Full Name" 
                         value={formData.fullName} onChange={handleInputChange}
                         className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" 
                       />
                       <input 
                         type="tel" name="phone" placeholder="Phone Number" 
                         value={formData.phone} onChange={handleInputChange}
                         className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" 
                       />
                       <input 
                         type="email" name="email" placeholder="Email Address" 
                         value={formData.email} onChange={handleInputChange}
                         className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" 
                       />
                       <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" placeholder="Password" 
                            value={formData.password} onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                             {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </button>
                       </div>
                       <button 
                         onClick={() => {
                           if(formData.fullName && formData.phone && formData.email && formData.password) {
                             setStep(2);
                           } else {
                             toast.error("Please fill all fields to continue");
                           }
                         }} 
                         className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-all"
                       >
                         Next Step
                       </button>
                    </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase mb-4">
                      <button onClick={() => setStep(1)} className="hover:underline">Step 1</button>
                      <span>/</span>
                      <span>Step 2</span>
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 mb-2">Expertise</h2>
                   <p className="text-gray-500 font-bold mb-8">What skills do you have?</p>
                   
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      {['Electrician', 'Plumber', 'Cleaning', 'AC Repair', 'Carpenter', 'Driver'].map(skill => (
                        <div 
                          key={skill} 
                          onClick={() => handleSkillToggle(skill)}
                          className={`p-4 rounded-2xl border-2 text-center cursor-pointer font-bold transition-all ${formData.skills.includes(skill) ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                        >
                          {skill}
                        </div>
                      ))}
                   </div>

                   <div className="mb-10">
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Years of Experience</p>
                      <input 
                       type="number" name="experience" placeholder="e.g. 3" 
                       value={formData.experience} onChange={handleInputChange}
                       className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-purple-600 transition-all font-bold" 
                      />
                   </div>

                   <button 
                     onClick={() => {
                       if(formData.skills.length > 0) {
                         setStep(3);
                       } else {
                         toast.error("Please select at least one skill");
                       }
                     }} 
                     className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-all"
                   >
                     Almost Done
                   </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase mb-4">
                      <button onClick={() => setStep(2)} className="hover:underline">Step 2</button>
                      <span>/</span>
                      <span>Step 3</span>
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 mb-2">Verification</h2>
                   <p className="text-gray-500 font-bold mb-8">Upload documents to get verified</p>
                   
                   <div className="space-y-6 mb-10">
                      <div>
                         <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Current Address</p>
                         <textarea 
                          name="address" placeholder="Full address..." 
                          value={formData.address} onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none h-24" 
                         />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Photo</p>
                            <label className="w-full h-32 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-600 transition-all overflow-hidden relative">
                               {photoPreview ? (
                                 <img src={photoPreview} className="w-full h-full object-cover" />
                               ) : (
                                 <>
                                   <CloudUploadIcon className="text-gray-300 mb-2" />
                                   <span className="text-[10px] font-bold text-gray-400">Upload JPG/PNG</span>
                                 </>
                               )}
                               <input type="file" name="photo" onChange={handleInputChange} className="hidden" accept="image/*" />
                            </label>
                         </div>
                         <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aadhaar Card</p>
                            <label className="w-full h-32 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-600 transition-all overflow-hidden relative">
                               {idPreview ? (
                                 <div className="flex flex-col items-center gap-1">
                                    <CheckCircleIcon className="text-emerald-500" />
                                    <span className="text-[10px] font-bold text-emerald-600">ID Attached</span>
                                 </div>
                               ) : (
                                 <>
                                   <CloudUploadIcon className="text-gray-300 mb-2" />
                                   <span className="text-[10px] font-bold text-gray-400">Upload PDF/JPG</span>
                                 </>
                               )}
                               <input type="file" name="idProof" onChange={handleInputChange} className="hidden" accept="image/*,application/pdf" />
                            </label>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={handleSubmit}
                     disabled={loading}
                     className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-lg active:scale-95 transition-all shadow-xl shadow-gray-900/20"
                   >
                     {loading ? 'Creating Profile...' : 'Submit Profile for Verification'}
                   </button>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;