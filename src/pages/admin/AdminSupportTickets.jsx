import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Search, Loader2, Mail, Clock, CheckCircle, User, X, MessageSquare, Send, ExternalLink } from 'lucide-react';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE || '') + '/api/admin/tickets', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
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
      const response = await fetch((window.API_BASE || "") + `/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
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

  const handleSendReply = async (newStatus = 'RESOLVED') => {
    if (!replyText.trim()) {
      setNotification({ type: 'error', text: 'Please enter a reply message before sending email.' });
      return;
    }

    setIsSendingReply(true);
    setNotification(null);

    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          replyMessage: replyText,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        setTickets(tickets.map(t => t.id === selectedTicket.id ? data.ticket : t));
        setSelectedTicket(data.ticket);
        setReplyText("");
        setNotification({ type: 'success', text: `Email sent to ${selectedTicket.email} successfully!` });
      } else {
        setNotification({ type: 'error', text: data.message || 'Failed to send email.' });
      }
    } catch (err) {
      console.error('Reply send error:', err);
      setNotification({ type: 'error', text: 'Network error while sending email reply.' });
    } finally {
      setIsSendingReply(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setNotification(null);
      setReplyText("");
    }
  }, [selectedTicket?.id]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = (
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.name && ticket.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.email && ticket.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-500 bg-rose-50';
      case 'MEDIUM': return 'text-amber-500 bg-amber-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">
      {/* Ticket Detail & Email Reply Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${
                      selectedTicket.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 
                      selectedTicket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 leading-snug">{selectedTicket.subject}</h2>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-200/50 rounded-full text-slate-400 transition-colors">
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto space-y-6 flex-1">
                {/* Student Query Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare size={14} className="text-brand-600" /> Student's Query
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm font-medium break-words">"{selectedTicket.message}"</p>
                </div>

                {/* User Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <User size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Student Name</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{selectedTicket.name || 'Anonymous'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-tight">Contact Email</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{selectedTicket.email}</p>
                      </div>
                    </div>
                    <a 
                      href={`mailto:${selectedTicket.email}?subject=${encodeURIComponent("Re: " + selectedTicket.subject)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 text-indigo-600 hover:bg-indigo-100/80 rounded-lg transition-colors shrink-0 ml-2"
                      title="Open Mail Client"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {/* Previously Sent Email Reply */}
                {selectedTicket.admin_reply && (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6">
                    <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <CheckCircle size={14} /> Previously Sent Email Response
                    </h4>
                    <p className="text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">{selectedTicket.admin_reply}</p>
                    {selectedTicket.replied_at && (
                      <span className="text-[10px] text-slate-400 mt-3 block font-medium">
                        Sent on {new Date(selectedTicket.replied_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {/* Email Reply Form */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <Mail size={16} className="text-blue-400" /> Send Email Answer
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400">To: {selectedTicket.email}</span>
                  </div>

                  <textarea 
                    rows="4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official answer here... It will be emailed directly to the student's email address."
                    className="w-full p-4 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-medium text-slate-100 placeholder-slate-400"
                  />

                  {/* Notification Feedback */}
                  {notification && (
                    <div className={`mt-3 p-3 text-xs rounded-xl font-medium flex items-center gap-2 ${
                      notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {notification.type === 'success' ? <CheckCircle size={14} /> : <X size={14} />}
                      {notification.text}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400 italic">
                      Direct email notification via FETC Mail Service
                    </span>
                    <div className="flex gap-2">
                      <button 
                        disabled={isSendingReply || !replyText.trim()}
                        onClick={() => handleSendReply('IN_PROGRESS')}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5"
                      >
                        {isSendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                        Send & Keep In Progress
                      </button>

                      <button 
                        disabled={isSendingReply || !replyText.trim()}
                        onClick={() => handleSendReply('RESOLVED')}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 flex items-center gap-1.5"
                      >
                        {isSendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                        Send Email & Resolve
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Actions Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Manual Status Change:</span>
                  </div>
                  <div className="flex gap-3">
                    {selectedTicket.status !== 'IN_PROGRESS' && selectedTicket.status !== 'RESOLVED' && (
                      <button 
                        onClick={() => updateStatus(selectedTicket.id, 'IN_PROGRESS')}
                        className="px-5 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:shadow-md transition-all"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {selectedTicket.status !== 'RESOLVED' && (
                      <button 
                        onClick={() => updateStatus(selectedTicket.id, 'RESOLVED')}
                        className="px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:shadow-md transition-all"
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
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Student Support</h1>
          <p className="text-slate-500 font-medium text-sm italic">Review inquiries and directly reply to students via email.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search by query, name, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 bg-slate-100/70 p-1 rounded-xl">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        {/* Tickets Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <motion.div 
                key={ticket.id}
                layout
                onClick={() => setSelectedTicket(ticket)}
                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all group cursor-pointer relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} Priority
                      </div>
                      {ticket.admin_reply && (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-semibold bg-indigo-50 text-indigo-600 flex items-center gap-1">
                          <Mail size={10} /> Replied
                        </span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${
                      ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-slate-900 mb-2 truncate">{ticket.subject}</h4>
                  <p className="text-xs text-slate-500 mb-6 line-clamp-2 italic leading-relaxed break-words">"{ticket.message}"</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
                      <User size={12} className="text-slate-400" /> {ticket.name || 'Anonymous Student'}
                    </span>
                    <span className="text-[10px] text-slate-400 opacity-80 flex items-center gap-1 mt-0.5">
                      <Mail size={10} /> {ticket.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1"
                      title="Reply via Email"
                    >
                      <Mail size={14} /> Answer
                    </button>
                    {ticket.status === 'OPEN' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(ticket.id, 'IN_PROGRESS');
                        }}
                        className="p-2 text-amber-500 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                        title="Mark In Progress"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    {ticket.status !== 'RESOLVED' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(ticket.id, 'RESOLVED');
                        }}
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
              <h3 className="text-lg font-semibold text-slate-800 mb-1">All clear!</h3>
              <p className="text-slate-400 text-sm italic">There are no matching support tickets.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSupportTickets;
