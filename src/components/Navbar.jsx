import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, User, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { navMenus } from "../data/siteData";
import logo from "../assets/logo/FETC_FINAL LOGO-01_11 Version_Edit TM_PNG.png";

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const checkUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      // Force update if old name is detected (cached in user's browser)
      if (parsedUser.name === "Bhumika" || parsedUser.name === "AdminFetc1") {
        parsedUser.name = "Admin";
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }
      setCurrentUser(parsedUser);
    } else {
      setCurrentUser(null);
    }
  };

  const location = useLocation();

  useEffect(() => {
    checkUser();
    
    // Listen for custom login/logout events to sync components
    window.addEventListener("user-login", checkUser);
    window.addEventListener("user-logout", checkUser);
    
    return () => {
      window.removeEventListener("user-login", checkUser);
      window.removeEventListener("user-logout", checkUser);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Notify other components
    window.dispatchEvent(new Event("user-logout"));
    setCurrentUser(null);
    navigate("/my-account");
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-[2000] border-b border-slate-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700 md:text-xl">
          {/* <span>FETC<span className="text-slate-500 text-sm"></span></span> */}
          <img src={logo} alt="FETC Logo" className="h-16 w-auto" />
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <nav className="hidden items-center gap-2 md:flex">
            {navMenus.map((menu) => (
              menu.path === "/my-account" ? null : (
              <div key={menu.label} className="group relative">
                {menu.items ? (
                  <>
                    <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                      {menu.label} <ChevronDown size={16} />
                    </button>
                    <div className="pointer-events-none absolute left-0 top-full w-64 pt-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="translate-y-2 rounded-xl border border-slate-200 bg-white p-2 shadow-soft transition-transform duration-200 group-hover:translate-y-0">
                        {menu.items.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-sm transition ${
                                isActive
                                  ? "bg-brand-50 text-brand-700"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={menu.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                      }`
                    }
                  >
                    {menu.label}
                  </NavLink>
                )}
              </div>
            )))}
          </nav>

          <div className="hidden md:block border-l border-slate-200 pl-4 ml-1">
            <div className="group relative flex items-center h-full">
              <NavLink 
                to="/my-account"
                className={({ isActive }) => 
                  `flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:bg-brand-50 hover:text-brand-700 hover:scale-110 ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 bg-slate-50"
                  }`
                }
                title="My Account"
              >
                <User size={22} className="stroke-[2.5px]" />
              </NavLink>
              <div className="pointer-events-none absolute right-0 top-full pt-2 w-56 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col p-1.5">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      </div>
                      {currentUser.role === "ADMIN" && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition">
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition">
                        <Settings size={16} /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition mt-1 border-t border-slate-50 pt-3"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/my-account" state={{ tab: 'login' }} className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition rounded-xl">
                        Login
                      </Link>
                      <Link to="/my-account" state={{ tab: 'signup' }} className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition border-t border-slate-100 rounded-xl">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            className="rounded-lg p-2 text-slate-700 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="space-y-2 px-4 py-4">
          {navMenus.map((menu) => {
            if (!menu.items) {
              return (
                <div key={menu.label} className="rounded-lg border border-transparent">
                  {menu.path === "/my-account" ? (
                    <div className="space-y-1">
                      <NavLink
                        to={menu.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium transition-colors ${
                            isActive
                              ? "bg-brand-50 text-brand-700"
                              : "text-slate-700 bg-slate-50 hover:bg-slate-100"
                          }`
                        }
                      >
                        <User size={20} className="stroke-[2.5px]" />
                        {menu.label}
                      </NavLink>
                      <div className="pl-10 space-y-1">
                        {currentUser ? (
                          <>
                            {currentUser.role === "ADMIN" && (
                              <Link 
                                to="/admin/dashboard" 
                                onClick={() => setMobileOpen(false)} 
                                className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <LayoutDashboard size={14} /> Admin Dashboard
                              </Link>
                            )}
                            <Link 
                              to="/dashboard/profile" 
                              onClick={() => setMobileOpen(false)} 
                              className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Settings size={14} /> My Profile
                            </Link>
                            <button 
                              onClick={() => { handleLogout(); setMobileOpen(false); }} 
                              className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut size={14} /> Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link 
                              to="/my-account" 
                              state={{ tab: 'login' }}
                              onClick={() => setMobileOpen(false)} 
                              className="block w-full rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              Login
                            </Link>
                            <Link 
                              to="/my-account" 
                              state={{ tab: 'signup' }}
                              onClick={() => setMobileOpen(false)} 
                              className="block w-full rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              Sign Up
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      to={menu.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block w-full rounded-lg px-3 py-2 text-left font-medium transition-colors ${
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-slate-700 bg-slate-50 hover:bg-slate-100"
                        }`
                      }
                    >
                      {menu.label}
                    </NavLink>
                  )}
                </div>
              );
            }

            const isOpen = activeMobileMenu === menu.label;
            return (
              <div key={menu.label} className="rounded-lg border border-slate-200">
                <button
                  className="flex w-full items-center justify-between px-3 py-2 text-left font-medium text-slate-700"
                  onClick={() =>
                    setActiveMobileMenu((prev) =>
                      prev === menu.label ? null : menu.label
                    )
                  }
                >
                  {menu.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-64" : "max-h-0"
                  }`}
                >
                  <div className="space-y-1 px-2 pb-2">
                    {menu.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2 text-sm ${
                            isActive
                              ? "bg-brand-50 text-brand-700"
                              : "text-slate-700 hover:bg-slate-100"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
