import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { productAPI } from "../../api/products";
import ProductCard from "../products/ProductCard";
import { ProductGridSkeleton } from "../common/LoadingSkeleton";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");

  const tabs = [
    { id: "featured", label: "⭐ Featured" },
    { id: "newest", label: "🆕 New Arrivals" },
    { id: "popular", label: "🔥 Best Sellers" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 8 };
        if (activeTab === "featured") params.featured = "true";
        if (activeTab === "newest") params.sort = "-createdAt";
        if (activeTab === "popular") params.sort = "-sold";

        const { data } = await productAPI.getAll(params);
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block badge-green mb-3 text-sm font-semibold px-4 py-1"
            >
              🛍️ Our Products
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Top Picks for Nigerian Farmers
            </motion.h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-900 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🌱</div>
            <p className="font-medium">No products found. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link to="/products" className="btn-outline px-8 py-3">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
