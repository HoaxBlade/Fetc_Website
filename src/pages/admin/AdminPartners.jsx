import React from 'react';

const AdminPartners = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Partner List</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage university partnerships and collaboration records.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <p className="text-slate-500 text-sm">No partner records found.</p>
      </div>
    </div>
  );
};

export default AdminPartners;
