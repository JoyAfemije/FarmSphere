import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "2348012345678"; // Replace with actual number
const DEFAULT_MESSAGE = "Hello Agrotech! 🌾 I'd like to inquire about your products.";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-2xl shadow-lg flex items-center justify-center"
    >
      <FaWhatsapp size={30} />
      {/* Pulsing ring effect */}
      <span className="absolute w-full h-full rounded-2xl animate-ping bg-green-400 opacity-30" />
    </motion.a>
  );
}
