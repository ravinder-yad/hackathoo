import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // States
  const [role, setRole] = useState(null); // 'user' or 'worker'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { access_token, ...userData } = response.data;

      // Update Auth Context
      login({ ...userData, token: access_token });

      toast.success(`Welcome back, ${userData.name}! 🚀`);

      // Auto Redirect based on role
      if (userData.role === 'worker') {
        navigate('/dashboard/worker');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="text-center">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back 👋</h2>
      <p className="text-gray-500 font-bold mb-10">Select your account type to login</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setRole('user')}
          className="p-8 border-2 border-gray-100 rounded-[2rem] cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition-all group"
        >
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <PersonOutlineIcon fontSize="large" />
          </div>
          <h3 className="text-xl font-black text-gray-900">User</h3>
          <p className="text-gray-500 text-sm font-bold mt-2">Login as Customer</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setRole('worker')}
          className="p-8 border-2 border-gray-100 rounded-[2rem] cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all group"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <EngineeringIcon fontSize="large" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Worker</h3>
          <p className="text-gray-500 text-sm font-bold mt-2">Login as Professional</p>
        </motion.div>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button onClick={() => setRole(null)} className="mb-6 text-gray-400 hover:text-purple-600 flex items-center gap-2 font-bold text-sm">
        <ArrowBackIcon fontSize="small" /> Back
      </button>

      <h2 className="text-3xl font-black text-gray-900 mb-2">Login as {role === 'worker' ? 'Worker' : 'User'}</h2>
      <p className="text-gray-500 font-bold mb-8">Enter your credentials to access your account</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">Email or Phone</label>
          <input
            type="text" name="email" required
            placeholder="example@gmail.com"
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-purple-600 transition-all font-medium"
            onChange={handleInputChange}
          />
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-black text-gray-700">Password</label>
            <Link to="/forgot-password" size="small" className="text-purple-600 text-xs font-bold hover:underline">
              Forgot Password?
            </Link>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password" required
            placeholder="Enter your password"
            maxLength={72}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-purple-600 transition-all font-medium"
            onChange={handleInputChange}
          />
          <button
            type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-[46px] text-gray-400 hover:text-purple-600"
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox" name="rememberMe" id="rememberMe"
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            onChange={handleInputChange}
          />
          <label htmlFor="rememberMe" className="text-sm font-bold text-gray-500 cursor-pointer">Remember Me</label>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-400 bg-white px-4">OR</div>
        </div>
        <button className="flex items-center justify-center gap-3 w-full py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold">
          <GoogleIcon className="text-red-500" /> Continue with Google
        </button>
      </div>

      <p className="mt-8 text-center text-gray-500 font-bold">
        Don't have an account? <Link to="/register" className="text-purple-600 hover:underline">Sign Up</Link>
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-xl w-full">
        {/* Brand Logo */}
<<<<<<< HEAD
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 bg-purple-600 rounded-xl"></div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">HireAgain</h1>
=======
        <Link to="/" className="flex items-center justify-center mb-10">
          <img src="/logo.png" alt="HireAgain" className="h-16 w-auto object-contain" />
>>>>>>> 0fadc461a9703a04f9fc75e942304aeb09ce96c8
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12">
          {!role ? renderRoleSelection() : renderLoginForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
