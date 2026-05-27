import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Share2,
  Zap, Ticket, Menu, X, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, ClipboardList
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isCollapsed = false;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => 
    JSON.parse(localStorage.getItem('user') || '{"name":"Admin","role":"ADMIN"}')
  );

  useEffect(() => {
    const handleUserUpdate = () => {
      setUserData(JSON.parse(localStorage.getItem('user') || '{"name":"Admin","role":"ADMIN"}'));
    };
    window.addEventListener("user-login", handleUserUpdate);
    window.addEventListener("user-logout", handleUserUpdate);
    return () => {
      window.removeEventListener("user-login", handleUserUpdate);
      window.removeEventListener("user-logout", handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("user-logout"));
    navigate('/my-account');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: ClipboardList, label: "Leads Dashboard", path: "/admin/leads" },
    // { icon: BookOpen, label: "Courses", path: "/admin/courses" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: FileText, label: "Pages", path: "/admin/pages" },
    { icon: Share2, label: "Posts", path: "/admin/posts" },
    // { icon: CheckSquare, label: "Mock Test", path: "/admin/mock-test" },
    { icon: Zap, label: "News Flash", path: "/admin/news-flash" },
    { icon: Ticket, label: "Student Support", path: "/admin/support-tickets" },
    // { icon: FileText, label: "Invoice", path: "/admin/invoice" },
    { icon: HelpCircle, label: "Doubts Portal", path: "/admin/doubts" },

    // { icon: BookOpen, label: "Interactive Guides", path: "/admin/guides" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Brand Header */}
      <div className={`h-[68px] flex items-center justify-between border-b border-slate-100 ${isCollapsed ? 'justify-center px-4' : 'px-6'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="text-white" size={15} />
          </div>
          {!isCollapsed && (
            <div className="leading-none">
              <h2 className="text-base font-semibold text-slate-800 tracking-tight">FETC</h2>
              <span className="text-[9px] font-medium text-slate-400 tracking-[0.12em] uppercase leading-none mt-0.5 block">Admin Portal</span>
            </div>
          )}
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <X size={18} />
        </button>
      </div>

      {/* Menu Navigation */}
      <div className={`flex-1 overflow-y-auto py-4 space-y-1.5 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {sidebarItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              group relative flex items-center rounded-xl transition-all duration-150 font-medium text-sm tracking-wide
              ${isCollapsed 
                ? 'justify-center w-11 h-11 mx-auto' 
                : 'gap-3 px-3 py-2.5 mx-0 w-full'}
              ${isActive 
                ? 'bg-brand-50/70 text-brand-600' 
                : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'}
            `}
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={18} 
                  className={`shrink-0 stroke-[2.2px] transition-transform duration-150 group-hover:scale-105 ${
                    isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-700"
                  }`} 
                />
                {!isCollapsed && <span>{item.label}</span>}
                {isActive && (
                  <div className={`absolute bg-brand-600 rounded-full ${
                    isCollapsed 
                      ? 'right-1.5 top-3.5 bottom-3.5 w-1' 
                      : 'right-0 top-1.5 bottom-1.5 w-1'
                  }`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Profile & Logout at bottom */}
      <div className={`border-t border-slate-100 bg-white transition-all duration-300 ${
        isCollapsed 
          ? 'p-3 flex flex-col items-center gap-4' 
          : 'p-6 space-y-4'
      }`}>
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-slate-100 border border-slate-200">
            {userData?.profile_image ? (
              <img src={userData.profile_image} alt={userData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-medium text-sm">
                {userData?.name ? userData.name[0].toUpperCase() : 'A'}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h4 className="text-sm font-medium text-slate-800 truncate leading-snug">{userData?.name || "Admin User"}</h4>
              <span className="text-[10px] font-medium text-slate-400 capitalize tracking-wider">{userData?.role?.toLowerCase() || "admin"} user</span>
            </div>
          )}
        </div>
        
        {isCollapsed ? (
          <button 
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            title="Logout"
          >
            <LogOut size={16} className="stroke-[2.2]" />
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <LogOut size={14} className="stroke-[2.2]" />
            LOGOUT
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-clip">
      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[0%] w-[45%] h-[45%] bg-blue-200/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-100/10 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header Overlay - Adjusted for main Navbar presence */}
      <div className="lg:hidden fixed top-24 left-6 right-6 z-[4000] flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-white border border-slate-200 rounded-md shadow-md text-slate-800 hover:text-brand-600 transition-all active:scale-95"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-md border border-slate-200 shadow-sm">
           <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white">
              <Zap size={12} />
           </div>
           <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">Admin</span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col h-[calc(100vh-80px)] sticky top-20 z-40 bg-white border-r border-slate-200 shrink-0 transition-all duration-300 ${isCollapsed ? 'w-[76px]' : 'w-[260px]'}`}>
        <div className="h-full flex flex-col relative">
          <SidebarContent />
          

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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[5000] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white lg:hidden flex flex-col overflow-hidden border-r border-slate-200 z-[5001] shadow-2xl"
            >
              <div className="relative z-10 h-full">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full">
        <div className="pt-28 pb-16 px-4 md:px-6 lg:pt-5 lg:pb-16 lg:px-8 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
