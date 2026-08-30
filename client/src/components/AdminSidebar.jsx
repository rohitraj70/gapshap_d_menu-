import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Tags, UtensilsCrossed, LogOut, Menu, X, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-brown/10 bg-cream px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="h-9 w-9 rounded-xl object-cover shadow-card" />
          <div>
            <p className="font-display text-base font-semibold leading-tight text-brown-dark">Gapshap Cafe</p>
            <p className="text-[11px] text-brown-light">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open admin navigation"
          aria-expanded={drawerOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-brown-dark text-cream shadow-card"
        >
          <Menu size={21} />
        </button>
      </div>

      {drawerOpen && (
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-brown-dark/55 md:hidden"
        />
      )}

    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(84vw,20rem)] shrink-0 -translate-x-full flex-col bg-brown-dark text-cream shadow-soft transition-transform duration-200 md:static md:min-h-screen md:w-64 md:translate-x-0 md:shadow-none ${drawerOpen ? "translate-x-0" : ""}`}>
      <div className="flex items-center gap-2 border-b border-cream/10 p-4 sm:p-5">
        <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="w-10 h-10 rounded-xl object-cover" />
        <div>
          <p className="font-display font-semibold leading-tight">Gapshap Cafe</p>
          <p className="text-xs text-cream/60">Admin Panel</p>
        </div>
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close admin navigation"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-cream/70 hover:bg-cream/10 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-12 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                isActive ? "bg-accent text-white" : "text-cream/80 hover:bg-cream/10"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-t border-cream/10 p-3 md:block">
        {user && <p className="min-w-0 flex-1 truncate px-1 text-xs text-cream/50 md:mb-2 md:px-3">Signed in as {user.username}</p>}
        <button
          onClick={handleLogout}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-cream/80 transition-colors hover:bg-cream/10 md:w-full md:gap-3"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
