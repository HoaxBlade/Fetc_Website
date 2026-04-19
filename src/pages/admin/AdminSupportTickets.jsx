import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Search, Filter } from 'lucide-react';

const AdminSupportTickets = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Support Tickets</h1>
          <p className="text-slate-500 font-medium text-sm italic">Resolve student queries and technical issues.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden">
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">All clear!</h3>
          <p className="text-slate-400 text-sm italic">There are no pending support tickets at the moment.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSupportTickets;
