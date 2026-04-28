import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Search, Loader2, Mail, Clock, CheckCircle, User, X, MessageSquare } from 'lucide-react';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/tickets');
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const isMatched = (
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.name && ticket.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.email && ticket.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Only show Study Abroad or Course Related enquiries
    const isRelevant = 
      ticket.subject.toLowerCase().includes("study abroad") || 
      ticket.subject.toLowerCase().includes("course related");

    return isMatched && isRelevant;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-500 bg-rose-50';
      case 'MEDIUM': return 'text-amber-500 bg-amber-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex flex-col gap-2">
                     <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority} Priority
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedTicket.subject}</h2>
                   </div>
                   <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                     <X size={24} />
                   </button>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 mb-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare size={12} /> Student's Query
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-medium break-words">"{selectedTicket.message}"</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Student Name</p>
                        <p className="text-sm font-bold text-slate-900">{selectedTicket.name || 'Anonymous'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Contact Email</p>
                        <p className="text-sm font-bold text-slate-900">{selectedTicket.email}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                        selectedTicket.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 
                        selectedTicket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {selectedTicket.status}
                      </span>
                   </div>
                   <div className="flex gap-3">
                      {selectedTicket.status !== 'IN_PROGRESS' && selectedTicket.status !== 'RESOLVED' && (
                        <button 
                          onClick={() => updateStatus(selectedTicket.id, 'IN_PROGRESS')}
                          className="px-6 py-3 bg-amber-500 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {selectedTicket.status !== 'RESOLVED' && (
                        <button 
                          onClick={() => updateStatus(selectedTicket.id, 'RESOLVED')}
                          className="px-6 py-3 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                          Resolve Ticket
                        </button>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Student Queries</h1>
          <p className="text-slate-500 font-medium text-sm italic">Resolve student queries and technical issues.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search queries..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <motion.div 
                key={ticket.id}
                layout
                onClick={() => setSelectedTicket(ticket)}
                className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                    ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-2 truncate">{ticket.subject}</h4>
                <p className="text-xs text-slate-500 mb-6 line-clamp-2 italic leading-relaxed break-words">"{ticket.message}"</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <User size={10} /> {ticket.name || 'Anonymous Student'}
                    </span>
                    <span className="text-[10px] text-slate-400 opacity-60">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {ticket.status === 'OPEN' && (
                      <button 
                        onClick={() => updateStatus(ticket.id, 'IN_PROGRESS')}
                        className="p-2 text-amber-500 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                        title="Mark In Progress"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    {ticket.status !== 'RESOLVED' && (
                      <button 
                        onClick={() => updateStatus(ticket.id, 'RESOLVED')}
                        className="p-2 text-emerald-500 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                        title="Mark Resolved"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!isLoading && filteredTickets.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">All clear!</h3>
              <p className="text-slate-400 text-sm italic">There are no matching queries.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSupportTickets;
