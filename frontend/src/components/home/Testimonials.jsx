import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Alhaji Musa Ibrahim",
    role: "Maize & Sorghum Farmer",
    location: "Kano State",
    avatar: "👨‍🌾",
    text: "Agrotech's NPK fertilizer and insecticides transformed my farm output. My yield increased by 70% this season. I now order every 3 months. Delivery is always fast to Kano!",
    rating: 5,
    product: "NPK Fertilizer 20-10-10",
  },
  {
    name: "Mrs. Chioma Okonkwo",
    role: "Vegetable Farmer",
    location: "Anambra State",
    avatar: "👩‍🌾",
    text: "The drip irrigation system I bought from Agrotech saved my tomato farm during the dry season. Customer support helped me install it via WhatsApp video call. Amazing service!",
    rating: 5,
    product: "Drip Irrigation Kit",
  },
  {
    name: "Emeka Adebisi",
    role: "Agro-dealer & Distributor",
    location: "Lagos State",
    avatar: "🧑‍💼",
    text: "I wholesale from Agrotech for my shop in Agege. The prices are very competitive and products are always original. My customers keep coming back. Best B2B agro supplier!",
    rating: 5,
    product: "Bulk Fertilizers & Chemicals",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Rice Farmer",
    location: "Niger State",
    avatar: "👩",
    text: "The power tiller I purchased works excellently on my 10-hectare rice farm. Agrotech gave me a 6-month warranty and technical support. Very professional company.",
    rating: 5,
    product: "Power Tiller Machine",
  },
  {
    name: "Sunday Olawale",
    role: "Poultry & Crop Farmer",
    location: "Ogun State",
    avatar: "👨",
    text: "I ordered herbicides and chicken feed supplements. Quality is top-notch and arrived within 48 hours to Sagamu. The WhatsApp ordering process is so convenient. 5 stars!",
    rating: 5,
    product: "Herbicide & Livestock Supplements",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section bg-gradient-to-br from-primary-950 via-green-950 to-gray-950 relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute inset-0 bg-leaf-pattern opacity-30 pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-white/10 border border-white/20 text-primary-300 rounded-full px-4 py-1.5 text-sm font-medium mb-3"
          >
            ⭐ Customer Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-heading font-bold text-white mb-4"
          >
            What Our Farmers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            Join 15,000+ satisfied farmers across Nigeria who trust Agrotech for their farming needs
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full">
                  {/* Rating */}
                  <StarRating rating={t.rating} />

                  {/* Quote */}
                  <p className="text-gray-300 text-sm leading-relaxed mt-3 mb-5">
                    "{t.text}"
                  </p>

                  {/* Product tag */}
                  <div className="badge bg-primary-900/50 text-primary-300 border border-primary-700/30 mb-4">
                    Bought: {t.product}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.role} · {t.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8 pt-8 border-t border-white/10"
        >
          {[
            { label: "Overall Rating", value: "4.9 / 5.0", icon: "⭐" },
            { label: "Happy Customers", value: "15,000+", icon: "👨‍🌾" },
            { label: "Orders Delivered", value: "50,000+", icon: "📦" },
            { label: "States Covered", value: "All 36 + FCT", icon: "🗺️" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-white font-bold text-xl">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
