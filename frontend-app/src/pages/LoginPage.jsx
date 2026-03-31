import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      if (!err.response) {
        setError('Network Error: Backend unreachable. Check if it is running on port 5000.');
      } else if (err.response.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.response.status === 404) {
        setError('Server Error: Login endpoint not found.');
      } else {
        setError(err.response.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card-hover max-w-md w-full glass bg-slate-900/80 border border-slate-700 p-8 rounded-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-display">Welcome Back</h1>
        {error && <div className="bg-red-900/50 text-red-400 p-3 rounded-lg mb-6 text-sm border border-red-500/30">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 text-lg"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400">
          Don't have an account? <Link to="/register" className="text-pink-400 font-bold hover:text-pink-300">Register now</Link>
        </p>
      </div>
    </div>
  );
}
