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
    <aside className="w-full md:w-64 bg-brown-dark text-cream md:min-h-screen flex md:flex-col">
      <div className="p-5 flex items-center gap-2 border-b border-cream/10">
        <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="w-10 h-10 rounded-xl object-cover" />
        <div>
          <p className="font-display font-semibold leading-tight">Gapshap Cafe</p>
          <p className="text-xs text-cream/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-accent text-white" : "text-cream/80 hover:bg-cream/10"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-cream/10">
        {user && <p className="text-xs text-cream/50 px-3 mb-2">Signed in as {user.username}</p>}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cream/80 hover:bg-cream/10 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
