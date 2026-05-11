import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* 1. Brand Section */}
          <div className="space-y-8">
             <Link to="/">
                <h2 className="text-3xl font-black text-purple-600 tracking-tighter">WorkConnect</h2>
             </Link>
             <p className="text-gray-500 font-bold leading-relaxed text-sm">
                Connecting you with trusted local experts instantly. Fast, reliable, and premium service delivery for the modern home.
             </p>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-purple-600 hover:shadow-md transition-all cursor-pointer">
                   <InstagramIcon fontSize="small" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-purple-600 hover:shadow-md transition-all cursor-pointer">
                   <TwitterIcon fontSize="small" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-purple-600 hover:shadow-md transition-all cursor-pointer">
                   <LinkedInIcon fontSize="small" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-purple-600 hover:shadow-md transition-all cursor-pointer">
                   <GitHubIcon fontSize="small" />
                </div>
             </div>
          </div>

          {/* 2. Quick Links */}
          <div>
             <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-8">Navigation</h4>
             <ul className="space-y-4">
                {['Home', 'Services', 'Emergency', 'My Bookings', 'Profile'].map((link) => (
                  <li key={link}>
                    <Link 
                      to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '')}`}
                      className="text-gray-400 hover:text-purple-600 font-bold text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* 3. Services */}
          <div>
             <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-8">Services</h4>
             <ul className="space-y-4">
                {['Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Carpenter'].map((link) => (
                  <li key={link}>
                    <Link to="/services" className="text-gray-400 hover:text-purple-600 font-bold text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* 4. Support */}
          <div>
             <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-8">Support & Legal</h4>
             <ul className="space-y-4">
                {['Help Center', 'FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-600 font-bold text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
             </ul>
             <div className="mt-10 p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                   <VerifiedUserIcon sx={{ fontSize: 16 }} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">ISO 27001 Certified Platform</p>
             </div>
          </div>

        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-gray-100">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                 <EmailIcon />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Assistance</p>
                 <p className="text-lg font-black text-gray-900">support@workconnect.com</p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                 <PhoneIcon />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call our Experts</p>
                 <p className="text-lg font-black text-gray-900">+91 1800 234 5678</p>
              </div>
           </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              © 2026 WorkConnect Marketplace. All Rights Reserved.
           </p>
           <div className="flex items-center gap-8">
              <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em]">Designed with ❤️ in India</p>
              <div className="h-4 w-[1px] bg-gray-100 hidden md:block"></div>
              <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em]">Version 2.4.0</p>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;