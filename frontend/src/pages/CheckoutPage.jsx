import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import { orderAPI } from "../api/orders";
import { formatNaira, buildWhatsAppOrderURL } from "../utils/formatCurrency";
import toast from "react-hot-toast";

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
];

export default function CheckoutPage() {
  const { items, subtotal, shippingFee, total, clearCart, getOrderItems } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "Lagos",
    }
  });

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-6">Add some products before checking out.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      if (paymentMethod === "whatsapp") {
        // WhatsApp ordering
        const url = buildWhatsAppOrderURL(items, total(), "2348012345678");
        clearCart();
        window.open(url, "_blank");
        toast.success("Order sent to WhatsApp! 🎉");
        navigate("/");
        return;
      }

      // API order
      const orderData = {
        items: getOrderItems(),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
        },
        paymentMethod,
        notes: formData.notes,
      };

      if (!user) {
        orderData.guestInfo = { name: formData.fullName, email: formData.email, phone: formData.phone };
      }

      const { data } = await orderAPI.create(orderData);
      clearCart();
      setOrderSuccess(data.order);
      toast.success(`Order ${data.order.orderNumber} placed successfully! 🌾`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally { setLoading(false); }
  };

  // Order success screen
  if (orderSuccess) {
    return (
      <div className="container py-24 max-w-xl mx-auto text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <div className="text-7xl mb-4">🎉</div>
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={32} className="text-primary-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-4">Order Number: <span className="font-bold text-primary-600">{orderSuccess.orderNumber}</span></p>
          <p className="text-gray-500 mb-8">
            Thank you for your order! Our team will contact you via WhatsApp to confirm delivery details.
            A confirmation email has been sent to <strong>{orderSuccess.shippingAddress.email}</strong>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-outline">Continue Shopping</Link>
            {user && <Link to="/account/orders" className="btn-primary">View Orders</Link>}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout — Agrotech Nigeria</title>
      </Helmet>

      <div className="container py-10">
        <Link to="/products" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 text-sm mb-6 transition-colors">
          <FiArrowLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Delivery Info */}
              <div className="card p-6">
                <h2 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-5">
                  📦 Delivery Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                    <input {...register("fullName", { required: "Full name is required" })} className="input" placeholder="Your full name" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
                    <input {...register("phone", { required: "Phone number is required", pattern: { value: /^[0-9+\-\s]{10,15}$/, message: "Enter a valid phone number" } })} className="input" placeholder="08012345678" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <input {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} type="email" className="input" placeholder="you@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address *</label>
                    <input {...register("street", { required: "Street address is required" })} className="input" placeholder="15 Agro Street, off Main Road" />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City / LGA *</label>
                    <input {...register("city", { required: "City is required" })} className="input" placeholder="Lagos Island" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State *</label>
                    <select {...register("state", { required: "State is required" })} className="input">
                      {NIGERIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Order Notes (optional)</label>
                    <textarea {...register("notes")} className="input resize-none" rows={3} placeholder="Any special instructions for delivery..." />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-5">
                  💳 Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "whatsapp", label: "Order via WhatsApp", desc: "Send order details via WhatsApp. Pay on confirmation.", icon: <FaWhatsapp className="text-green-500" size={20} /> },
                    { id: "transfer", label: "Bank Transfer", desc: "Transfer to our account after order is confirmed.", icon: "🏦" },
                    { id: "cash", label: "Cash on Delivery", desc: "Pay when your order arrives. Available in select cities.", icon: "💵" },
                  ].map((method) => (
                    <label key={method.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? "border-primary-600 bg-primary-50 dark:bg-primary-950" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="mt-1 accent-primary-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {typeof method.icon === "string" ? <span className="text-xl">{method.icon}</span> : method.icon}
                          <span className="font-semibold text-sm text-gray-800 dark:text-white">{method.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base rounded-2xl">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : paymentMethod === "whatsapp" ? (
                  <><FaWhatsapp size={20} /> Send Order to WhatsApp</>
                ) : (
                  <><FiShoppingBag size={20} /> Place Order — {formatNaira(total())}</>
                )}
              </button>
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div>
            <div className="card p-5 sticky top-20">
              <h2 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product._id} className="flex items-center gap-3">
                      <img src={item.product.images?.[0]?.url || "https://placehold.co/60x60"} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-primary-600 flex-shrink-0">{formatNaira(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>{formatNaira(subtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shippingFee() === 0 ? "text-primary-600 font-semibold" : ""}>{shippingFee() === 0 ? "FREE" : formatNaira(shippingFee())}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span>
                  <span className="text-primary-600 text-lg">{formatNaira(total())}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-xl text-xs text-green-700 dark:text-green-300">
                🔒 Your order is protected by Agrotech's buyer guarantee.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
