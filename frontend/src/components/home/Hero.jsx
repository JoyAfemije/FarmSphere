import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiTruck, FiStar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const stats = [
  { icon: "🌾", label: "Products", value: "2,500+" },
  { icon: "👨‍🌾", label: "Farmers Served", value: "15,000+" },
  { icon: "🏙️", label: "States Covered", value: "36" },
  { icon: "⭐", label: "Rating", value: "4.9/5" },
];

const trustBadges = [
  { icon: <FiShield />, text: "Genuine Products" },
  { icon: <FiTruck />, text: "Fast Delivery" },
  { icon: <FiStar />, text: "Top Rated Store" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-800/10 rounded-full blur-3xl" />
        {/* Animated leaves */}
        {["🌿", "🍃", "🌱", "🌾"].map((leaf, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-4xl opacity-10 select-none"
            style={{
              top: `${15 + i * 20}%`,
              left: `${5 + i * 22}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {leaf}
          </motion.span>
        ))}
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left Content ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-white"
          >
            {/* Label */}
            <motion.div variants={item} className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
              Nigeria's #1 Agrotech Store
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              Grow More,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-300">
                Harvest More
              </span>{" "}
              with Smart Farming Tech
            </motion.h1>

            {/* Description */}
            <motion.p variants={item} className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
              From premium fertilizers and pesticides to modern irrigation systems and power tools — everything Nigeria's farmers need to maximize yield and profit, delivered nationwide.
            </motion.p>

            {/* Trust Badges */}
            <motion.div variants={item} className="flex flex-wrap gap-4 mb-8">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-primary-400">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <Link to="/products" className="btn-primary px-7 py-3.5 text-base rounded-2xl">
                Shop Now <FiArrowRight />
              </Link>
              <a
                href="https://wa.me/2348012345678?text=Hello Agrotech! I need help with an order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-base bg-green-500 hover:bg-green-400 text-white transition-colors"
              >
                <FaWhatsapp size={20} /> Order on WhatsApp
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-heading font-bold text-xl text-primary-400">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Main image card */}
            <div className="relative w-full max-w-md">
              {/* Hero Image */}
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-900/50">
                <img
                  src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80&auto=format&fit=crop"
                  alt="Nigerian farmer with modern farming tools"
                  className="w-full h-[480px] object-cover"
                  loading="eager"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating product card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-8 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 w-56"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center text-2xl">
                  🌱
                </div>
                <div>
                  <p className="text-xs text-gray-500">Best Seller</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">NPK Fertilizer</p>
                  <p className="text-primary-600 font-bold text-sm">₦12,500</p>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-primary-600 text-white rounded-2xl px-4 py-3 shadow-green"
              >
                <p className="text-2xl font-bold">⭐ 4.9</p>
                <p className="text-xs opacity-80">15K+ Happy Farmers</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="fill-white dark:fill-gray-950 w-full">
          <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
