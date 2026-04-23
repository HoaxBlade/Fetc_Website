import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, ShoppingBag, 
  UserPlus, Search, RotateCcw, Download, 
  BookOpen, Users
} from 'lucide-react';

const AdminDashboard = () => {
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    todaySales: "₹0.00",
    todayOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
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

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    { label: "Today's Sales", value: liveStats.todaySales, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Today's Orders", value: liveStats.todayOrders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Customers", value: isLoading ? "..." : liveStats.totalUsers, icon: UserPlus, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Dashboard Overview</h1>
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
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="group bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/80 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/40"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl shadow-xs transition-transform duration-500 group-hover:rotate-12`}>
                  <stat.icon size={20} />
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">+12%</span>
               </div>
            </div>
            <p className="text-slate-400 text-xs font-bold mb-1 tracking-tight">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         {/* Chart Box */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-soft"
         >
            <div className="flex items-center justify-between mb-8">
               <div>
                 <h4 className="text-lg font-bold text-slate-900 tracking-tight">Activity Overview</h4>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Reports</p>
               </div>
               <select className="bg-slate-50 border-none rounded-lg text-[10px] font-bold p-2 text-slate-500 focus:ring-0">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
               </select>
            </div>
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-100 rounded-3xl">
               <p className="text-slate-400 text-xs font-medium italic">Visualization placeholder...</p>
            </div>
         </motion.div>

         {/* Quick Actions */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-soft box-border h-full"
         >
            <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3 h-fit">
               {[
                 { label: "New Order", icon: ShoppingBag, color: "bg-blue-500" },
                 { label: "Add Course", icon: BookOpen, color: "bg-brand-600" },
                 { label: "User Audit", icon: Users, color: "bg-purple-500" },
                 { label: "Export Data", icon: Download, color: "bg-emerald-500" }
               ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                     <div className={`p-3 ${action.color} text-white rounded-xl mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                        <action.icon size={18} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-700 tracking-tight">{action.label}</span>
                  </button>
               ))}
            </div>
         </motion.div>
      </div>

      {/* Sales Report Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden"
      >
        <div className="p-8 border-b border-white/40 flex flex-wrap items-center justify-between gap-4">
           <div>
             <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Sales Report</h4>
             <p className="text-slate-500 text-xs font-medium italic">Global performance metrics.</p>
           </div>
           <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-brand-700 transition-all shadow-md shadow-brand-100">
             <Download size={16} /> Export Data
           </button>
        </div>

        <div className="p-8">
           <div className="flex gap-4 mb-8">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
                  placeholder="Search transactions..." 
                />
             </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-50">
                   <th className="pb-4">Date</th>
                   <th className="pb-4">Customer</th>
                   <th className="pb-4">Status</th>
                   <th className="pb-4">Price</th>
                   <th className="pb-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 <tr className="text-slate-400">
                   <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                           <ShoppingBag size={24} />
                         </div>
                         <p className="font-bold italic text-xs">No recent transaction data available</p>
                      </div>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
