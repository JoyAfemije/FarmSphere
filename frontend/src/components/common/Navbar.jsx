import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown,
  FiLogOut, FiPackage, FiSettings
} from "react-icons/fi";
import { FaWheatAwn } from "react-icons/fa6";
import useCartStore from "../../store/useCartStore";
import useAuthStore from "../../store/useAuthStore";
import useThemeStore from "../../store/useThemeStore";
import DarkModeToggle from "./DarkModeToggle";
import { categoryAPI } from "../../api/categories";

const categories = [
  { name: "Tools & Equipment", slug: "tools-equipment", icon: "🔧" },
  { name: "Chemicals", slug: "chemicals", icon: "🧪" },
  { name: "Fertilizers", slug: "fertilizers", icon: "🌱" },
  { name: "Pesticides", slug: "pesticides", icon: "🛡️" },
  { name: "Irrigation", slug: "irrigation", icon: "💧" },
  { name: "Seeds", slug: "seeds", icon: "🌾" },
  { name: "Farm Accessories", slug: "farm-accessories", icon: "🏡" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const { user, logout } = useAuthStore();
  const catRef = useRef(null);
  const userRef = useRef(null);

  // Shadow navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    setUserOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white dark:bg-gray-950 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "border-b border-gray-100 dark:border-gray-800"
        }`}
      >
        <nav className="container flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary-600">
            <FaWheatAwn className="text-2xl" />
            <span>Farm<span className="text-gray-800 dark:text-white">Sphere</span></span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Categories <FiChevronDown className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/products?category=${cat.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <span className="text-base">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <Link
                        to="/products"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
              Shop
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
              Contact
            </Link>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Dark Mode */}
            <DarkModeToggle />

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div ref={userRef} className="relative hidden lg:block">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <FiChevronDown size={14} className={`transition-transform ${userOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <FiPackage size={15} /> My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 font-semibold hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
                          <FiSettings size={15} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <FiLogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>

        {/* ── Search Bar (expandable) ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="container py-3 flex gap-2">
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tools, chemicals, fertilizers..."
                  className="input flex-1"
                />
                <button type="submit" className="btn-primary">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950"
            >
              <div className="container py-4 space-y-1">
                <Link to="/" className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors">Home</Link>
                <Link to="/products" className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors">Shop All Products</Link>

                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-900 hover:text-primary-600 rounded-xl transition-colors">
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/contact" className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors">Contact</Link>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                  {user ? (
                    <>
                      <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/account/orders" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors">My Orders</Link>
                      {user.role === "admin" && (
                        <Link to="/admin" className="block px-4 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-900 rounded-xl transition-colors">Admin Panel</Link>
                      )}
                      <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-900 rounded-xl transition-colors">Logout</button>
                    </>
                  ) : (
                    <div className="flex gap-2 px-4">
                      <Link to="/login" className="btn-outline flex-1 text-center">Login</Link>
                      <Link to="/register" className="btn-primary flex-1 text-center">Sign Up</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
