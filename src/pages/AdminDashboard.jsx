import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  UserPlus, Search, RotateCcw, Download, 
  Users, Ticket, HelpCircle, FileText, Zap,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  ExternalLink, Plus, MessageSquare, Send, X, Mail,
  User, MessageCircle, Loader2, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    userGrowth: "0%",
    openTickets: 0,
    pendingDoubts: 0,
    activeNews: 0,
    totalPages: 0
  });
  const [recentData, setRecentData] = useState({
    users: [],
    tickets: [],
    doubts: [],
    leads: []
  });
  const [tab, setTab] = useState('tickets');
  const [isLoading, setIsLoading] = useState(true);

  // Chat Box Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [notification, setNotification] = useState(null);
  const messagesEndRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTicket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTicket]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const baseUrl = window.API_BASE || '';
      
      // Fetch Basic Stats
      const statsRes = await fetch(`${baseUrl}/api/admin/stats`);
      const statsData = await statsRes.json();
      
      // Fetch Users
      const usersRes = await fetch(`${baseUrl}/api/admin/users`);
      const usersData = await usersRes.json();
      
      // Fetch Tickets
      const ticketsRes = await fetch(`${baseUrl}/api/admin/tickets`);
      const ticketsData = await ticketsRes.json();
      
      // Fetch Doubts
      const doubtsRes = await fetch(`${baseUrl}/api/admin/doubts`);
      const doubtsData = await doubtsRes.json();

      // Fetch Pages
      const pagesRes = await fetch(`${baseUrl}/api/admin/pages`);
      const pagesData = await pagesRes.json();

      // Fetch News Flash
      const newsRes = await fetch(`${baseUrl}/api/admin/news-flash`);
      const newsData = await newsRes.json();

      // Fetch Leads
      const leadsRes = await fetch(`${baseUrl}/api/admin/leads`);
      const leadsData = await leadsRes.json();

      if (statsData.success) {
        setStats({
          ...statsData.stats,
          openTickets: ticketsData.tickets?.filter(t => t.status === 'OPEN').length || 0,
          pendingDoubts: doubtsData.doubts?.filter(d => d.status === 'OPEN').length || 0,
          activeNews: newsData.news?.filter(n => n.is_active).length || 0,
          totalPages: pagesData.pages?.length || 0,
          newLeads: leadsData.leads?.filter(l => l.status === 'NEW').length || 0
        });
      }

      setRecentData({
        users: usersData.users?.slice(0, 5) || [],
        tickets: ticketsData.tickets?.slice(0, 5) || [],
        doubts: doubtsData.doubts?.slice(0, 5) || [],
        leads: leadsData.leads?.slice(0, 5) || []
      });

    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTicket = async (ticketId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this support ticket? This action cannot be undone.")) {
      return;
    }

    try {
      const baseUrl = window.API_BASE || '';
      const response = await fetch(`${baseUrl}/api/admin/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setRecentData(prev => ({
          ...prev,
          tickets: prev.tickets.filter(t => t.id !== ticketId)
        }));
        setStats(prev => ({
          ...prev,
          openTickets: Math.max(0, prev.openTickets - 1)
        }));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(null);
        }
      } else {
        alert(data.message || 'Failed to delete ticket');
      }
    } catch (err) {
      console.error('Delete ticket error:', err);
      alert('Error deleting support ticket');
    }
  };

  const fetchChatMessages = async (ticketId, silent = false) => {
    if (!silent) setIsChatLoading(true);
    try {
      const response = await fetch((window.API_BASE || '') + `/api/tickets/${ticketId}/messages`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages(data.messages || []);
        if (data.ticket) {
          setSelectedTicket(data.ticket);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ticket chat:', err);
    } finally {
      if (!silent) setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTicket?.id) return;
    fetchChatMessages(selectedTicket.id, false);

    const interval = setInterval(() => {
      fetchChatMessages(selectedTicket.id, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedTicket?.id]);

  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedTicket]);

  const handleSendReply = async (newStatus = 'RESOLVED') => {
    if (!replyText.trim() || !selectedTicket) {
      setNotification({ type: 'error', text: 'Please enter a reply message before sending.' });
      return;
    }

    setIsSendingReply(true);
    setNotification(null);
    const messageText = replyText.trim();
    setReplyText("");

    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch((window.API_BASE || "") + `/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          sender_type: currentUser.role || 'ADMIN',
          sender_name: currentUser.name || 'Support Staff',
          sender_id: currentUser.id,
          message: messageText,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchChatMessages(selectedTicket.id, true);
        fetchData();
        setNotification({ type: 'success', text: `Message posted to chat thread & emailed to ${selectedTicket.email}!` });
      } else {
        setNotification({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      console.error('Reply send error:', err);
      setNotification({ type: 'error', text: 'Network error while sending reply.' });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/users');
      const data = await response.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.users, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fetc_users_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, growth: stats.userGrowth, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "New Inquiries", value: stats.newLeads, sub: "Student leads", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Support Tickets", value: stats.openTickets, sub: "Open queries", icon: Ticket, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Active News", value: stats.activeNews, sub: "Live updates", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  ];

  // Chart Data
  const ticketStatusData = [
    { name: 'Tickets', value: stats.openTickets, color: '#f59e0b' },
    { name: 'Leads', value: stats.newLeads, color: '#6366f1' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-1">
            <Clock size={12} />
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2.5">
            Admin Overview
            <span className="text-[10px] font-medium bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full border border-brand-100/80">Live</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium text-xs hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RotateCcw size={14} className={isLoading ? "animate-spin" : ""} />
            Sync Data
          </button>
          <button 
            onClick={() => navigate('/admin/pages')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-xs hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} />
            New Page
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <div 
            key={idx}
            className={`group p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between relative overflow-hidden`}
          >
            {/* Standardized spacing for metric cards */}
            <div className="flex items-center gap-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                <stat.icon size={18} className="stroke-[2.2px]" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-0.5">{stat.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-xl font-semibold text-slate-800">{isLoading ? '...' : stat.value}</h3>
                  {stat.sub && <span className="text-[10px] text-slate-400 font-medium">{stat.sub}</span>}
                </div>
              </div>
            </div>
            {stat.growth && (
              <div className={`absolute bottom-3 right-3 flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-lg ${
                stat.growth.includes('-') ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
              }`}>
                <TrendingUp size={9} className={stat.growth.includes('-') ? "rotate-180" : ""} />
                {stat.growth}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Support & Inquiries - Tabs */}
        <div 
          className="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-5">
              <button 
                onClick={() => setTab('tickets')}
                className={`text-base font-medium tracking-tight transition-all ${tab === 'tickets' ? 'text-slate-900 border-b-2 border-brand-600 pb-0.5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Support Tickets
              </button>
              <button 
                onClick={() => setTab('leads')}
                className={`text-base font-medium tracking-tight transition-all ${tab === 'leads' ? 'text-slate-900 border-b-2 border-brand-600 pb-0.5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                New Inquiries
              </button>
            </div>
            <button 
              onClick={() => navigate(tab === 'tickets' ? '/admin/support-tickets' : '/admin/users')}
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
            >
              <ExternalLink size={15} />
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              [1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl" />)
            ) : (tab === 'tickets' ? recentData.tickets : recentData.leads).length > 0 ? (
              (tab === 'tickets' ? recentData.tickets : recentData.leads).map((item, i, arr) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-4 transition-all duration-150 group rounded-xl border ${
                    arr.length === 1 
                      ? 'bg-slate-50/70 border-slate-100 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-brand-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      item.priority === 'HIGH' || item.status === 'NEW' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      <AlertCircle size={16} className="stroke-[2.2px]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-slate-800 line-clamp-1">{item.subject}</h5>
                      <p className="text-[10px] text-slate-400 font-medium">By {item.name} • {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      item.status === 'OPEN' || item.status === 'NEW' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {item.status}
                    </span>
                    {tab === 'tickets' ? (
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setSelectedTicket(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all active:scale-95 shrink-0"
                          title="Open Live Chat Box"
                        >
                          <MessageCircle size={14} />
                          <span>Chat & Solve</span>
                        </button>
                        <button 
                          onClick={(e) => handleDeleteTicket(item.id, e)}
                          className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
                          title="Delete Support Ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate('/admin/leads')}
                        className="opacity-0 group-hover:opacity-100 p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                      >
                        <Plus size={14} className="stroke-[2.2px]" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">No pending items!</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Distribution - Chart */}
        <div 
          className="lg:col-span-1 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col"
        >
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-800 tracking-tight">Activity Analytics</h4>
            <p className="text-slate-400 text-[8px] font-medium uppercase tracking-wider">Load Distribution</p>
          </div>
          
          <div className="flex-grow min-h-[160px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  innerRadius={50}
                  outerRadius={60}
                  paddingAngle={6}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {ticketStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: '500', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-semibold text-slate-800">{stats.openTickets + stats.pendingDoubts + stats.newLeads}</span>
              <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">Tasks</span>
            </div>
          </div>

          {/* Horizontal Legend perfectly aligned with the bottom */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            {ticketStatusData.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Users & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Users List */}
        <div 
          className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-base font-semibold text-slate-900 tracking-tight">Recent Users</h4>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-[10px] font-medium text-brand-600 hover:underline uppercase tracking-wider"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentData.users.map((user, i) => (
              <div key={i} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all text-center">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm font-medium text-slate-400 uppercase">
                  {user.name.charAt(0)}
                </div>
                <h6 className="text-xs font-medium text-slate-800 line-clamp-1">{user.name}</h6>
                <p className="text-[9px] text-slate-400 font-medium mb-2">{user.role}</p>
                <div className="text-[8px] font-medium text-brand-600 bg-brand-50 inline-block px-2 py-0.5 rounded-full border border-brand-100">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div 
          className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
        >
          <h4 className="text-base font-semibold text-slate-900 tracking-tight mb-5">Quick Actions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Invite Staff", icon: UserPlus, color: "bg-blue-500", path: "/admin/users" },
              { label: "Post News", icon: Zap, color: "bg-amber-500", path: "/admin/news-flash" },
              { label: "Support Tickets", icon: HelpCircle, color: "bg-purple-500", path: "/admin/support-tickets" },
              { label: "Web Editor", icon: FileText, color: "bg-emerald-500", path: "/admin/pages" },
              { label: "Student Hub", icon: Users, color: "bg-indigo-500", path: "/admin/users" },
              { label: "Export Logs", icon: Download, color: "bg-slate-700", action: handleExportData }
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={action.action || (() => navigate(action.path))}
                className="group flex flex-col items-center justify-center p-5 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-100/70 transition-all duration-150"
              >
                <div className={`p-3.5 ${action.color} text-white rounded-xl mb-3 group-hover:scale-105 transition-transform duration-150`}>
                  <action.icon size={16} />
                </div>
                <span className="text-[9px] font-medium text-slate-700 uppercase tracking-wider">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
      {/* Live Chat Box Modal for Solving Support Tickets directly from Dashboard */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedTicket && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTicket(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[85vh] z-10"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket #{selectedTicket.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        selectedTicket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                        selectedTicket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{selectedTicket.subject}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => handleDeleteTicket(selectedTicket.id, e)}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                      title="Delete Support Ticket"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Chat Thread */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
                  {/* User Info Bar */}
                  <div className="flex items-center p-3 bg-white rounded-xl border border-slate-200/80 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User size={14} className="text-blue-600" />
                      <span>Student: <strong>{selectedTicket.name || 'Anonymous'}</strong></span>
                    </div>
                  </div>

                  {isChatLoading && chatMessages.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="animate-spin text-brand-600 w-6 h-6" />
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-medium">
                      "{selectedTicket.message}"
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => {
                      const isStudent = msg.sender_type === 'USER';
                      return (
                        <div 
                          key={msg.id || index} 
                          className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'}`}
                        >
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {isStudent ? (msg.sender_name || 'Student') : (msg.sender_name || 'Support / Instructor')}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div 
                            className={`min-w-[70px] max-w-[82%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                              isStudent 
                                ? 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60 text-left' 
                                : 'bg-blue-600 text-white rounded-tr-xs shadow-xs text-right'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input & Reply Footer / Closed Banner */}
                {selectedTicket && (selectedTicket.status?.toUpperCase() === 'RESOLVED' || selectedTicket.status?.toUpperCase() === 'CLOSED') ? (
                  <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center gap-2.5 text-emerald-800 text-xs font-bold shadow-2xs">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>This support ticket is resolved & closed. Conversation ended.</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-3">
                    <textarea 
                      rows="2"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response here to send into the chat box..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-medium text-slate-800"
                    />

                    {notification && (
                      <div className={`p-2 text-xs rounded-xl font-medium flex items-center gap-2 ${
                        notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {notification.type === 'success' ? <CheckCircle2 size={14} /> : <X size={14} />}
                        {notification.text}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 italic">Live response directly from Dashboard</span>
                      <div className="flex gap-2">
                        <button
                          disabled={isSendingReply || !replyText.trim()}
                          onClick={() => handleSendReply('IN_PROGRESS')}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 active:scale-95"
                        >
                          {isSendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                          Post & In Progress
                        </button>
                        <button
                          disabled={isSendingReply || !replyText.trim()}
                          onClick={() => handleSendReply('RESOLVED')}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 flex items-center gap-1.5 active:scale-95"
                        >
                          {isSendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                          Post & Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default AdminDashboard;

