import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa6";
import useCartStore from "../../store/useCartStore";
import { formatNaira, buildEmailOrderURL } from "../../utils/formatCurrency";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, shippingFee, total } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleEmailOrder = () => {
    const url = buildEmailOrderURL(items, total());
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-gray-950 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <FiShoppingBag className="text-primary-600" /> Your Cart
                {items.length > 0 && (
                  <span className="badge-green ml-1">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                )}
              </h2>
              <button onClick={closeCart} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close cart">
                <FiX size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl">
                    🛒
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-1">Add some amazing products to get started!</p>
                  </div>
                  <button onClick={closeCart} className="btn-primary">
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl p-3"
                    >
                      {/* Product Image */}
                      <Link to={`/products/${item.product.slug}`} onClick={closeCart} className="flex-shrink-0">
                        <img
                          src={item.product.images?.[0]?.url || "https://placehold.co/80x80/e9fce9/166534?text=🌿"}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate hover:text-primary-600 transition-colors">
                            {item.product.name}
                          </h4>
                        </Link>
                        <p className="text-primary-600 font-bold text-sm mt-0.5">{formatNaira(price)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 disabled:opacity-30 rounded"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 disabled:opacity-30 rounded"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer (Summary & CTA) */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 space-y-3 bg-white dark:bg-gray-950">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatNaira(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shippingFee() === 0 ? "text-primary-600 font-semibold" : ""}>
                      {shippingFee() === 0 ? "FREE 🎉" : formatNaira(shippingFee())}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-1.5 border-t border-gray-100 dark:border-gray-800">
                    <span>Total</span>
                    <span className="text-primary-600">{formatNaira(total())}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-primary w-full">
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleEmailOrder}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm transition-colors"
                >
                  <FaEnvelope size={16} /> Email My Order
                </button>

                <p className="text-xs text-gray-400 text-center">
                  {shippingFee() > 0 ? `Add ${formatNaira(20000 - subtotal())} more for FREE shipping` : "You qualify for FREE shipping! 🎉"}
                </p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
