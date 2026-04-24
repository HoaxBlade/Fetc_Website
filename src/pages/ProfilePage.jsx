import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Edit2, Mail, Phone, Save, Loader2, X
} from 'lucide-react';

const ProfilePage = () => {
  const [userData, setUserData] = useState(() => 
    JSON.parse(localStorage.getItem('user') || '{"name":"User","email":"user@example.com","role":"STUDENT","phone":""}')
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    phone: userData.phone || userData.phoneNumber || "",
    bio: userData.bio || ""
  });

  // Fetch fresh profile data on mount to ensure created_at and other fields are up to date
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/profile/${userData.id}`);
        const data = await response.json();
        if (data.success) {
          const updatedUser = { ...userData, ...data.user };
          setUserData(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // Update formData too if not in editing mode
          if (!isEditing) {
            setFormData({
              name: data.user.name,
              phone: data.user.phone || "",
              bio: data.user.bio || ""
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userData.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/profile/${userData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...userData, ...data.user };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        // We don't really need alert here since the UI updates instantly and looks premium
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">My Profile</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage your digital identity and account settings.</p>
        </motion.div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-white hover:shadow-lg transition-all text-sm shadow-sm group"
          >
            <Edit2 size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-white border border-slate-100 px-6 py-3 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-all text-sm"
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-600 transition-all text-sm shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Profile Details */}
         <div className="lg:col-span-2 space-y-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 shadow-soft relative overflow-hidden"
           >
             {isLoading && (
               <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex items-center justify-center">
                 <Loader2 className="animate-spin text-brand-600" size={32} />
               </div>
             )}

             <div className="mb-10">
               <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Profile Details</h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Personal & System Information</p>
             </div>

             <div className="space-y-8">
                {/* Full Name */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} className="text-brand-600" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  </div>
                  {isEditing ? (
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-7 py-5 bg-white border border-brand-100 rounded-[1.5rem] text-slate-800 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 transition-all outline-none"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="w-full px-7 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-800 font-bold text-sm group-hover:bg-white group-hover:border-brand-200 transition-all">
                      {userData.name}
                    </p>
                  )}
                </div>

                {/* Email - Always Read Only */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={12} className="text-brand-600" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Login Email</label>
                  </div>
                  <p className="w-full px-7 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-800 font-bold text-sm">
                    {userData.email}
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={12} className="text-brand-600" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  </div>
                  {isEditing ? (
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-7 py-5 bg-white border border-brand-100 rounded-[1.5rem] text-slate-800 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 transition-all outline-none"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <p className="w-full px-7 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-800 font-bold text-sm group-hover:bg-white group-hover:border-brand-200 transition-all">
                      {userData.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 mb-1">
                    <Edit2 size={12} className="text-brand-600" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio</label>
                  </div>
                  {isEditing ? (
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-7 py-5 bg-white border border-brand-100 rounded-[1.5rem] text-slate-800 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 transition-all h-32 resize-none outline-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className={`w-full px-7 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-800 font-bold text-sm group-hover:bg-white group-hover:border-brand-200 transition-all ${!userData.bio ? 'italic text-slate-400 font-medium' : ''}`}>
                      {userData.bio || "No bio set yet."}
                    </p>
                  )}
                </div>
             </div>
           </motion.div>
         </div>

         {/* Right: Meta Info */}
         <div className="space-y-8">
           {/* Profile Image */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 shadow-soft flex flex-col items-center"
           >
             <div className="w-full flex justify-between items-center mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</p>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200" title="Profile Active" />
             </div>
             <div className="w-36 h-36 rounded-full bg-slate-100 border-4 border-white shadow-2xl flex items-center justify-center group relative overflow-hidden transition-transform hover:scale-105 duration-500">
                <User size={72} className="text-slate-200" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                  <Edit2 size={24} className="text-white" />
                </div>
             </div>
             <p className="mt-8 text-sm font-bold text-slate-900 tracking-tight">{userData.name}</p>
             <p className="text-[10px] font-bold text-slate-400 italic">
               Member since {userData.created_at ? new Date(userData.created_at).getFullYear() : '2024'}
             </p>
           </motion.div>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
