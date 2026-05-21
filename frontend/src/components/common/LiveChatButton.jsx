import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaXmark, FaComments } from "react-icons/fa6";

const SUPPORT_EMAIL = "support@farmsphere.africa";
const SALES_EMAIL = "orders@farmsphere.africa";

export default function LiveChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
      {/* Popup panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-72 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-600 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">FarmSphere Support</p>
                <p className="text-primary-200 text-xs mt-0.5">We typically reply within 2 hours</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FaXmark size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Have a question? Reach our team directly by email:
              </p>

              {/* Sales email */}
              <a
                href={`mailto:${SALES_EMAIL}?subject=Order Inquiry — FarmSphere`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 transition-colors">
                    Place an Order
                  </p>
                  <p className="text-xs text-gray-400">{SALES_EMAIL}</p>
                </div>
              </a>

              {/* Support email */}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Support Request — FarmSphere`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <FaComments size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 transition-colors">
                    General Support
                  </p>
                  <p className="text-xs text-gray-400">{SUPPORT_EMAIL}</p>
                </div>
              </a>

              <p className="text-xs text-gray-400 text-center pt-1">
                Mon – Sat · 8 AM – 6 PM (WAT)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Contact Support"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-lg flex items-center justify-center relative"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FaXmark size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FaComments size={24} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulsing ring */}
        {!open && (
          <span className="absolute w-full h-full rounded-2xl animate-ping bg-gray-700 opacity-30" />
        )}
      </motion.button>
    </div>
  );
}
