import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Tags, UtensilsCrossed, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col bg-brown-dark text-cream md:min-h-screen md:w-64">
      <div className="flex items-center gap-2 border-b border-cream/10 p-4 sm:p-5">
        <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="w-10 h-10 rounded-xl object-cover" />
        <div>
          <p className="font-display font-semibold leading-tight">Gapshap Cafe</p>
          <p className="text-xs text-cream/60">Admin Panel</p>
        </div>
      </div>

      <nav className="hide-scrollbar flex flex-1 gap-2 overflow-x-auto p-3 md:block md:space-y-1 md:overflow-visible">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors md:gap-3 ${
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
  );
};

export default AdminSidebar;
