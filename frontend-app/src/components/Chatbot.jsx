import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI Mentor. Ask me any conceptual question or to explain a topic!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response for now. Ideally this hits the backend /api/chat
    setTimeout(() => {
      let reply = "That's a great question! Based on your curriculum, I'd suggest reviewing the core principles of that topic first.";
      
      const lowerInput = userMessage.text.toLowerCase();
      if (lowerInput.includes('dsa') || lowerInput.includes('array')) {
        reply = "Arrays are contiguous blocks of memory. They provide O(1) access time but O(N) insertion/deletion time.";
      } else if (lowerInput.includes('react') || lowerInput.includes('hook')) {
        reply = "React hooks allow you to use state and other React features without writing a class component, such as useState and useEffect.";
      } else if (lowerInput.includes('help')) {
        reply = "I'm here to provide quick conceptual explanations, help clarify topics in your roadmap, or even give a quick pop quiz!";
      } else if (lowerInput.includes('sql') || lowerInput.includes('dbms')) {
         reply = "In DBMS, SQL is used to query databases. Make sure you understand joins (INNER, LEFT, RIGHT) and aggregate functions.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 z-50 animate-bounce"
          aria-label="Open AI Chatbot"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50 animate-fade-in-up" style={{ height: '500px', maxHeight: '80vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                 <h3 className="font-bold text-sm">AI Mentor</h3>
                 <span className="text-xs text-indigo-200 flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
                 </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-indigo-200 p-1 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form border="t" className="border-t border-slate-100 p-3 bg-white" onSubmit={handleSend}>
            <div className="flex relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-slate-100 text-sm rounded-full py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1 top-1 bottom-1 w-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ↑
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
