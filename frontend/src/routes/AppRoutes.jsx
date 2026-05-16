import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';

// Lazy load heavy pages to spread resource requests
const Services = lazy(() => import('../pages/Services'));
const Booking = lazy(() => import('../pages/Booking'));
const Tracking = lazy(() => import('../pages/Tracking'));
const Emergency = lazy(() => import('../pages/Emergency'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const WorkerDashboard = lazy(() => import('../pages/Worker/WorkerDashboard'));
const WorkerJobs = lazy(() => import('../pages/Worker/WorkerJobs'));
const WorkerEarnings = lazy(() => import('../pages/Worker/WorkerEarnings'));
const WorkerSettings = lazy(() => import('../pages/Worker/WorkerSettings'));
const UserSettings = lazy(() => import('../pages/UserSettings'));
const Notifications = lazy(() => import('../pages/Notifications'));
const MyBookings = lazy(() => import('../pages/MyBookings'));

 import { Navigate } from 'react-router-dom';
 import { useAuth } from '../context/AuthContext';
 
 const AppRoutes = () => {
   const { user, isAuthenticated } = useAuth();
 
   return (
     <MainLayout>
       <Suspense fallback={<div className="pt-32 text-center font-black animate-pulse text-purple-600">Loading HireAgain...</div>}>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/services" element={<Services />} />
           <Route path="/booking" element={<Booking />} />
           <Route path="/tracking" element={<Tracking />} />
           <Route path="/emergency" element={<Emergency />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/bookings" element={<MyBookings />} />
           <Route path="/settings/user" element={<UserSettings />} />
           <Route path="/notifications" element={<Notifications />} />
           
           {/* Worker Routes - Protected */}
           <Route 
             path="/dashboard/worker" 
             element={isAuthenticated && user?.role === 'worker' ? <WorkerDashboard /> : <Navigate to="/login" />} 
           />
           <Route 
             path="/jobs" 
             element={isAuthenticated && user?.role === 'worker' ? <WorkerJobs /> : <Navigate to="/login" />} 
           />
           <Route 
             path="/earnings" 
             element={isAuthenticated && user?.role === 'worker' ? <WorkerEarnings /> : <Navigate to="/login" />} 
           />
           <Route 
             path="/settings" 
             element={isAuthenticated && user?.role === 'worker' ? <WorkerSettings /> : <Navigate to="/login" />} 
           />
         </Routes>
       </Suspense>
     </MainLayout>
   );
 };

export default AppRoutes;
