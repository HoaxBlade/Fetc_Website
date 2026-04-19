import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Mail, Phone, MoreVertical } from 'lucide-react';

const AdminUsers = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Oversee registrations, roles, and permissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
          <UserPlus size={18} /> Invite New User
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search users..." 
            />
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-4">
                <th className="px-6 pb-4">User</th>
                <th className="px-6 pb-4">Role</th>
                <th className="px-6 pb-4">Status</th>
                <th className="px-6 pb-4">Joined</th>
                <th className="px-6 pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy User Row */}
              <tr className="bg-slate-50/50 rounded-2xl group hover:bg-white transition-all">
                <td className="px-6 py-4 rounded-l-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold">A</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Admin</p>
                      <p className="text-[10px] text-slate-400 italic">fetc2026@gmail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-600">Super Admin</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">Active</span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 font-medium">Apr 19, 2026</td>
                <td className="px-6 py-4 text-right rounded-r-2xl">
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-16 text-center border-t border-slate-50">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-400 text-sm italic">Total 1 user registered in the system.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
