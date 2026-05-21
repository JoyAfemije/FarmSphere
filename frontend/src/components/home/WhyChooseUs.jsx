import { motion } from "framer-motion";
import { FiCheckCircle, FiTruck, FiShield, FiHeadphones, FiStar, FiRefreshCw } from "react-icons/fi";

const features = [
  {
    icon: <FiCheckCircle size={26} />,
    title: "100% Genuine Products",
    desc: "Every product is sourced directly from certified manufacturers and distributors. We guarantee authenticity on every purchase.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
  {
    icon: <FiTruck size={26} />,
    title: "Pan-Africa Delivery",
    desc: "We deliver to 20+ African countries. Free shipping on qualifying orders. Express delivery available in major cities.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
  {
    icon: <FiShield size={26} />,
    title: "Secure Payments",
    desc: "Multiple secure payment options including bank transfer, mobile money, and cash on delivery across Africa.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
  {
    icon: <FiHeadphones size={26} />,
    title: "Expert Agricultural Support",
    desc: "Our team of agronomists and farming experts are available by email and live chat to help you choose the right products.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
  {
    icon: <FiStar size={26} />,
    title: "Best Price Guarantee",
    desc: "We price-match any legitimate African agro-supplier. Get the best value for your farming investment with us.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
  {
    icon: <FiRefreshCw size={26} />,
    title: "Easy Returns",
    desc: "Not satisfied? Return within 7 days. Defective products are replaced immediately — no questions asked.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&auto=format&fit=crop"
                alt="Modern farming with FarmSphere products"
                className="w-full h-[480px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating trust card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  👨‍🌾
                </div>
                <div>
                  <p className="text-xs text-gray-500">Happy Customer</p>
                  <p className="font-semibold text-sm">Chukwuemeka O.</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">"My crop yield doubled after using FarmSphere's NPK fertilizer combo. Excellent quality!"</p>
              <div className="flex mt-2">
                {"⭐".repeat(5)}
              </div>
            </motion.div>

            {/* Years badge */}
            <div className="absolute -top-5 -left-5 w-20 h-20 bg-primary-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-green">
              <span className="font-bold text-2xl leading-none">10+</span>
              <span className="text-xs opacity-80">Years</span>
            </div>
          </motion.div>

          {/* Right: Features */}
          <div className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block badge-green mb-3 text-sm font-semibold px-4 py-1"
            >
              💪 Why Farmers Choose Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              The Smart Choice for African Farmers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 mb-8"
            >
              For over 10 years, we've been empowering African farmers with quality agricultural inputs and cutting-edge farming technology.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
