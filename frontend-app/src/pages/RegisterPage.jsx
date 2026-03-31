import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', 'Graduate', 'Professional'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const CAREER_GOALS = ['Placement', 'Higher Studies', 'Startup', 'Career Switch'];
const SUBJECTS = [
  'DSA', 'DBMS', 'OS', 'Computer Networks', 'OOP', 'Math/Stats', 
  'Web Dev', 'System Design', 'Machine Learning', 'Deep Learning',
  'Cloud Computing', 'DevOps', 'Cyber Security', 'Blockchain', 
  'Mobile Development', 'UI/UX Design', 'Data Engineering', 'Game Development'
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    semester: '',
    skillLevel: 'Beginner',
    careerGoal: 'Placement',
    weakSubjects: [],
    numberOfWeeks: 6,
  });
  const [customSubject, setCustomSubject] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      weakSubjects: prev.weakSubjects.includes(subject)
        ? prev.weakSubjects.filter(s => s !== subject)
        : [...prev.weakSubjects, subject],
    }));
  };

  const addCustomSubject = (e) => {
    e.preventDefault();
    const sub = customSubject.trim();
    if (sub && !form.weakSubjects.includes(sub)) {
      setForm(prev => ({ ...prev, weakSubjects: [...prev.weakSubjects, sub] }));
      setCustomSubject('');
    }
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!form.email.trim()) return 'Please enter your email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const validateStep2 = () => {
    if (!form.semester) return 'Please select your semester.';
    if (form.weakSubjects.length === 0) return 'Please select at least one weak subject.';
    return null;
  };

  const goNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password, {
        semester: form.semester,
        skillLevel: form.skillLevel,
        careerGoal: form.careerGoal,
        weakSubjects: form.weakSubjects,
        numberOfWeeks: form.numberOfWeeks,
      });
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Cannot reach backend. Is it running on port 5000?');
      } else {
        setError(err.response.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10">
      <div className="max-w-lg w-full bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700 p-10">

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-8">
          {[1,2].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step === s ? 'w-10 bg-gradient-to-r from-blue-500 to-purple-600' : 'w-4 bg-slate-700'}`} />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-3xl font-extrabold text-white text-center mb-2">Create Account</h1>
            <p className="text-slate-400 text-center text-sm mb-8">Step 1 of 2 — Basic Info</p>

            {error && <div className="bg-red-900/50 text-red-400 border border-red-500/30 p-3 rounded-xl text-sm mb-6">{error}</div>}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="you@university.edu" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Min. 6 characters" required />
              </div>
              <button type="button" onClick={goNext}
                className="w-full btn-primary py-4 rounded-2xl mt-4 text-lg">
                Next: Profile Setup →
              </button>
            </div>

            <p className="mt-6 text-center text-slate-400 text-sm">
              Already have an account? <Link to="/login" className="text-pink-400 font-bold hover:text-pink-300">Sign In</Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="text-3xl font-extrabold text-white text-center mb-2">Your Learning Profile</h1>
            <p className="text-slate-400 text-center text-sm mb-8">Step 2 of 2 — Personalization</p>

            {error && <div className="bg-red-900/50 text-red-400 border border-red-500/30 p-3 rounded-xl text-sm mb-6">{error}</div>}

            <div className="space-y-7">
              {/* Semester */}
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

              {/* Skill Level */}
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

              {/* Career Goal */}
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

              {/* Focus Skills */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">
                  Skills to Learn / Focus Subjects <span className="font-normal text-slate-500">(Type and add your own)</span>
                </label>
                <div className="flex gap-2 mt-3 mb-4">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addCustomSubject(e); }}
                    placeholder="Type a subject (e.g. Next.js, System Design) and press Enter..."
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

              {/* Number of Weeks */}
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

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setStep(1); setError(''); }}
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 btn-primary py-3 rounded-xl text-lg disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Account 🚀'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
