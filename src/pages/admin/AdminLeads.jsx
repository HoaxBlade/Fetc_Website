import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Search, Mail, Calendar, Loader2, CheckCircle, Clock, RotateCcw, Trash2, AlertTriangle, Edit, Phone, MapPin, Upload, Download, Plus, X } from 'lucide-react';

const AdminLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewLeadSubmitting, setIsNewLeadSubmitting] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
    subject: "Course Related",
    message: ""
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/leads');
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

  const deleteLead = async (id) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setLeads(leads.filter(l => l.id !== id));
        setDeleteConfirm({ show: false, id: null });
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    // 1. Search term match
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchString) ||
      lead.email.toLowerCase().includes(searchString) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchString)) ||
      (lead.location && lead.location.toLowerCase().includes(searchString)) ||
      (lead.subject && lead.subject.toLowerCase().includes(searchString));
      
    // 2. Date filter match
    if (!matchesSearch) return false;
    if (startDate || endDate) {
      const createdDate = new Date(lead.created_at);
      createdDate.setHours(0, 0, 0, 0);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (createdDate < start) return false;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (createdDate > end) return false;
      }
    }
    
    return true;
  });

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["First Name", "Last Name", "Gender", "Email", "Phone", "Subject", "Location", "Status", "Date"];
    const rows = leads.map(lead => {
      const nameParts = (lead.name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      return [
        firstName,
        lastName,
        lead.gender || "",
        lead.email || "",
        lead.phone || "",
        lead.subject || lead.message || "",
        lead.location || "",
        lead.status || "",
        lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length <= 1) return;
        
        const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
        const importedLeads = [];
        
        for (let i = 1; i < lines.length; i++) {
          const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
          const values = matches.map(v => v.replace(/^["']|["']$/g, "").replace(/""/g, '"').trim());
          
          const leadObj = {};
          headers.forEach((header, idx) => {
            const val = values[idx] || "";
            if (header.includes("first name") || header === "first") leadObj.firstName = val;
            else if (header.includes("last name") || header === "last") leadObj.lastName = val;
            else if (header === "name") leadObj.name = val;
            else if (header === "email") leadObj.email = val;
            else if (header === "phone") leadObj.phone = val;
            else if (header === "gender") leadObj.gender = val;
            else if (header === "location") leadObj.location = val;
            else if (header === "subject" || header === "service") leadObj.subject = val;
            else if (header === "message") leadObj.message = val;
          });
          
          if (!leadObj.name && (leadObj.firstName || leadObj.lastName)) {
            leadObj.name = `${leadObj.firstName || ""} ${leadObj.lastName || ""}`.trim();
          }
          if (!leadObj.name) leadObj.name = "Unnamed CSV Lead";
          if (!leadObj.email) leadObj.email = "no-email@csv-import.com";
          
          importedLeads.push(leadObj);
        }
        
        setIsLoading(true);
        for (const lead of importedLeads) {
          await fetch((window.API_BASE||'') + '/api/leads', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: lead.name,
              email: lead.email,
              phone: lead.phone || "",
              subject: lead.subject || "CSV Imported Lead",
              message: lead.message || "Imported from CSV file.",
              gender: lead.gender || "",
              location: lead.location || ""
            })
          });
        }
        
        await fetchLeads();
      } catch (err) {
        console.error("Failed to parse CSV:", err);
        alert("Failed to parse CSV. Please verify that the file layout is correct.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setIsNewLeadSubmitting(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/leads', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLeadForm.name,
          email: newLeadForm.email,
          phone: newLeadForm.phone,
          gender: newLeadForm.gender,
          location: newLeadForm.location,
          subject: newLeadForm.subject,
          message: newLeadForm.message
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsNewLeadOpen(false);
        setNewLeadForm({
          name: "",
          email: "",
          phone: "",
          gender: "",
          location: "",
          subject: "Course Related",
          message: ""
        });
        await fetchLeads();
      } else {
        alert("Failed to create lead: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to create lead:", err);
      alert("Failed to create lead.");
    } finally {
      setIsNewLeadSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Confirmation Modal via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {deleteConfirm.show && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-10 text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner">
                    <AlertTriangle size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">Delete Lead?</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
                    This action is permanent and cannot be undone. Are you sure you want to remove this record?
                  </p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => deleteLead(deleteConfirm.id)}
                      className="w-full px-8 py-4 bg-rose-500 text-white rounded-2xl font-medium text-sm hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Yes, Delete Lead
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ show: false, id: null })}
                      className="w-full px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-medium text-sm hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all active:scale-95"
                    >
                      Keep Record
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* New Lead Modal via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isNewLeadOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNewLeadOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Create New Lead</h3>
                  <button 
                    onClick={() => setIsNewLeadOpen(false)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateLead} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={newLeadForm.name}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={newLeadForm.email}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newLeadForm.phone}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</label>
                      <select
                        value={newLeadForm.gender}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, gender: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Office Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Vesu, Surat"
                        value={newLeadForm.location}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Area of Interest / Service</label>
                    <select
                      value={newLeadForm.subject}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, subject: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                    >
                      <option value="Course Related">Course Related</option>
                      <option value="Study Abroad">Study Abroad</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enquiry details / Message</label>
                    <textarea
                      rows="3"
                      placeholder="Add any specific details here..."
                      value={newLeadForm.message}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setIsNewLeadOpen(false)}
                      className="px-6 py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isNewLeadSubmitting}
                      className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-md shadow-brand-100"
                    >
                      {isNewLeadSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={16} /> Creating...
                        </>
                      ) : (
                        'Create Lead'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">

      {/* Hidden File Input for CSV Upload */}
      <input 
        type="file" 
        id="csv-file-input" 
        accept=".csv" 
        onChange={handleCSVUpload} 
        className="hidden" 
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">All Leads</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage your leads with upload, search, and export.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download size={14} /> Export Excel
          </button>
          <button
            onClick={() => document.getElementById('csv-file-input').click()}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Upload size={14} /> Upload
          </button>
          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> New Lead
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700" 
              placeholder="Search by First Name, Last Name, Email, Location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="date"
              className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700 cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">to</span>
            <input 
              type="date"
              className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700 cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>

          {(searchTerm || startDate || endDate) && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-3 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl flex items-center gap-1 transition-all"
            >
              <X size={14} /> Reset
            </button>
          )}

          {isLoading && <Loader2 className="animate-spin text-brand-600 ml-auto" size={18} />}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-medium uppercase tracking-widest px-4">
                <th className="px-6 pb-4">Lead Information</th>
                <th className="px-6 pb-4">Area of Interest</th>
                <th className="px-6 pb-4">Lead Status</th>
                <th className="px-6 pb-4 text-right">Lead Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="bg-slate-50/50 rounded-2xl group hover:bg-white transition-all">
                  <td className="px-6 py-4 rounded-l-2xl">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Mail size={10} /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                        {lead.gender && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">
                            {lead.gender}
                          </span>
                        )}
                        {lead.location && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <MapPin size={10} className="text-slate-400" /> {lead.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">{lead.subject || "General Inquiry"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[9px] font-medium rounded-full uppercase tracking-tighter ${
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
                           className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"
                           title="Mark as Contacted"
                         >
                           <Clock size={16} />
                         </button>
                       )}
                       {lead.status !== 'CLOSED' ? (
                         <button 
                           onClick={() => updateStatus(lead.id, 'CLOSED')}
                           className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                           title="Mark as Closed / Won"
                         >
                           <CheckCircle size={16} />
                         </button>
                       ) : (
                         <button 
                           onClick={() => updateStatus(lead.id, 'NEW')}
                           className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                           title="Re-open Lead"
                         >
                           <RotateCcw size={16} />
                         </button>
                       )}
                       <button 
                         onClick={() => navigate(`/admin/leads/edit/${lead.id}`)}
                         className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                         title="Edit Lead"
                       >
                         <Edit size={16} />
                       </button>
                       <button 
                         onClick={() => setDeleteConfirm({ show: true, id: lead.id })}
                         className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                         title="Delete Lead"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
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
    </>
  );
};

export default AdminLeads;


