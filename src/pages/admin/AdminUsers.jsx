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
      const response = await fetch((window.API_BASE || "") + `/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
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
      const response = await fetch((window.API_BASE || "") + '/api/admin/users/invite', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
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

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [roleEditingUser, setRoleEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateUser = async (id, payload, closeModal) => {
    setIsUpdating(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(u => u.id === id ? data.user : u));
        closeModal();
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error connecting to server');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/users', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
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
      className="max-w-[1600px] mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Oversee registrations, roles, and permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
        >
          <UserPlus size={18} /> Invite New User
        </button>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsInviteModalOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl p-8 overflow-hidden border border-slate-200/60"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Invite New User</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Send an invitation to join FETC</p>
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
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <input 
                  required
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all"
                  placeholder="e.g. John Doe"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all"
                  placeholder="name@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">User Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['USER', 'ADMIN', 'COUNSELOR'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setInviteForm({...inviteForm, role})}
                        className={`py-2.5 rounded-xl text-[10px] font-medium tracking-widest transition-all border ${
                          inviteForm.role === role 
                            ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-brand-200 hover:text-slate-600'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all font-mono"
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
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium text-sm hover:bg-brand-600 transition-all shadow-xl flex items-center justify-center gap-2 group"
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
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl p-8 overflow-hidden border border-slate-200/60"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Edit User Info</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Update personal details</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(editingUser.id, editingUser, () => setEditingUser(null)); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input required type="email" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                <input className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all font-mono" value={editingUser.phone || ''} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} />
              </div>
              <div className="pt-4">
                <button disabled={isUpdating} type="submit" className="w-full bg-brand-600 text-white py-4 rounded-2xl font-medium text-sm hover:bg-brand-700 transition-all shadow-xl flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Change Role Modal */}
      {roleEditingUser && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setRoleEditingUser(null)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-sm bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl p-8 overflow-hidden border border-slate-200/60"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Change Role</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Update access permissions</p>
              </div>
              <button onClick={() => setRoleEditingUser(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(roleEditingUser.id, { role: roleEditingUser.role }, () => setRoleEditingUser(null)); }} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Select Access Permission</label>
                <div className="flex flex-col gap-2">
                  {['USER', 'ADMIN', 'COUNSELOR'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setRoleEditingUser({...roleEditingUser, role})}
                      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border-2 ${
                        roleEditingUser.role === role 
                          ? 'bg-brand-50 border-brand-600 text-brand-900 ring-4 ring-brand-600/5' 
                          : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium tracking-widest">{role}</span>
                        <span className="text-[9px] font-medium opacity-60">
                          {role === 'ADMIN' ? 'Full system access' : role === 'COUNSELOR' ? 'Student management' : 'Standard user portal'}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        roleEditingUser.role === role ? 'border-brand-600 bg-brand-600' : 'border-slate-100'
                      }`}>
                        {roleEditingUser.role === role && <motion.div layoutId="check" className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <button disabled={isUpdating} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium text-sm hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Role'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-visible">
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
              <tr className="text-slate-400 text-[10px] font-medium uppercase tracking-widest px-4">
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
                      <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-400 italic">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-medium rounded-full uppercase tracking-tighter ${
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
                  <td className="px-6 py-4 text-right rounded-r-2xl">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingUser(user)}
                        title="Edit User Info"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                         <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setRoleEditingUser(user)}
                        title="Change User Role"
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                         <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete Account"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
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


