import React from 'react';
import { FileText, Plus, Search, Calendar, Edit2, Trash2 } from 'lucide-react';

const AdminInvoice = () => {
  const invoices = [
    { id: 'INV-001', client: 'PP SAVANI CFE', company: 'PP SAVANI CFE', date: '9/3/2025', total: '₹47,200.00' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Invoices</h1>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-all shadow-sm">
          <Plus size={16} /> Create New Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium" 
              placeholder="Search by Invoice No, Client, or Company" 
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium" 
              placeholder="Filter by Date Range" 
            />
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                <th className="px-6 pb-2">Invoice No</th>
                <th className="px-6 pb-2">Client</th>
                <th className="px-6 pb-2">Company</th>
                <th className="px-6 pb-2">Date</th>
                <th className="px-6 pb-2">Total</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="bg-slate-50 rounded-xl">
                  <td className="px-6 py-4 font-semibold text-xs text-slate-700 rounded-l-xl">
                    {inv.id}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {inv.client}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {inv.company}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {inv.date}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-800 font-bold">
                    {inv.total}
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-xl">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 text-center border-t border-slate-50 text-slate-400 text-xs italic">
          List of all saved invoices
        </div>
      </div>
    </div>
  );
};

export default AdminInvoice;
