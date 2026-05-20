import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const categories = [
  { name: "Tools & Equipment", slug: "tools-equipment", icon: "🔧", color: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20", border: "border-orange-200 dark:border-orange-800", desc: "Power tools, hand tools & machinery" },
  { name: "Fertilizers", slug: "fertilizers", icon: "🌱", color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20", border: "border-green-200 dark:border-green-800", desc: "NPK, organic & specialty nutrients" },
  { name: "Pesticides", slug: "pesticides", icon: "🛡️", color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20", border: "border-blue-200 dark:border-blue-800", desc: "Insecticides, herbicides & fungicides" },
  { name: "Irrigation", slug: "irrigation", icon: "💧", color: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20", border: "border-cyan-200 dark:border-cyan-800", desc: "Drip, sprinkler & flood systems" },
  { name: "Chemicals", slug: "chemicals", icon: "🧪", color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20", border: "border-purple-200 dark:border-purple-800", desc: "Soil enhancers & growth regulators" },
  { name: "Seeds", slug: "seeds", icon: "🌾", color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20", border: "border-yellow-200 dark:border-yellow-800", desc: "Hybrid, open-pollinated & certified" },
  { name: "Farm Accessories", slug: "farm-accessories", icon: "🏡", color: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20", border: "border-rose-200 dark:border-rose-800", desc: "Protective gear, storage & more" },
  { name: "Livestock Supplies", slug: "livestock", icon: "🐄", color: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20", border: "border-amber-200 dark:border-amber-800", desc: "Feed, health & housing products" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Categories() {
  return (
    <section className="section bg-gray-50 dark:bg-gray-900/50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block badge-green mb-3 text-sm font-semibold px-4 py-1"
          >
            🌿 Product Categories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto"
          >
            Browse our comprehensive range of agricultural products designed for modern Nigerian farming
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={cardVariant}>
              <Link
                to={`/products?category=${cat.slug}`}
                className={`group block rounded-2xl border bg-gradient-to-br ${cat.color} ${cat.border} p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-heading font-semibold text-gray-800 dark:text-white text-sm md:text-base leading-tight mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mb-3">
                  {cat.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                  Shop Now <FiArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
