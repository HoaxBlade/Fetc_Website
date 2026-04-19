import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search } from 'lucide-react';

const AdminInvoice = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Invoices</h1>
          <p className="text-slate-500 font-medium text-sm italic">Track payments and manage billing records.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden">
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-400 text-sm italic">No billing records found for the current period.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminInvoice;
