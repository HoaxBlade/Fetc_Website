import React from 'react';
import { Handshake, Eye, Edit2, Trash2 } from 'lucide-react';

const AdminPartners = () => {
  const partners = [
    {
      id: 1,
      fullName: "Akash Jagannath Navale",
      email: "info@yashodainternational.in",
      phone: "8208091232",
      status: "pending",
      date: "5/31/2025"
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <Handshake size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner List</h1>
            <p className="text-slate-500 font-medium text-xs">Manage university partnerships and collaboration records.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                <th className="px-6 pb-2">Full Name</th>
                <th className="px-6 pb-2">Email</th>
                <th className="px-6 pb-2">Phone</th>
                <th className="px-6 pb-2">Status</th>
                <th className="px-6 pb-2">Date</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="bg-slate-50 rounded-xl">
                  <td className="px-6 py-4 font-semibold text-xs text-slate-700 rounded-l-xl">
                    {partner.fullName}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {partner.email}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                    {partner.phone}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border ${
                      partner.status === 'pending'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {partner.date}
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-xl">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="View details">
                        <Eye size={14} />
                      </button>
                      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
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
          List of all partners
        </div>
      </div>
    </div>
  );
};

export default AdminPartners;

