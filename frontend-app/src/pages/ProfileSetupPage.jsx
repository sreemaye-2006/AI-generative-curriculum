import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/authService';

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const CAREER_GOALS = ['Placement', 'Higher Studies', 'Startup'];
const SUBJECTS = ['DSA', 'DBMS', 'OS', 'CN', 'OOP', 'Math', 'Physics', 'Machine Learning', 'Web Dev', 'System Design'];

export default function ProfileSetupPage() {
  const [form, setForm] = useState({
    semester: '',
    skillLevel: 'Beginner',
    careerGoal: 'Placement',
    weakSubjects: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      weakSubjects: prev.weakSubjects.includes(subject)
        ? prev.weakSubjects.filter(s => s !== subject)
        : [...prev.weakSubjects, subject],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.semester) {
      setError('Please select your semester.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updateProfile(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Set Up Your Profile</h1>
          <p className="text-slate-500 mt-2">Help us personalize your curriculum to your exact needs.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Semester */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Current Semester</label>
            <div className="flex flex-wrap gap-2">
              {SEMESTERS.map(sem => (
                <button
                  type="button"
                  key={sem}
                  onClick={() => handleChange('semester', sem)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm transition-all border ${
                    form.semester === sem
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {sem} Sem
                </button>
              ))}
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Your Skill Level</label>
            <div className="flex gap-4">
              {SKILL_LEVELS.map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => handleChange('skillLevel', level)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                    form.skillLevel === level
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Career Goal */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Primary Career Goal</label>
            <div className="flex gap-4">
              {CAREER_GOALS.map(goal => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => handleChange('careerGoal', goal)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                    form.careerGoal === goal
                      ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Weak Subjects */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Weak Subjects <span className="font-normal text-slate-400">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-3">
              {SUBJECTS.map(subject => (
                <button
                  type="button"
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                    form.weakSubjects.includes(subject)
                      ? 'bg-rose-500 text-white border-rose-500 shadow'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-60"
          >
            {loading ? 'Saving Profile...' : 'Save & Go to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}
