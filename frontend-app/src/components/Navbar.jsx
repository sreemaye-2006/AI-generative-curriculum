import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="glass h-full w-64 p-8 flex flex-col bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 flex-shrink-0 relative z-50 overflow-y-auto">
      <div className="mb-12">
        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity block mb-2 leading-tight">
          Smart Curriculum
        </Link>
      </div>
      <div className="flex flex-col gap-6 font-medium text-slate-300 flex-1 mt-4">
        <Link to="/dashboard" className={`hover:text-pink-400 transition-colors ${location.pathname === '/dashboard' ? 'text-pink-400 font-bold' : ''}`}>Dashboard</Link>
        <Link to="/curriculum" className={`hover:text-purple-400 transition-colors ${location.pathname === '/curriculum' ? 'text-purple-400 font-bold' : ''}`}>My Roadmap</Link>
        <Link to="/resume" className={`hover:text-blue-400 transition-colors ${location.pathname === '/resume' ? 'text-blue-400 font-bold' : ''}`}>Resume</Link>
      </div>
      <div className="mt-12">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-semibold border border-slate-600 shadow-sm">Logout</button>
        ) : (
          <Link to="/login" className="btn-primary block text-center w-full py-3">Get Started</Link>
        )}
      </div>
    </nav>
  );
}
