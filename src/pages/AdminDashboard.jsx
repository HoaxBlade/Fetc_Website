import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../apiConfig';
import { 
  ShoppingBag, 
  UserPlus, Search, RotateCcw, Download, 
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    todaySales: "₹0.00",
    todayOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/admin/stats'));
      const data = await response.json();
      if (data.success) {
        setLiveStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/users'));
      const data = await response.json();
      if (data.success) {
        // Simple JSON export for now
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

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    // { label: "Today's Sales", value: liveStats.todaySales, growth: liveStats.salesGrowth, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50" },
    // { label: "Today's Orders", value: liveStats.todayOrders, growth: liveStats.ordersGrowth, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Customers", value: isLoading ? "..." : liveStats.totalUsers, growth: liveStats.userGrowth, icon: UserPlus, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium text-sm italic">Welcome back! Here's your premium performance overview.</p>
        </motion.div>
        
        <div className="flex gap-2">
          <button className="p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <Search size={18} />
          </button>
          <button 
            onClick={fetchStats}
            disabled={isLoading}
            className={`p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RotateCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.filter(s => s.label === "Customers").map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="group glass-card p-7 rounded-[2rem] transition-all duration-300 border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] hover:shadow-lg active:scale-[0.99]"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl border border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={20} />
               </div>
               <div className="flex flex-col items-end">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                    stat.growth?.includes('-') 
                      ? "bg-red-50 text-red-500 border-red-100/50" 
                      : (stat.growth === "0%" || !stat.growth) ? "bg-slate-50 text-slate-400 border-slate-100" : "bg-emerald-50 text-emerald-500 border-emerald-100/50"
                  }`}>
                    {stat.growth || "0%"}
                  </span>
               </div>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         {/* Chart Box */}
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card p-8 rounded-[2rem] border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)]"
         >
            <div className="flex items-center justify-between mb-8">
               <div>
                 <h4 className="text-lg font-bold text-slate-800 tracking-tight">Activity Overview</h4>
                 <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">System Reports</p>
               </div>
               <select className="bg-slate-100/50 border border-slate-200/40 rounded-xl text-[10px] font-bold p-2 px-3 text-slate-600 focus:ring-2 focus:ring-brand-600/10 transition-all cursor-pointer">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
               </select>
            </div>
            <div className="flex items-center justify-center h-48 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
               <p className="text-slate-400 text-[11px] font-medium italic">Visualization placeholder...</p>
            </div>
         </motion.div>

         {/* Quick Actions */}
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="glass-card p-8 rounded-3xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] h-full"
         >
            <h4 className="text-lg font-bold text-slate-800 tracking-tight mb-6">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-4 h-fit">
               {[
                 { label: "New Lead", icon: ShoppingBag, color: "bg-blue-500", action: () => navigate('/admin/leads') },
                 { label: "User Audit", icon: Users, color: "bg-purple-500", action: () => navigate('/admin/users') },
                 { label: "Export Data", icon: Download, color: "bg-emerald-500", action: handleExportData }
               ].map((action, i) => (
                  <button 
                    key={i} 
                    onClick={action.action}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100/50 border border-slate-200/40 hover:bg-white hover:shadow-md transition-all group"
                  >
                     <div className={`p-3 ${action.color} text-white rounded-xl mb-3 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        <action.icon size={18} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-700 tracking-tight uppercase tracking-wider">{action.label}</span>
                  </button>
               ))}
            </div>
         </motion.div>
      </div>

      {/* Sales Report Table - Hidden for now */}
      {/* 
      <motion.div 
        ... 
      </motion.div> 
      */}
    </div>
  );
};

export default AdminDashboard;
