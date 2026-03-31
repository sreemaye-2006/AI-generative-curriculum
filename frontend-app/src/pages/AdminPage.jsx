import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 125,
        curriculumsGenerated: 342,
        avgCompletion: 42,
        popularGoals: [
          { name: 'Placement', count: 85 },
          { name: 'Startup', count: 25 },
          { name: 'Higher Studies', count: 15 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="text-center py-20 animate-pulse text-indigo-600 font-bold">Loading System Analytics...</div>;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">System Admin <span className="text-indigo-600">Analytics</span></h1>
        <p className="text-slate-500">Global performance metrics and user engagement statistics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-hover bg-indigo-600 text-white border-0">
          <div className="text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Total Students</div>
          <div className="text-5xl font-black">{stats.totalUsers}</div>
        </div>
        <div className="card-hover bg-slate-900 text-white border-0">
          <div className="text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Roadmaps Created</div>
          <div className="text-5xl font-black">{stats.curriculumsGenerated}</div>
        </div>
        <div className="card-hover bg-emerald-500 text-white border-0">
          <div className="text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Global Progress</div>
          <div className="text-5xl font-black">{stats.avgCompletion}%</div>
        </div>
      </div>
    </div>
  );
}
