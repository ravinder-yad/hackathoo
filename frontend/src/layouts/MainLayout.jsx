import Navbar from '../components/navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-28">
        {children}
      </main>
      {/* Footer can be added here */}
    </div>
  );
};

export default MainLayout;