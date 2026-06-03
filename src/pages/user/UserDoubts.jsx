import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Loader2, Plus, HelpCircle, CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

function UserDoubts() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);
  
  // Doubts tab states
  const [doubts, setDoubts] = useState([]);
  const [isDoubtsLoading, setIsDoubtsLoading] = useState(true);
  const [isSubmittingDoubt, setIsSubmittingDoubt] = useState(false);
  const [showDoubtForm, setShowDoubtForm] = useState(false);
  const [doubtFormData, setDoubtFormData] = useState({ subject: '', description: '' });

  useEffect(() => {
    if (user?.id) fetchDoubts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch Academic Doubts
  const fetchDoubts = async () => {
    try {
      const response = await fetch((window.API_BASE || "") + `/api/users/${user.id}/doubts`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) setDoubts(data.doubts);
    } catch (err) {
      console.error('Error fetching doubts:', err);
    } finally {
      setIsDoubtsLoading(false);
    }
  };

  // Submit new academic doubt
  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingDoubt(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/doubts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: user.id,
          subject: doubtFormData.subject,
          description: doubtFormData.description
        }),
      });
      const data = await response.json();
      if (data.success) {
        setDoubtFormData({ subject: '', description: '' });
        setShowDoubtForm(false);
        fetchDoubts();
      }
    } catch (err) {
      console.error('Error submitting doubt:', err);
    } finally {
      setIsSubmittingDoubt(false);
    }
  };

  if (isDoubtsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
        <p className="text-slate-400 font-medium italic">Retrieving academic doubts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Premium Gradient Top Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Academic Doubts & Support
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1.5">
            Resolve academic questions or submit curriculum queries to our experts.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Academic Doubts</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Submit your curriculum queries to our experts.</p>
          </div>
          <button 
            onClick={() => setShowDoubtForm(!showDoubtForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
          >
            {showDoubtForm ? 'Cancel' : <><Plus size={18} /> Ask a Doubt</>}
          </button>
        </div>

        {showDoubtForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-100 border-t-4 border-indigo-500"
          >
            <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-500 animate-pulse" /> Post Your Doubt
            </h3>
            <form onSubmit={handleDoubtSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject / Topic *</label>
                <input
                  required
                  type="text"
                  value={doubtFormData.subject}
                  onChange={(e) => setDoubtFormData({...doubtFormData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-sm text-slate-700"
                  placeholder="e.g. IELTS Reading Task 2, SAT Math Geometry"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description *</label>
                <textarea
                  required
                  rows="4"
                  value={doubtFormData.description}
                  onChange={(e) => setDoubtFormData({...doubtFormData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none font-medium text-sm text-slate-700"
                  placeholder="Describe your question in detail..."
                ></textarea>
              </div>
              <button
                disabled={isSubmittingDoubt}
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70 text-sm shadow-md"
              >
                {isSubmittingDoubt ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Question'}
              </button>
            </form>
          </motion.div>
        )}

        <div className="space-y-6">
          {doubts.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">No doubts posted yet</h3>
              <p className="text-slate-500 text-xs font-medium">When you ask a question, it will appear here along with the instructor's answer.</p>
            </div>
          ) : (
            doubts.map(doubt => (
              <div key={doubt.id} className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow border border-slate-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{doubt.subject}</h3>
                        <p className="text-[10px] text-slate-400 font-bold">Asked on {new Date(doubt.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      doubt.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {doubt.status === 'OPEN' ? 'Pending Answer' : 'Answered'}
                    </span>
                  </div>
                  
                  <div className="pl-14">
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{doubt.description}</p>
                  </div>
                </div>
                
                {doubt.status === 'ANSWERED' && doubt.answer && (
                  <div className="bg-indigo-50/50 p-6 border-t border-indigo-100">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructor's Reply</h4>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-semibold">{doubt.answer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDoubts;
