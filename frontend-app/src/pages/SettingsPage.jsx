import { useState, useEffect } from 'react';
import { getProfile } from '../services/authService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', 'Graduate', 'Professional'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const CAREER_GOALS = ['Placement', 'Higher Studies', 'Startup', 'Career Switch'];
const SUBJECTS = [
  'DSA', 'DBMS', 'OS', 'Computer Networks', 'OOP', 'Math/Stats', 
  'Web Dev', 'System Design', 'Machine Learning', 'Deep Learning',
  'Cloud Computing', 'DevOps', 'Cyber Security', 'Blockchain', 
  'Mobile Development', 'UI/UX Design', 'Data Engineering', 'Game Development'
];

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    semester: '',
    skillLevel: 'Beginner',
    careerGoal: 'Placement',
    weakSubjects: [],
    numberOfWeeks: 4,
  });
  const [customSubject, setCustomSubject] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const u = await getProfile();
        setUser(u);
        setForm({
          name: u.name || '',
          semester: u.semester || '',
          skillLevel: u.skillLevel || 'Beginner',
          careerGoal: u.careerGoal || 'Placement',
          weakSubjects: u.weakSubjects || [],
          numberOfWeeks: u.numberOfWeeks || 4,
        });
      } catch (err) {
        console.error('Error fetching profile', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [navigate]);

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setMessage('');
    setError('');
  };

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      weakSubjects: prev.weakSubjects.includes(subject)
        ? prev.weakSubjects.filter(s => s !== subject)
        : [...prev.weakSubjects, subject],
    }));
    setMessage('');
    setError('');
  };

  const addCustomSubject = (e) => {
    e.preventDefault();
    const sub = customSubject.trim();
    if (sub && !form.weakSubjects.includes(sub)) {
      setForm(prev => ({ ...prev, weakSubjects: [...prev.weakSubjects, sub] }));
      setCustomSubject('');
      setMessage('');
      setError('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.weakSubjects.length === 0) {
      setError('Please select at least one focus subject.');
      return;
    }
    setSaving(true);
    setMessage('');
    setError('');
    try {
      // Direct call to update user profile
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setMessage('Profile updated successfully! Note: To apply new goals, regenerate your curriculum from the dashboard.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update user profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-400 font-bold text-xl animate-pulse">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700 p-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Account Settings ⚙️</h1>
        <p className="text-slate-400 text-sm mb-8">Update your profile parameters to fine-tune future AI generation.</p>

        {message && <div className="bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 p-4 rounded-xl text-sm mb-6">{message}</div>}
        {error && <div className="bg-red-900/50 text-red-400 border border-red-500/30 p-4 rounded-xl text-sm mb-6">{error}</div>}

        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="card-hover">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Basic Info</h2>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" required />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-slate-500 mb-2">Email Address (Cannot be changed)</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full px-4 py-3 bg-slate-800/50 text-slate-500 rounded-xl border border-slate-700/50 outline-none cursor-not-allowed" />
            </div>
          </div>

          <div className="card-hover">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Learning Profile</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Current Semester</label>
                <div className="flex flex-wrap gap-2">
                  {SEMESTERS.map(sem => (
                    <button type="button" key={sem} onClick={() => set('semester', sem)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm border transition-all ${
                        form.semester === sem ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-purple-500'
                      }`}>{sem}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Your Skill Level</label>
                <div className="flex gap-3">
                  {SKILL_LEVELS.map(level => (
                    <button type="button" key={level} onClick={() => set('skillLevel', level)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                        form.skillLevel === level ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-purple-500'
                      }`}>{level}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Career Goal</label>
                <div className="flex flex-wrap gap-3">
                  {CAREER_GOALS.map(goal => (
                    <button type="button" key={goal} onClick={() => set('careerGoal', goal)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                        form.careerGoal === goal ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-400'
                      }`}>{goal}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">
                  Skills to Learn / Focus Subjects
                </label>
                <p className="text-xs text-slate-500 mb-3">Type any skill, tool, or subject you want to learn from scratch.</p>
                
                <div className="flex gap-2 mt-3 mb-4">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addCustomSubject(e); }}
                    placeholder="E.g., Quantum Computing, Rust, Advanced React..."
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-white placeholder-slate-500 transition-all font-medium"
                  />
                  <button type="button" onClick={addCustomSubject} className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold transition-all">Add</button>
                </div>
                
                {form.weakSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-1">
                    {form.weakSubjects.map(subject => (
                      <div key={subject} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow text-sm font-semibold">
                        {subject}
                        <button type="button" onClick={() => toggleSubject(subject)} className="hover:text-pink-200 ml-1 text-lg leading-none">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Curriculum Duration: <span className="text-pink-400">{form.numberOfWeeks} weeks</span>
                </label>
                <input type="range" min={2} max={16} step={1} value={form.numberOfWeeks}
                  onChange={e => set('numberOfWeeks', Number(e.target.value))}
                  className="w-full accent-purple-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>2 weeks</span><span>8 weeks</span><span>16 weeks</span>
                </div>
              </div>

            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 btn-primary py-4 rounded-xl text-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
