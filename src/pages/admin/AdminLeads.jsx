import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Search, Mail, Calendar, Loader2, CheckCircle, Clock } from 'lucide-react';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.subject && lead.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Leads Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm italic">Track potential student inquiries and conversions.</p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4">
                <th className="px-6 pb-4">Lead Information</th>
                <th className="px-6 pb-4">Area of Interest</th>
                <th className="px-6 pb-4">Inquiry Message</th>
                <th className="px-6 pb-4">Lead Status</th>
                <th className="px-6 pb-4 text-right">Lead Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="bg-slate-50/50 rounded-2xl group hover:bg-white transition-all">
                  <td className="px-6 py-4 rounded-l-2xl">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-800">{lead.name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail size={10} /> {lead.email}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(lead.created_at)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600">{lead.subject || "General Inquiry"}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic">"{lead.message}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-tighter ${
                      lead.status === 'NEW' 
                        ? "bg-brand-50 text-brand-600" 
                        : lead.status === 'CONTACTED' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-2xl">
                    <div className="flex items-center justify-end gap-2">
                       {lead.status === 'NEW' && (
                         <button 
                           onClick={() => updateStatus(lead.id, 'CONTACTED')}
                           className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                           title="Mark as Contacted"
                         >
                           <Clock size={16} />
                         </button>
                       )}
                       {lead.status !== 'CLOSED' && (
                         <button 
                           onClick={() => updateStatus(lead.id, 'CLOSED')}
                           className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                           title="Mark as Closed / Won"
                         >
                           <CheckCircle size={16} />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <UserCheck size={32} className="text-slate-300 mb-3" />
                      <p className="text-sm font-bold italic text-slate-400">No leads found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLeads;
