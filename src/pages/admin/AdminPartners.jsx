import React, { useState, useEffect } from 'react';
import { Handshake, Eye, Edit2, Trash2, Building2, Globe, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';

const AdminPartners = () => {
  const [partners, setPartners] = useState([
    {
      id: 1,
      full_name: "Akash Jagannath Navale",
      email: "info@yashodainternational.in",
      phone: "8208091232",
      organization_name: "Yashoda International",
      status: "pending",
      created_at: "2025-05-31T10:00:00.000Z"
    }
  ]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const fetchPartners = async () => {
    try {
      const response = await fetch((window.API_BASE || '') + '/api/partners', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success && data.partners.length > 0) {
        setPartners(data.partners);
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <Handshake size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Applications</h1>
            <p className="text-slate-500 font-medium text-xs">Manage incoming collaboration and partnership requests.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                <th className="px-6 pb-2">Full Name</th>
                <th className="px-6 pb-2">Organization</th>
                <th className="px-6 pb-2">Email</th>
                <th className="px-6 pb-2">Phone</th>
                <th className="px-6 pb-2">Status</th>
                <th className="px-6 pb-2">Date</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-xs text-slate-800 rounded-l-xl">
                    {partner.full_name || partner.fullName}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {partner.organization_name || partner.organizationName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                    {partner.email}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                    {partner.phone}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border ${
                      partner.status === 'pending'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {partner.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {partner.created_at ? new Date(partner.created_at).toLocaleDateString() : partner.date || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-xl">
                    <button 
                      onClick={() => setSelectedPartner(partner)}
                      className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-all font-semibold text-xs flex items-center gap-1 ml-auto" 
                      title="View full application details"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 text-center border-t border-slate-50 text-slate-400 text-xs italic">
          Showing {partners.length} total partner applications
        </div>
      </div>

      {/* View Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedPartner.full_name || selectedPartner.fullName}</h3>
                <p className="text-xs text-slate-400">{selectedPartner.organization_name || 'Individual Partnership'}</p>
              </div>
              <button 
                onClick={() => setSelectedPartner(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Email</span>
                  <p className="font-semibold text-slate-800">{selectedPartner.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Phone</span>
                  <p className="font-semibold text-slate-800 font-mono">{selectedPartner.phone}</p>
                </div>
                {selectedPartner.organization_website && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Website</span>
                    <a href={selectedPartner.organization_website} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-medium">
                      {selectedPartner.organization_website}
                    </a>
                  </div>
                )}
              </div>

              {selectedPartner.organization_description && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Organization Description</span>
                  <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 leading-relaxed">{selectedPartner.organization_description}</p>
                </div>
              )}

              {selectedPartner.why_partner && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Why Partner With FETC</span>
                  <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 leading-relaxed">{selectedPartner.why_partner}</p>
                </div>
              )}

              {selectedPartner.additional_comments && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Additional Comments</span>
                  <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 leading-relaxed">{selectedPartner.additional_comments}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
