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
    { icon: "🚚", text: "Free Delivery on Qualifying Orders" },
    { icon: "🔄", text: "7-Day Easy Returns" },
    { icon: "🔒", text: "Secure Payments" },
    { icon: "📧", text: "Email Support · Fast Response" },
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
        <title>FarmSphere — Africa's #1 Agricultural Technology Store | Buy Farming Tools Online</title>
        <meta name="description" content="Shop premium farming tools, fertilizers, pesticides, irrigation systems and agricultural equipment at FarmSphere. Serving 20+ African countries." />
        <meta name="keywords" content="buy farming tools online Africa, fertilizers for sale Africa, pesticides Africa, irrigation systems Africa, agricultural chemicals Africa, FarmSphere" />
        <link rel="canonical" href="https://farmsphere.africa/" />
        <meta property="og:title" content="FarmSphere — Africa's #1 Agricultural Technology Store" />
        <meta property="og:description" content="Shop 2,500+ genuine farming products. Pan-Africa delivery. Email ordering available." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "FarmSphere Africa",
          "description": "Africa's premier agricultural technology platform",
          "url": "https://farmsphere.africa",
          "telephone": "+2348012345678",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "NG",
            "addressLocality": "Pan-African"
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
