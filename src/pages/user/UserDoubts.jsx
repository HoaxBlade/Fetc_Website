import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Plus, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function UserDoubts() {
  const { user } = useOutletContext();
  const [doubts, setDoubts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });

  useEffect(() => {
    if (user?.id) fetchDoubts();
  }, [user]);

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
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/doubts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: user.id,
          subject: formData.subject,
          description: formData.description
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ subject: '', description: '' });
        setShowForm(false);
        fetchDoubts();
      }
    } catch (err) {
      console.error('Error submitting doubt:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Doubts</h1>
          <p className="text-slate-500 mt-2">Ask questions and get answers from our expert instructors.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Ask a Doubt</>}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-100 mb-8 border-t-4 border-indigo-500"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">Post Your Doubt</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subject / Topic</label>
              <input
                required
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="e.g. IELTS Reading Task 2, SAT Math Geometry"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
              <textarea
                required
                rows="5"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                placeholder="Describe your question in detail..."
              ></textarea>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Question'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="space-y-6">
        {doubts.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No doubts posted yet</h3>
            <p className="text-slate-500">When you ask a question, it will appear here along with the instructor's answer.</p>
          </div>
        ) : (
          doubts.map(doubt => (
            <div key={doubt.id} className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{doubt.subject}</h3>
                      <p className="text-xs text-slate-400 font-medium">Asked on {new Date(doubt.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    doubt.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {doubt.status === 'OPEN' ? 'Pending Answer' : 'Answered'}
                  </span>
                </div>
                
                <div className="pl-14">
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{doubt.description}</p>
                </div>
              </div>
              
              {doubt.status === 'ANSWERED' && doubt.answer && (
                <div className="bg-indigo-50/50 p-6 border-t border-indigo-100">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2">Instructor's Reply</h4>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{doubt.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDoubts;
