import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import { formatNaira, buildWhatsAppProductURL } from "../../utils/formatCurrency";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-xs ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`}>★</span>
        ))}
      </div>
      {count > 0 && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const imageUrl = (!imgError && product.images?.[0]?.url)
    ? product.images[0].url
    : `https://placehold.co/400x300/f0fdf4/166534?text=${encodeURIComponent(product.name?.substring(0, 10) || "Product")}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="card group overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 h-52">
        <Link to={`/products/${product.slug}`}>
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="badge bg-red-500 text-white text-xs font-bold px-2 py-0.5">
              -{discountPct}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-600 text-white text-xs">Out of Stock</span>
          )}
          {product.isFeatured && (
            <span className="badge bg-primary-600 text-white text-xs">⭐ Featured</span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={() => setWishlist(!wishlist)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-colors ${
              wishlist ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500"
            }`}
            aria-label="Wishlist"
          >
            <FiHeart size={14} fill={wishlist ? "currentColor" : "none"} />
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-600 flex items-center justify-center shadow-md transition-colors"
            aria-label="Quick view"
          >
            <FiEye size={14} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        {product.category?.name && (
          <Link
            to={`/products?category=${product.category.slug}`}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline mb-1 block"
          >
            {product.category.name}
          </Link>
        )}

        {/* Product Name */}
        <Link to={`/products/${product.slug}`} className="block flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-snug line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.numReviews > 0 && (
          <StarRating rating={product.rating} count={product.numReviews} />
        )}

        {/* Unit info */}
        {product.unit && (
          <p className="text-xs text-gray-400 mt-1">Per {product.unit}</p>
        )}

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
              {formatNaira(price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {formatNaira(product.price)}
              </span>
            )}
          </div>
          <span className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="btn-primary flex-1 text-xs py-2.5 rounded-xl disabled:opacity-50"
            aria-label="Add to cart"
          >
            <FiShoppingCart size={14} /> Add to Cart
          </button>
          <a
            href={buildWhatsAppProductURL(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors flex-shrink-0"
            aria-label="Order on WhatsApp"
          >
            <FaWhatsapp size={17} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
