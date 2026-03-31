import { useState, useEffect } from 'react';
import { getProfile } from '../services/authService';
import { getCurrentCurriculum } from '../services/curriculumService';
import { Link } from 'react-router-dom';

export default function ResumeBuilderPage() {
  const [user, setUser] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resume state
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState([
    { title: 'AI Personalized Curriculum Project', desc: 'Built a master project using skills learned from my personalized SmartCurriculum journey.' }
  ]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const u = await getProfile();
        setUser(u);
        const c = await getCurrentCurriculum();
        setCurriculum(c);
      } catch (err) {
        console.log('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleAddProject = () => {
    setProjects([...projects, { title: '', desc: '' }]);
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-20 text-indigo-400 font-bold text-xl animate-pulse">Loading Resume Builder...</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* Input Section (Hidden when printing via CSS) */}
      <div className="space-y-8 print:hidden">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Resume Builder 📄</h1>
          <p className="text-slate-400">Turn your SmartCurriculum progress into a professional resume.</p>
        </div>

        <div className="card-hover">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Profile Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Phone</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">LinkedIn URL</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="linkedin.com/in/johndoe" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">GitHub URL</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="github.com/johndoe" value={github} onChange={e => setGithub(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card-hover">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Experience / Bio</h2>
          <textarea className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none min-h-[120px]" placeholder="Brief professional summary..." value={experience} onChange={e => setExperience(e.target.value)}></textarea>
        </div>

        <div className="card-hover space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <h2 className="text-xl font-bold text-white">Projects</h2>
            <button onClick={handleAddProject} className="text-sm font-bold text-blue-400 hover:text-blue-300">Add Project +</button>
          </div>
          
          {projects.map((proj, i) => (
            <div key={i} className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <input type="text" className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Project Title" value={proj.title} onChange={e => handleProjectChange(i, 'title', e.target.value)} />
              <textarea className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]" placeholder="Project Description & Tech Stack used" value={proj.desc} onChange={e => handleProjectChange(i, 'desc', e.target.value)}></textarea>
            </div>
          ))}
        </div>

        <button onClick={handlePrint} className="w-full btn-primary py-4 text-lg">
          Export as PDF (Print) 🖨️
        </button>
      </div>

      {/* Preview Section (Takes up full width when printing) */}
      <div className="bg-white min-h-[1056px] text-slate-900 p-10 shadow-2xl rounded-sm font-serif print:p-0 print:shadow-none print:m-0 w-full overflow-hidden">
        
        {/* Header */}
        <div className="text-center border-b-2 border-slate-300 pb-6 mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 uppercase tracking-wide">{user?.name || 'Your Name'}</h1>
          <p className="text-slate-600 mb-2">{user?.email || 'email@example.com'} | {phone || '+1 555 555 5555'}</p>
          <div className="flex gap-4 justify-center text-sm">
            {linkedin && <a href={`https://${linkedin}`} className="text-blue-700 hover:underline">{linkedin}</a>}
            {github && <a href={`https://${github}`} className="text-slate-700 hover:underline">{github}</a>}
          </div>
        </div>

        {/* Bio / Objective */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">Professional Summary</h3>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {experience || `Highly motivated individual with a goal of achieving excellence in ${user?.careerGoal || 'my career'}. Dedicated to continuous learning and professional development.`}
          </p>
        </div>

        {/* Education & Learning Journey */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">Education & Curriculums</h3>
          <div className="mb-3 flex justify-between">
            <div>
              <p className="font-bold text-slate-900">University Student</p>
              <p className="text-slate-600 text-sm">Semester: {user?.semester || 'N/A'}</p>
            </div>
          </div>
          {curriculum && (
            <div className="mt-4">
              <p className="font-bold text-slate-900">SmartCurriculum AI - Intensive Training</p>
              <p className="text-indigo-600 font-semibold mb-1 text-sm">{curriculum.title} ({curriculum.target})</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Completed an intensive {curriculum.weeks.length}-week AI-generated syllabus tailored for {curriculum.difficulty} level.</li>
                <li>Key modules mastered: {curriculum.weeks.slice(0,3).map(w=>w.title).join(', ')}.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">Technical Skills</h3>
          <p className="text-slate-700 text-sm">
            <strong>Focus Areas: </strong> 
            {user?.weakSubjects?.length > 0 ? user.weakSubjects.join(', ') : 'Software Engineering, Development'}
          </p>
          <p className="text-slate-700 text-sm mt-1">
            <strong>Proficiency: </strong> {user?.skillLevel || 'Beginner'}
          </p>
        </div>

        {/* Projects */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">Projects</h3>
          <div className="space-y-4">
            {projects.map((proj, i) => proj.title && (
              <div key={i}>
                <p className="font-bold text-slate-900">{proj.title}</p>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{proj.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
