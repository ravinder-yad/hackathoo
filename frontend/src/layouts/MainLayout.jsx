import Navbar from '../components/navbar';
import Footer from '../components/Footer/Footer';
import WorkerFooter from '../components/Footer/WorkerFooter';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-28">
        {children}
      </main>
      {(!user || user.role === 'user') ? <Footer /> : <WorkerFooter />}
    </div>
  );
};

export default MainLayout;
