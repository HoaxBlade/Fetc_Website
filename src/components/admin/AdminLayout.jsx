import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Share2,
  Zap, Ticket, Menu, X, BookOpen
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    // { icon: BookOpen, label: "Courses", path: "/admin/courses" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: FileText, label: "Pages", path: "/admin/pages" },
    { icon: Share2, label: "Posts", path: "/admin/posts" },
    // { icon: CheckSquare, label: "Mock Test", path: "/admin/mock-test" },
    { icon: Zap, label: "News Flash", path: "/admin/news-flash" },
    { icon: Ticket, label: "Student Queries", path: "/admin/support-tickets" },
    // { icon: FileText, label: "Invoice", path: "/admin/invoice" },
    { icon: LayoutDashboard, label: "Leads Dashboard", path: "/admin/leads" },
    { icon: Users, label: "Partner List", path: "/admin/partners" },
    // { icon: BookOpen, label: "Interactive Guides", path: "/admin/guides" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-md">
            <Zap className="text-white" size={16} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Admin <span className="text-slate-400 font-medium">Panel</span></h2>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 custom-scrollbar">
        {sidebarItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              group flex items-center gap-4 px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide
              ${isActive 
                ? 'bg-brand-600 text-white shadow-xl shadow-brand-100/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden relative font-['Inter']">
      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[0%] w-[45%] h-[45%] bg-blue-200/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-100/10 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header Overlay */}
      <div className="lg:hidden fixed top-8 left-8 right-8 z-[100] flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-5 glass-card backdrop-blur-3xl border border-white/80 rounded-[2rem] shadow-2xl text-slate-800 hover:text-brand-600 transition-all active:scale-90"
        >
          <Menu size={28} />
        </button>
        <div className="flex items-center gap-3 glass px-6 py-3 rounded-2xl border border-white/60">
           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Zap size={16} />
           </div>
           <span className="text-xs font-black uppercase tracking-widest text-slate-900">Admin</span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-[360px] hidden lg:flex flex-col z-20 pt-20 px-8 pb-8 pr-0">
        <div className="h-fit max-h-[calc(100vh-4rem)] glass-card backdrop-blur-3xl border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden relative group">
          {/* Internal Glows */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          {/* Sidebar Content container */}
          <div className="relative z-10 h-full flex flex-col">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[1000] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-8 left-8 w-[300px] glass backdrop-blur-[40px] z-[1001] rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] lg:hidden flex flex-col overflow-hidden border border-white/50"
            >
              <div className="relative z-10 h-full">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 custom-scrollbar scroll-smooth">
        <div className="p-10 md:p-14 lg:p-20 pb-80 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
