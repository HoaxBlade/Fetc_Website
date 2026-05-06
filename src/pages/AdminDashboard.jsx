import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  UserPlus, Search, RotateCcw, Download, 
  Users, Ticket, HelpCircle, FileText, Zap,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  ExternalLink, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    { name: 'Doubts', value: stats.pendingDoubts, color: '#8b5cf6' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Clock size={14} />
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight flex items-center gap-3">
            Admin Overview
            <span className="text-xs font-semibold bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full border border-brand-100/80">Live</span>
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} />
            Sync Data
          </button>
          <button 
            onClick={() => navigate('/admin/pages')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Plus size={18} />
            New Page
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group p-5 bg-white border ${stat.border} rounded-[1.25rem] shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 cursor-pointer flex items-center justify-between relative overflow-hidden`}
          >
            <div className="flex items-center gap-5">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-105 transition-transform duration-500 shrink-0`}>
                <stat.icon size={20} className="stroke-[2.2px]" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-2xl font-extrabold text-slate-900">{isLoading ? '...' : stat.value}</h3>
                  {stat.sub && <span className="text-[10px] text-slate-400 font-medium">{stat.sub}</span>}
                </div>
              </div>
            </div>
            {stat.growth && (
              <div className={`absolute bottom-3.5 right-3.5 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg ${
                stat.growth.includes('-') ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
              }`}>
                <TrendingUp size={10} className={stat.growth.includes('-') ? "rotate-180" : ""} />
                {stat.growth}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Support & Inquiries - Tabs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 p-6 bg-white border border-slate-100/50 rounded-[1.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.015)] overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-6">
              <button 
                onClick={() => setTab('tickets')}
                className={`text-lg font-black tracking-tight transition-all ${tab === 'tickets' ? 'text-slate-900 border-b-2 border-brand-600 pb-1' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Support Tickets
              </button>
              <button 
                onClick={() => setTab('leads')}
                className={`text-lg font-black tracking-tight transition-all ${tab === 'leads' ? 'text-slate-900 border-b-2 border-brand-600 pb-1' : 'text-slate-400 hover:text-slate-600'}`}
              >
                New Inquiries
              </button>
            </div>
            <button 
              onClick={() => navigate(tab === 'tickets' ? '/admin/support-tickets' : '/admin/users')}
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
            >
              <ExternalLink size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)
            ) : (tab === 'tickets' ? recentData.tickets : recentData.leads).length > 0 ? (
              (tab === 'tickets' ? recentData.tickets : recentData.leads).map((item, i, arr) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-4 transition-all duration-300 group rounded-2xl border ${
                    arr.length === 1 
                      ? 'bg-slate-50/70 border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)]' 
                      : 'bg-white border-slate-100 hover:border-brand-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      item.priority === 'HIGH' || item.status === 'NEW' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      <AlertCircle size={18} className="stroke-[2.2px]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 line-clamp-1">{item.subject}</h5>
                      <p className="text-[10px] text-slate-400 font-medium">By {item.name} • {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      item.status === 'OPEN' || item.status === 'NEW' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {item.status}
                    </span>
                    <button 
                      onClick={() => navigate(tab === 'tickets' ? '/admin/support-tickets' : '/admin/users')}
                      className="opacity-0 group-hover:opacity-100 p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                    >
                      <Plus size={16} className="stroke-[2.2px]" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No pending items!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity Distribution - Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 p-6 bg-white border border-slate-100/50 rounded-[1.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.015)] flex flex-col"
        >
          <div className="mb-4">
            <h4 className="text-base font-bold text-slate-800 tracking-tight">Activity Analytics</h4>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Load Distribution</p>
          </div>
          
          <div className="flex-grow min-h-[180px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  innerRadius={58}
                  outerRadius={68}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {ticketStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', fontWeight: 'bold', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-800">{stats.openTickets + stats.pendingDoubts + stats.newLeads}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Tasks</span>
            </div>
          </div>

          {/* Horizontal Legend perfectly aligned with the bottom */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100/60">
            {ticketStatusData.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{item.name}</span>
                </div>
                <span className="text-xs font-extrabold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom Grid: Recent Users & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Users List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white border border-slate-100/50 rounded-[1.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.015)]"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Recent Users</h4>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-xs font-black text-brand-600 hover:underline uppercase tracking-widest"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentData.users.map((user, i) => (
              <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-brand-200 transition-all text-center">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm font-black text-slate-400 uppercase">
                  {user.name.charAt(0)}
                </div>
                <h6 className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</h6>
                <p className="text-[10px] text-slate-400 font-medium mb-2">{user.role}</p>
                <div className="text-[9px] font-black text-brand-600 bg-brand-50 inline-block px-2 py-0.5 rounded-full border border-brand-100">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white border border-slate-100/50 rounded-[1.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.015)]"
        >
          <h4 className="text-lg font-black text-slate-900 tracking-tight mb-8">Quick Actions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Invite Staff", icon: UserPlus, color: "bg-blue-500", path: "/admin/users" },
              { label: "Post News", icon: Zap, color: "bg-amber-500", path: "/admin/news-flash" },
              { label: "Doubts Hub", icon: HelpCircle, color: "bg-purple-500", path: "/admin/doubts" },
              { label: "Web Editor", icon: FileText, color: "bg-emerald-500", path: "/admin/pages" },
              { label: "Student Hub", icon: Users, color: "bg-indigo-500", path: "/admin/users" },
              { label: "Export Logs", icon: Download, color: "bg-slate-700", action: handleExportData }
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={action.action || (() => navigate(action.path))}
                className="group flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className={`p-4 ${action.color} text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;
