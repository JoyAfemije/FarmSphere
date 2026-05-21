import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate API call (integrate with Mailchimp/ConvertKit in production)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.success("🌾 Subscribed! You'll receive exclusive farming tips and deals.");
  };

  return (
    <section className="section bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      {/* BG circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-32 -translate-x-32 pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl text-3xl mb-6"
          >
            📧
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-heading font-bold text-white mb-4"
          >
            Get Exclusive Farming Tips & Deals
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary-100 text-base md:text-lg mb-8"
          >
            Join 10,000+ African farmers receiving weekly tips on soil health, crop management, and exclusive discount codes.
          </motion.p>

          {!submitted ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-colors disabled:opacity-70 flex-shrink-0"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Subscribe <FiArrowRight /></>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <FiCheck size={28} className="text-primary-600" />
              </div>
              <p className="text-white font-semibold text-lg">You're subscribed! 🎉</p>
              <p className="text-primary-100 text-sm">Check your inbox for your first farming tips.</p>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-primary-200 text-xs mt-4"
          >
            🔒 No spam ever. Unsubscribe anytime. We respect your privacy.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-white/20"
          >
            {[
              "✅ Weekly Agro Tips",
              "✅ Exclusive Discounts",
              "✅ New Product Alerts",
              "✅ Market Price Updates",
            ].map((b) => (
              <span key={b} className="text-primary-100 text-sm">{b}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
