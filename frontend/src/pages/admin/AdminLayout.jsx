import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag,
  FiMenu, FiX, FiLogOut, FiHome
} from "react-icons/fi";
import { FaWheatAwn } from "react-icons/fa6";
import useAuthStore from "../../store/useAuthStore";
import DarkModeToggle from "../../components/common/DarkModeToggle";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid size={18} />, end: true },
  { to: "/admin/products", label: "Products", icon: <FiPackage size={18} /> },
  { to: "/admin/orders", label: "Orders", icon: <FiShoppingBag size={18} /> },
  { to: "/admin/users", label: "Users", icon: <FiUsers size={18} /> },
  { to: "/admin/categories", label: "Categories", icon: <FiTag size={18} /> },
];

function Sidebar({ onClose }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary-400">
          <FaWheatAwn size={22} /> FarmSphere <span className="badge bg-primary-800 text-primary-200 text-xs ml-1">Admin</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden"><FiX size={20} /></button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary-600 text-white shadow-green"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <FiHome size={16} /> Back to Store
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protect admin route
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          >
            <FiMenu size={22} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <DarkModeToggle />
            <span className="text-sm text-gray-500 hidden sm:block">Admin Panel</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
