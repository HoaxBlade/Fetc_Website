import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, HelpCircle, Settings, LogOut, Menu, X,
  MessageCircle
} from 'lucide-react';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{"name":"User"}');

  const sidebarItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    // { icon: BookOpen, label: "My Courses", path: "/dashboard/courses" },
    // { icon: ShoppingBag, label: "My Orders", path: "/dashboard/orders" },
    // { icon: CreditCard, label: "Payments", path: "/dashboard/payments" },
    { icon: HelpCircle, label: "Support", path: "/dashboard/support" },
    { icon: MessageCircle, label: "Doubts", path: "/dashboard/doubts" },
    // { icon: ClipboardCheck, label: "Mock Test Remaining", path: "/dashboard/mock-tests" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("user-logout"));
    navigate('/my-account');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-fit w-full overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200 shrink-0">
             <User className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">My<span className="text-brand-600"> Account</span></h2>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
          <X size={20} />
        </button>
      </div>

      <nav className="p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300
              ${isActive 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
            `}
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}

        {userData.role === "ADMIN" && (
           <NavLink
            to="/admin/dashboard"
            className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold text-brand-600 hover:bg-brand-50 transition-all duration-300 mt-4 border border-brand-100"
          >
            <Settings size={19} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 flex relative overflow-hidden">
      {/* Background Liquid Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-brand-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Toolbar */}
      <div className="lg:hidden fixed top-32 left-6 right-6 z-[2000] flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[1.5rem] shadow-xl text-slate-600 hover:text-brand-600 transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-72 mt-2 sticky top-24 hidden lg:flex flex-col h-fit max-h-[calc(100vh-140px)] z-20 m-6">
        <div className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden relative group">
           {/* Liquid Blobs */}
           <motion.div 
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 -left-10 w-full h-full bg-brand-100/20 rounded-full blur-[90px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0], y: [0, 40, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 -right-10 w-full h-full bg-blue-100/10 rounded-full blur-[90px] pointer-events-none" 
          />

          <div className="relative z-10 h-full">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[4000] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-32 left-6 right-6 md:left-auto md:right-6 md:w-[320px] h-fit bg-white/80 backdrop-blur-3xl z-[5000] rounded-[2.5rem] shadow-2xl lg:hidden flex flex-col overflow-hidden"
            >
               <motion.div 
                animate={{ scale: [1, 1.1, 1], x: [0, 15, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute top-0 left-0 w-full h-full bg-brand-50/40 rounded-full blur-[60px]" 
              />
              <div className="relative z-10 h-full">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 relative z-10">
        <div className="p-6 md:p-8 pt-44 lg:pt-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
