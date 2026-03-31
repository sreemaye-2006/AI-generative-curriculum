import { useState, useEffect } from 'react';
import { getCurrentCurriculum, toggleTopicCompletion, getAIContent, generateCurriculum } from '../services/curriculumService';
import ReactMarkdown from 'react-markdown';

export default function CurriculumPage() {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [aiContent, setAiContent] = useState(null);
  const [fetchingAI, setFetchingAI] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getCurrentCurriculum();
      setCurriculum(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTopicCompletion(id);
      setCurriculum(updated);
    } catch (err) {
      alert('Error updating progress');
    }
  };

  const handleFetchAI = async (type, topic) => {
    setFetchingAI(true);
    setAiContent(null);
    try {
      const content = await getAIContent(type, topic);
      // Store type and data separately to avoid spreading arrays into objects
      setAiContent({ type, data: content });
    } catch (err) {
      alert('AI service is busy. Try again later.');
    } finally {
      setFetchingAI(false);
    }
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const newCurr = await generateCurriculum();
      setCurriculum(newCurr);
      setSelectedTopic(null);
      setAiContent(null);
    } catch (err) {
      alert('Error regenerating curriculum: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-indigo-600 font-bold text-xl animate-pulse">Mapping Your Learning Journey...</div>;

  if (!curriculum) return (
    <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-slate-700 max-w-2xl mx-auto mt-10 shadow-2xl">
      <h2 className="text-3xl font-bold mb-4 text-white">No Active Roadmap</h2>
      <p className="mb-8 text-slate-400">Go to dashboard to generate your AI personalized curriculum.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-10">
        <div className="mb-8 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-4">{curriculum.title}</h1>
            <p className="text-slate-400 text-lg">Your step-by-step master plan to reach <span className="font-bold text-pink-400">{curriculum.target}</span>.</p>
          </div>
          <button onClick={handleRegenerate} disabled={generating} 
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold rounded-xl text-sm transition-all shadow-lg disabled:opacity-50 whitespace-nowrap">
            {generating ? '⏳ Generating...' : '🔄 Regenerate Roadmap'}
          </button>
        </div>

        <div className="relative border-l-4 border-indigo-100 ml-4 space-y-12">
          {curriculum.weeks.map((week, idx) => (
            <div key={idx} className="relative pl-12 group">
              <div className={`absolute left-[-14px] top-0 w-6 h-6 rounded-full border-4 border-slate-900 shadow-md shadow-emerald-500/20 transition-all duration-300 ${week.completed ? 'bg-emerald-500' : 'bg-slate-700 group-hover:bg-purple-500'}`}></div>
              <div 
                className={`card-hover cursor-pointer ${selectedTopic?._id === week._id ? 'ring-2 ring-purple-500 shadow-purple-500/20' : ''}`}
                onClick={() => setSelectedTopic(week)}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">Week {week.week}</span>
                  <input 
                    type="checkbox" 
                    checked={week.completed} 
                    onChange={(e) => { e.stopPropagation(); handleToggle(week._id); }}
                    className="w-6 h-6 accent-emerald-500 cursor-pointer"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{week.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{week.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {week.subtopics.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/20">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 h-fit space-y-8">
        {selectedTopic ? (
          <div className="card-hover bg-slate-800/80 text-white min-h-[400px] flex flex-col border border-slate-700">
            <h3 className="text-xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Assistant</h3>
            <p className="text-slate-400 text-sm mb-8 border-b border-slate-700 pb-4">Resources for: <span className="text-white">{selectedTopic.title}</span></p>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => handleFetchAI('notes', selectedTopic.title)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm border border-slate-600 text-blue-300"
              >
                Get AI Notes
              </button>
              <button 
                onClick={() => handleFetchAI('quiz', selectedTopic.title)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm border border-slate-600 text-purple-300"
              >
                Topic Quiz
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {fetchingAI ? (
                 <div className="text-center py-10 animate-pulse text-purple-400">AI is thinking...</div>
              ) : aiContent ? (
                <div className="space-y-6">
                  {aiContent.type === 'notes' ? (
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                      <ReactMarkdown>{aiContent.data.content}</ReactMarkdown>
                      <h4 className="text-purple-400 font-bold mt-6 mb-2">Resources</h4>
                      <ul className="list-disc pl-4 text-slate-400">
                        {aiContent.data.resources?.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Array.isArray(aiContent.data) ? aiContent.data.map((q, i) => (
                        <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                          <p className="font-bold mb-4 text-slate-200">Q{i+1}. {q.question}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt, j) => (
                              <button key={j} className={`text-left px-4 py-2 rounded-lg transition-colors text-xs ${
                                j === q.answer
                                  ? 'bg-emerald-900/50 text-emerald-400 font-bold border border-emerald-500/30'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              }`}>
                                {String.fromCharCode(65+j)}. {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )) : <p className="text-rose-400">Failed to load quiz.</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm italic">
                  Select a topic and click "Get AI Notes" or "Topic Quiz" to start learning.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-800/50 rounded-3xl border border-slate-700 shadow-sm">
            <div className="text-4xl mb-4">📍</div>
            <p className="text-slate-400 font-medium">Click on a weekly module to access AI study material and quizzes.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
