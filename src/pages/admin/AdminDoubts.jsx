import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, Loader2, CheckCircle, Clock, User, Mail, MessageSquare, X, Send } from 'lucide-react';

const AdminDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDoubts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/doubts');
      const data = await response.json();
      if (data.success) {
        setDoubts(data.doubts);
      }
    } catch (err) {
      console.error('Failed to fetch doubts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const handleUpdate = async (id, status, answer = null) => {
    setIsSubmitting(true);
    try {
      const payload = { status };
      if (answer !== null) payload.answer = answer;

      const response = await fetch((window.API_BASE || "") + `/api/admin/doubts/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data.success) {
        setDoubts(doubts.map(d => d.id === id ? { ...d, status, answer: answer ?? d.answer } : d));
        if (selectedDoubt && selectedDoubt.id === id) {
          setSelectedDoubt({ ...selectedDoubt, status, answer: answer ?? selectedDoubt.answer });
        }
        if (answer !== null) setAnswerInput("");
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoubts = doubts.filter(doubt => {
    return (
      doubt.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doubt.user_name && doubt.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">
      {/* Doubt Detail Modal */}
      <AnimatePresence>
        {selectedDoubt && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDoubt(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-start shrink-0">
                <div>
                   <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase mb-3 inline-block ${
                      selectedDoubt.status === 'OPEN' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selectedDoubt.status === 'OPEN' ? 'Pending Answer' : 'Answered'}
                   </span>
                   <h2 className="text-2xl font-semibold text-slate-900">{selectedDoubt.subject}</h2>
                   <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                     <span className="flex items-center gap-1"><User size={14} /> {selectedDoubt.user_name || 'Student'}</span>
                     <span className="flex items-center gap-1"><Mail size={14} /> {selectedDoubt.user_email || 'No email'}</span>
                   </div>
                </div>
                <button onClick={() => setSelectedDoubt(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare size={14} /> Student's Doubt
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{selectedDoubt.description}</p>
                </div>

                <div className="mt-8">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle size={14} /> Instructor's Response
                  </h4>
                  
                  {selectedDoubt.status === 'ANSWERED' ? (
                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                      <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{selectedDoubt.answer}</p>
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            setAnswerInput(selectedDoubt.answer);
                            handleUpdate(selectedDoubt.id, 'OPEN'); // Reset to open to edit
                          }}
                          className="text-indigo-600 text-xs font-medium hover:underline"
                        >
                          Edit Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-indigo-100 rounded-2xl p-2 focus-within:border-indigo-500 transition-colors">
                      <textarea
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        placeholder="Type your comprehensive answer here..."
                        rows="5"
                        className="w-full bg-transparent p-4 outline-none resize-none text-slate-700 font-medium"
                      ></textarea>
                      <div className="flex justify-end p-2">
                        <button
                          disabled={!answerInput.trim() || isSubmitting}
                          onClick={() => handleUpdate(selectedDoubt.id, 'ANSWERED', answerInput)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send size={16} /> Send Reply</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Doubts Portal</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage and answer academic questions from students.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-300 transition-all font-medium" 
              placeholder="Search doubts or students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-indigo-600" size={18} />}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoubts.map((doubt) => (
              <motion.div 
                key={doubt.id}
                layout
                onClick={() => setSelectedDoubt(doubt)}
                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <User size={12} /> {doubt.user_name || 'Anonymous'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${
                    doubt.status === 'OPEN' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {doubt.status === 'OPEN' ? 'Pending Answer' : 'Answered'}
                  </span>
                </div>

                <h4 className="text-base font-semibold text-slate-900 mb-2 truncate">{doubt.subject}</h4>
                <p className="text-xs text-slate-500 mb-6 line-clamp-2 italic leading-relaxed break-words">{doubt.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(doubt.created_at).toLocaleDateString()}
                  </span>
                  
                  {doubt.status === 'OPEN' && (
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                      Needs Reply <MessageSquare size={14} />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {!isLoading && filteredDoubts.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">All clear!</h3>
              <p className="text-slate-400 text-sm italic">There are no academic doubts right now.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDoubts;


