import React from 'react';
import { CheckSquare, Plus, Eye, Edit2, Trash2 } from 'lucide-react';

const AdminMockTest = () => {
  const mockTests = [
    { title: "SELT (Secure English Language Test)", price: "₹49", status: "Published" },
    { title: "IELTS Academic & General Training", price: "₹49", status: "Published" },
    { title: "TOEFL iBT Practice", price: "₹49", status: "Published" },
    { title: "PTE Academic Exam Prep", price: "₹49", status: "Published" },
    { title: "SAT Prep Simulators", price: "₹49", status: "Published" },
    { title: "GMAT Focus Edition Mock", price: "₹49", status: "Published" },
    { title: "GRE General Test Simulator", price: "₹49", status: "Published" },
    { title: "Pearson Versant Test Simulator", price: "₹499", status: "Published" }
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Mock Tests</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-50 transition-all shadow-sm">
            <Eye size={14} /> View Page
          </button>
          <button className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-800 transition-all shadow-sm">
            <Plus size={14} /> Create Mock Test
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                <th className="px-6 pb-2">Title</th>
                <th className="px-6 pb-2">Price</th>
                <th className="px-6 pb-2">Status</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTests.map((test, index) => (
                <tr key={index} className="bg-slate-50 rounded-xl">
                  <td className="px-6 py-4 font-semibold text-xs text-slate-700 rounded-l-xl">
                    {test.title}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium font-mono">
                    {test.price}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {test.status}
                    </span>
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
          List of all mock tests
        </div>
      </div>
    </div>
  );
};

export default AdminMockTest;
