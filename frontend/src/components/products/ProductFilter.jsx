import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { categoryAPI } from "../../api/categories";

const sortOptions = [
  { value: "-createdAt", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "-rating", label: "Highest Rated" },
  { value: "-sold", label: "Best Selling" },
];

const priceRanges = [
  { label: "Under $25",       min: 0,   max: 25   },
  { label: "$25 – $100",      min: 25,  max: 100  },
  { label: "$100 – $500",     min: 100, max: 500  },
  { label: "$500 – $1,000",   min: 500, max: 1000 },
  { label: "Above $1,000",    min: 1000, max: undefined },
];

export default function ProductFilter({ totalProducts }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset page on filter change
    setSearchParams(params);
  };

  const clearAll = () => {
    setSearchParams({});
  };

  const hasFilters = searchParams.has("category") || searchParams.has("minPrice") ||
    searchParams.has("maxPrice") || searchParams.has("sort") || searchParams.has("featured");

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasFilters && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Active Filters</h3>
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchParams.get("category") && (
              <span className="badge-green flex items-center gap-1 px-2.5 py-1 text-xs">
                {categories.find((c) => c._id === searchParams.get("category"))?.name || "Category"}
                <button onClick={() => setParam("category", null)}><FiX size={11} /></button>
              </span>
            )}
            {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
              <span className="badge-green flex items-center gap-1 px-2.5 py-1 text-xs">
                Price range
                <button onClick={() => { setParam("minPrice", null); setParam("maxPrice", null); }}><FiX size={11} /></button>
              </span>
            )}
            {searchParams.get("featured") && (
              <span className="badge-green flex items-center gap-1 px-2.5 py-1 text-xs">
                Featured
                <button onClick={() => setParam("featured", null)}><FiX size={11} /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <FiChevronDown size={14} /> Sort By
        </h3>
        <div className="space-y-1.5">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={searchParams.get("sort") === opt.value || (!searchParams.get("sort") && opt.value === "-createdAt")}
                onChange={() => setParam("sort", opt.value)}
                className="accent-primary-600 w-4 h-4"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Categories</h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio" name="cat" value=""
              checked={!searchParams.get("category")}
              onChange={() => setParam("category", null)}
              className="accent-primary-600 w-4 h-4"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 transition-colors">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center justify-between gap-2.5 cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio" name="cat" value={cat._id}
                  checked={searchParams.get("category") === cat._id}
                  onChange={() => setParam("category", cat._id)}
                  className="accent-primary-600 w-4 h-4"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 transition-colors flex items-center gap-1.5">
                  <span>{cat.icon}</span> {cat.name}
                </span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">{cat.productCount || 0}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Price Range</h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio" name="price" value="all"
              checked={!searchParams.get("minPrice") && !searchParams.get("maxPrice")}
              onChange={() => { setParam("minPrice", null); setParam("maxPrice", null); }}
              className="accent-primary-600 w-4 h-4"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">All Prices</span>
          </label>
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="price" value={range.label}
                checked={
                  searchParams.get("minPrice") === String(range.min) &&
                  searchParams.get("maxPrice") === String(range.max || "")
                }
                onChange={() => {
                  setParam("minPrice", String(range.min));
                  setParam("maxPrice", range.max ? String(range.max) : null);
                }}
                className="accent-primary-600 w-4 h-4"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Special</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get("featured") === "true"}
            onChange={(e) => setParam("featured", e.target.checked ? "true" : null)}
            className="accent-primary-600 w-4 h-4"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">⭐ Featured Products Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <p className="text-sm text-gray-500">{totalProducts} products found</p>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 btn-outline text-sm py-2 px-4"
        >
          <FiFilter size={15} /> Filters {hasFilters && <span className="badge-green px-1.5 py-0.5 text-xs">!</span>}
        </button>
      </div>

      {/* Desktop Filter Panel */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="card p-5 sticky top-20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiFilter size={16} className="text-primary-600" /> Filters
            </h2>
            <span className="text-xs text-gray-400">{totalProducts} products</span>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-950 shadow-xl z-50 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-heading font-bold text-gray-900 dark:text-white">Filters</h2>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-5">
                <FilterContent />
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
