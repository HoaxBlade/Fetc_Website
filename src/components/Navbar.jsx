import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { navMenus } from "../data/siteData";
import logo from "../assets/logo/FETC_FINAL LOGO-01_11 Version_Edit TM_PNG.png";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700 md:text-xl">
          {/* <span>FETC<span className="text-slate-500 text-sm"></span></span> */}
          <img src={logo} alt="FETC Logo" className="h-16 w-auto" />
        </Link>

        <button
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navMenus.map((menu) => (
            <div key={menu.label} className="group relative">
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
            </div>
          ))}
        </nav>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="space-y-2 px-4 py-4">
          {navMenus.map((menu) => {
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
    </header>
  );
}

export default Navbar;
