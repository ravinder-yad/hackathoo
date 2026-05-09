import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-purple-600">WorkConnect</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Connecting you with trusted local professionals for all your home and business needs. Reliable, fast, and safe.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><FacebookIcon fontSize="small" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><TwitterIcon fontSize="small" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><InstagramIcon fontSize="small" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"><LinkedInIcon fontSize="small" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-black mb-6 uppercase tracking-widest text-xs">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">Find Services</Link></li>
              <li><Link to="/emergency" className="text-gray-500 hover:text-red-500 font-bold transition-colors">Emergency Help</Link></li>
              <li><Link to="/register?role=worker" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">Become a Worker</Link></li>
              <li><Link to="/how-it-works" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">How it Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-black mb-6 uppercase tracking-widest text-xs">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-purple-600 font-bold transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-black mb-6 uppercase tracking-widest text-xs">Contact Us</h3>
            <p className="text-gray-500 font-bold mb-4">support@workconnect.com</p>
            <p className="text-gray-500 font-bold">+1 (555) 123-4567</p>
            <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <p className="text-purple-600 text-xs font-black uppercase">Service Hours</p>
              <p className="text-purple-900 font-bold text-sm">24/7 Support Available</p>
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 font-bold text-sm">© 2026 WorkConnect. All rights reserved.</p>
          <div className="flex items-center gap-6">
             <Link to="/privacy" className="text-gray-400 hover:text-gray-600 text-xs font-bold transition-colors">Privacy Policy</Link>
             <Link to="/terms" className="text-gray-400 hover:text-gray-600 text-xs font-bold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;