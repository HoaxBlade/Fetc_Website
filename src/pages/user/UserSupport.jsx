import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Plus, MessageCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function UserSupport() {
  const { user } = useOutletContext();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (user?.id) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await fetch((window.API_BASE || "") + `/api/users/${user.id}/tickets`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) setTickets(data.tickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/leads', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          subject: formData.subject,
          message: formData.message,
          userId: user.id
        })
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ subject: '', message: '' });
        setShowForm(false);
        fetchTickets();
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Support Center</h1>
          <p className="text-slate-500 mt-2">Manage your support tickets and inquiries.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> New Ticket</>}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-100 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
              <input
                required
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                placeholder="Briefly describe your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-none"
                placeholder="Provide detailed information about your issue..."
              ></textarea>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Ticket'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No support tickets</h3>
            <p className="text-slate-500">You haven't submitted any support requests yet.</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{ticket.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2">{ticket.message}</p>
                <div className="mt-3 text-xs text-slate-400 font-medium">
                  Submitted on {new Date(ticket.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserSupport;
