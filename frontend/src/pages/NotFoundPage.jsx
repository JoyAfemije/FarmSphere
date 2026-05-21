import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiHome, FiShoppingBag } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — Page Not Found | FarmSphere Africa</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-8xl mb-6"
          >
            🌿
          </motion.div>
          <h1 className="text-6xl font-heading font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-heading font-semibold text-gray-800 dark:text-white mb-3">
            This Page Got Lost in the Field!
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like this page wandered off the farm. Don't worry — let's get you back to the good stuff.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary px-6 py-3">
              <FiHome size={18} /> Back to Home
            </Link>
            <Link to="/products" className="btn-outline px-6 py-3">
              <FiShoppingBag size={18} /> Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
