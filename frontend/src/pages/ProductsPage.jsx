import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { productAPI } from "../api/products";
import ProductCard from "../components/products/ProductCard";
import ProductFilter from "../components/products/ProductFilter";
import { ProductGridSkeleton } from "../components/common/LoadingSkeleton";
import Pagination from "../components/common/Pagination";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const featured = searchParams.get("featured") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (featured) params.featured = featured;

        const { data } = await productAPI.getAll(params);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, search, category, sort, minPrice, maxPrice, featured]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const pageTitle = search
    ? `Search: "${search}" — Agrotech`
    : category
    ? `${category.replace(/-/g, " ")} Products — Agrotech`
    : "All Agricultural Products — Agrotech Nigeria";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Browse and buy premium agricultural tools, fertilizers, pesticides, irrigation systems and farming equipment from Agrotech Nigeria. Nationwide delivery available." />
      </Helmet>

      <div className="min-h-screen">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-heading font-bold mb-2"
            >
              {search ? `Results for "${search}"` : category ? category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "All Products"}
            </motion.h1>
            <p className="text-primary-100 text-sm">
              {loading ? "Searching..." : `${pagination.total} products found`}
            </p>
          </div>
        </div>

        <div className="container py-10">
          <div className="flex gap-8">
            {/* Sidebar Filter */}
            <ProductFilter totalProducts={pagination.total} />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <ProductGridSkeleton count={12} />
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Products Found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <div className="relative max-w-xs w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search again..."
                      className="input pl-9"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          setSearchParams({ search: e.target.value.trim() });
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <motion.div
                    key={`${page}-${search}-${category}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </motion.div>

                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
