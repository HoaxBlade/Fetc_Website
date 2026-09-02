import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, CheckSquare, Calendar, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

export default function UserMockTests() {
  const { user } = useOutletContext();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserMockTests();
  }, [user]);

  const fetchUserMockTests = async () => {
    setIsLoading(true);
    try {
      const storedUser = (() => {
        try {
          return JSON.parse(localStorage.getItem('user') || '{}');
        } catch (e) {
          return {};
        }
      })();

      const effectiveUser = user || storedUser;
      const email = effectiveUser?.email || storedUser?.email || '';
      const phone = effectiveUser?.phone || storedUser?.phone || '';

      const emailParam = email ? `email=${encodeURIComponent(email)}` : '';
      const phoneParam = phone ? `phone=${encodeURIComponent(phone)}` : '';
      const queryStr = [emailParam, phoneParam].filter(Boolean).join('&');

      const response = await fetch(getApiUrl(`/api/v1/mock-test/user/registrations${queryStr ? '?' + queryStr : ''}`), {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();

      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error fetching user mock test registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Form Submitted').toUpperCase();
    if (s === 'COMPLETED') {
      return (
        <span className="bg-emerald-50 text-emerald-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-200">
          Completed
        </span>
      );
    }
    if (s === 'SCHEDULED') {
      return (
        <span className="bg-blue-50 text-blue-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-blue-200">
          Scheduled
        </span>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <span className="bg-rose-50 text-rose-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-rose-200">
          Cancelled
        </span>
      );
    }
    return (
      <span className="bg-amber-50 text-amber-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-amber-200">
        Form Submitted
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mock Test Remaining</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              View your registered mock exams, admin-scheduled test dates, and completion status.
            </p>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <CheckSquare size={24} />
          </div>
          <h3 className="text-slate-800 font-bold text-base">No Mock Test Registrations Found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            You have not submitted any mock exam registration forms yet. Visit our Mock Test page to register.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {registrations.map((reg) => {
            const formattedReqDate = reg.requested_date
              ? new Date(reg.requested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : null;
            const formattedSubmittedDate = reg.created_at
              ? new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'N/A';

            return (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block mb-1.5">
                      Exam Form
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {reg.test_title}
                    </h3>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>

                {/* Scheduled Exam Date Banner */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className={formattedReqDate ? "text-blue-600" : "text-amber-500"} />
                    <span className="text-xs font-bold text-slate-700">Scheduled Exam Date:</span>
                  </div>
                  {formattedReqDate ? (
                    <div className="text-base font-extrabold text-blue-700 font-mono">
                      {formattedReqDate}
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                      <Clock size={14} /> Admin is scheduling your exam date...
                    </div>
                  )}
                </div>

                {/* Registration Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase mb-0.5">Applicant</span>
                    <span className="font-extrabold text-slate-800 truncate block">{reg.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase mb-0.5">Submitted On</span>
                    <span className="font-extrabold text-slate-800">{formattedSubmittedDate}</span>
                  </div>
                </div>

                {/* Verification Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <ShieldCheck size={14} />
                    <span>Form Received</span>
                  </div>
                  <span className="font-mono text-slate-400">ID #{reg.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
