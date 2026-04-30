import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Mail, MoreVertical, Loader2, X, ChevronRight, Trash2, Edit2, Shield } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Action Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "USER",
    phone: ""
  });

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setActiveMenuId(null);
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error connecting to server');
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      });
      const data = await response.json();
      if (data.success) {
        setIsInviteModalOpen(false);
        setInviteForm({ name: "", email: "", role: "USER", phone: "" });
        fetchUsers();
        alert('Invitation sent successfully!');
      } else {
        alert(data.message || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Invite error:', err);
      alert('Error connecting to server');
    } finally {
      setIsInviting(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Oversee registrations, roles, and permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
        >
          <UserPlus size={18} /> Invite New User
        </button>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsInviteModalOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl p-8 overflow-hidden border border-slate-200/60"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Invite New User</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Send an invitation to join FETC</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <input 
                  required
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-300 transition-all"
                  placeholder="e.g. John Doe"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-300 transition-all"
                  placeholder="name@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">User Role</label>
                  <div className="relative group">
                    <select 
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-600/5 transition-all appearance-none cursor-pointer"
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="COUNSELOR">Counselor</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-600 transition-colors">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-300 transition-all font-mono"
                    placeholder="+91..."
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({...inviteForm, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isInviting}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  {isInviting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Mail size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="glass-card rounded-[2rem] border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4">
                <th className="px-6 pb-4">User Details</th>
                <th className="px-6 pb-4">Access Role</th>
                <th className="px-6 pb-4">Activity Status</th>
                <th className="px-6 pb-4">Contact</th>
                <th className="px-6 pb-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-slate-50/50 rounded-2xl group hover:bg-white transition-all">
                  <td className="px-6 py-4 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-400 italic">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${
                      user.status === 'ACTIVE' 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium font-mono">
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-2xl relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                      className={`p-2 rounded-xl transition-all ${activeMenuId === user.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === user.id && (
                      <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setActiveMenuId(null)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, x: 10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          className="absolute right-full mr-2 top-0 z-[70] w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden"
                        >
                          <button className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                             <Edit2 size={14} className="text-slate-400" /> Edit User Info
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                             <Shield size={14} className="text-slate-400" /> Change User Role
                          </button>
                          <div className="h-px bg-slate-50 my-1" />
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                          >
                             <Trash2 size={14} /> Delete Account
                          </button>
                        </motion.div>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-16 text-center border-t border-slate-50">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-400 text-sm italic">
            Total {users.length} user{users.length !== 1 ? 's' : ''} registered in the system.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
