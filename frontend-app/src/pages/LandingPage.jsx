import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="py-12 md:py-24 text-center">
      <div className="max-w-4xl mx-auto">
        <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-bold tracking-wide uppercase mb-6 inline-block">
          Next Gen Education
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
          Master Any Skill with <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            AI-Personalized
          </span> Curriculums.
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          Ditch the generic syllabus. SmartCurriculum analyzes your career goals, current skills, and learning speed to build a unique path just for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary px-10 py-4 text-lg">
            Design My Curriculum
          </Link>
          <Link to="/login" className="px-10 py-4 text-lg font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all">
            View Sample Roadmap
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[
          { title: 'Adaptive Learning', desc: 'Syllabus difficulty adjusts based on your quiz scores and progress speed.', icon: '⚡' },
          { title: 'Goal-Oriented', desc: 'Tailored for Placements, Higher Studies, or even Startups.', icon: '🎯' },
          { title: 'AI Study Material', desc: 'Instantly generate notes, MCQs, and mini-project ideas for any topic.', icon: '🤖' }
        ].map((feat, i) => (
          <div key={i} className="card-hover">
            <div className="text-4xl mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
