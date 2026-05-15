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

const AppRoutes = () => {
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
          
          {/* Worker Routes */}
          <Route path="/dashboard/worker" element={<WorkerDashboard />} />
          <Route path="/jobs" element={<WorkerJobs />} />
          <Route path="/earnings" element={<WorkerEarnings />} />
          <Route path="/settings" element={<WorkerSettings />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

export default AppRoutes;
