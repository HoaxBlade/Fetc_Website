import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Edit2, Mail, Phone, ShieldCheck
} from 'lucide-react';

const ProfilePage = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{"name":"User","email":"user@example.com","role":"STUDENT","phone":"--"}');

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
        <button className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-white hover:shadow-lg transition-all text-sm shadow-sm group">
          <Edit2 size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Profile Details */}
         <div className="lg:col-span-2 space-y-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 shadow-soft"
           >
             <div className="mb-10">
               <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Profile Details</h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Personal Information</p>
             </div>

             <div className="space-y-8">
               {[
                 { label: "Full Name", value: userData.name },
                 { label: "Bio", value: userData.bio || "No bio set yet.", italic: true },
                 { label: "Phone Number", value: userData.phone }
               ].map((field, i) => (
                 <div key={i} className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                   <p className={`w-full px-7 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-800 font-bold text-sm ${field.italic ? 'italic text-slate-400 font-medium' : ''}`}>
                     {field.value}
                   </p>
                 </div>
               ))}
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
             <p className="text-[10px] font-bold text-slate-400 italic">Member since 2024</p>
           </motion.div>

           {/* Account Info */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 shadow-soft"
           >
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">System Info</p>
             <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                   <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 transition-transform group-hover:rotate-12">
                     <Mail size={18} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Login Email</p>
                     <p className="text-sm font-black text-slate-900 truncate max-w-[120px]">{userData.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-5 group">
                   <div className="p-4 bg-brand-50 rounded-2xl text-brand-600 transition-transform group-hover:-rotate-12">
                     <ShieldCheck size={18} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Account Type</p>
                     <p className="text-xs font-black text-brand-700 tracking-widest bg-brand-50 px-3 py-1 rounded-full">{userData.role}</p>
                   </div>
                </div>
             </div>
           </motion.div>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
