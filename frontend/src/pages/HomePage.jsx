import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

// Quick stat bar below hero
function StatBar() {
  const stats = [
    { icon: "🚚", text: "Free Delivery above ₦20,000" },
    { icon: "🔄", text: "7-Day Easy Returns" },
    { icon: "🔒", text: "Secure Payments" },
    { icon: "💬", text: "WhatsApp Support 24/7" },
  ];
  return (
    <div className="bg-primary-600">
      <div className="container py-3">
        <div className="flex flex-wrap justify-center md:justify-between gap-4 md:gap-0">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium">
              <span>{s.icon}</span> {s.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Agrotech — Nigeria's #1 Agricultural Technology Store | Buy Farming Tools Online</title>
        <meta name="description" content="Shop premium farming tools, fertilizers, pesticides, irrigation systems and agricultural equipment at Agrotech Nigeria. Nationwide delivery. WhatsApp ordering available." />
        <meta name="keywords" content="buy farming tools online Nigeria, fertilizers for sale Nigeria, pesticides Nigeria, irrigation systems Nigeria, agricultural chemicals Nigeria, Agrotech" />
        <link rel="canonical" href="https://agrotech-store.vercel.app/" />
        <meta property="og:title" content="Agrotech — Nigeria's #1 Agricultural Technology Store" />
        <meta property="og:description" content="Shop 2,500+ genuine farming products. Nationwide delivery. WhatsApp ordering." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "Agrotech Nigeria",
          "description": "Nigeria's premier agricultural technology store",
          "url": "https://agrotech-store.vercel.app",
          "telephone": "+2348012345678",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "NG",
            "addressLocality": "Kaduna"
          }
        })}</script>
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Hero />
        <StatBar />
        <Categories />
        <FeaturedProducts />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </motion.div>
    </>
  );
}
