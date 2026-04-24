import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Users, FileText, Share2, 
  CheckSquare, Zap, Ticket, IndianRupee, ShoppingBag, 
  UserPlus, Search, RotateCcw, Download, X, Menu
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
    { icon: Ticket, label: "Support Tickets", path: "/admin/support-tickets" },
    // { icon: FileText, label: "Invoice", path: "/admin/invoice" },
    { icon: LayoutDashboard, label: "Leads Dashboard", path: "/admin/leads" },
    { icon: Users, label: "Partner List", path: "/admin/partners" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
             <Zap className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Admin<span className="text-brand-600"> Panel</span></h2>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300
              ${isActive 
                ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
            `}
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 flex relative overflow-hidden">
      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-brand-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header Overlay */}
      <div className="lg:hidden fixed top-24 left-6 right-6 z-20 flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[1.5rem] shadow-xl text-slate-600 hover:text-brand-600 transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-72 mt-2 sticky top-24 hidden lg:flex flex-col h-fit z-20 m-6">
        <div className="h-full bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden relative group">
          {/* Liquid Background Blobs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 40, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 -left-10 w-full h-full bg-brand-200/20 rounded-full blur-[80px] pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 -right-10 w-full h-full bg-blue-200/20 rounded-full blur-[80px] pointer-events-none" 
          />
          
          <div className="relative z-10 h-full">
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-6 left-6 w-[280px] bg-white/80 backdrop-blur-3xl z-50 rounded-[2.5rem] shadow-2xl lg:hidden flex flex-col overflow-hidden relative"
            >
               {/* Liquid Background Blobs for Mobile */}
               <motion.div 
                animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 left-0 w-full h-full bg-brand-100/30 rounded-full blur-[60px]" 
              />
              <div className="relative z-10 h-full">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 relative z-10 transition-all duration-500 ${isSidebarOpen ? 'lg:pl-0' : ''}`}>
        <div className="p-6 md:p-8 pt-28 lg:pt-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
