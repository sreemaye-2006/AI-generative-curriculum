import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile } from '../services/authService';
import { generateCurriculum, getCurrentCurriculum } from '../services/curriculumService';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      const curr = await getCurrentCurriculum();
      setCurriculum(curr);
    } catch (err) {
      console.log('No curriculum yet or unauthorized');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (isRegen = false) => {
    setLoading(true);
    try {
      const newCurr = await generateCurriculum();
      setCurriculum(newCurr);
      if (!isRegen) navigate('/curriculum');
      else await fetchData();
    } catch (err) {
      alert('Error generating curriculum: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-indigo-600 font-bold text-xl animate-pulse">Loading Your Smart Dashboard...</div>;

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-700">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Hello, {user?.name}! 👋</h1>
          <p className="text-slate-400 font-medium">Ready to continue your journey towards <span className="text-pink-400 font-bold">{user?.careerGoal || 'Success'}</span>?</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Global Progress</div>
          <div className="text-3xl font-black text-purple-400">{Math.round(user?.progress || 0)}%</div>
        </div>
      </header>

      {/* Profile incomplete banner */}
      {user && !user.semester && (
        <div className="flex items-center justify-between bg-amber-900/40 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-amber-400">Profile Incomplete</p>
              <p className="text-amber-300 text-sm">Complete your profile so we can generate a curriculum tailored to you.</p>
            </div>
          </div>
          <Link to="/setup-profile" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2 rounded-xl text-sm transition-all">Complete Profile</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {curriculum ? (
            <div className="card-hover">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{curriculum.title}</h2>
                  <p className="text-slate-400">{curriculum.weeks.length} Weeks • {curriculum.difficulty} Level • Target: {curriculum.target}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleGenerate(true)} disabled={loading}
                    className="px-4 py-2 border border-slate-600 text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-800 transition-all disabled:opacity-50">
                    🔄 Regenerate
                  </button>
                  <Link to="/curriculum" className="btn-primary">Open Roadmap</Link>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-6 border border-slate-700">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-1000" style={{ width: `${user?.progress || 0}%` }}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {curriculum.weeks.map((w, i) => (
                  <div key={i} className={`p-4 rounded-xl text-center border ${w.completed ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
                    <div className="text-xs font-bold uppercase mb-1">{w.subject || 'Week'}</div>
                    <div className="text-xl font-black text-white">{w.week}</div>
                  </div>
                ))}
            </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-white mb-4">No Curriculum Yet</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Your profile is all set! Click below to generate a personalized curriculum based on your
                <strong className="text-pink-400"> {user?.weakSubjects?.join(', ') || 'selected subjects'}</strong>,
                <strong className="text-purple-400"> {user?.numberOfWeeks || 4} weeks</strong> and
                <strong className="text-blue-400"> {user?.skillLevel || 'Beginner'}</strong> level.
              </p>
              <button onClick={() => handleGenerate(false)} disabled={loading} className="btn-primary px-12 py-4">
                {loading ? '⏳ Generating...' : '🚀 Generate My Curriculum'}
              </button>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="card-hover">
            <h3 className="text-xl font-bold text-white mb-6">Career Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-3">
                <span className="text-slate-400">Goal</span>
                <span className="font-bold text-slate-200 bg-slate-800 border border-slate-600 px-3 py-1 rounded-full text-xs uppercase">{user?.careerGoal || 'Not Set'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-3">
                <span className="text-slate-400">Level</span>
                <span className="font-bold text-slate-200">{user?.skillLevel || 'Not Set'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-3">
                <span className="text-slate-400">Semester</span>
                <span className="font-bold text-slate-200">{user?.semester || 'Not Set'}</span>
              </div>
              {user?.weakSubjects?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.weakSubjects.map(s => (
                    <span key={s} className="text-xs bg-slate-800 text-pink-400 border border-slate-700 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <Link to="/settings" className="mt-6 block text-center text-sm text-blue-400 font-bold hover:text-blue-300 transition-colors">⚙️ Settings</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
