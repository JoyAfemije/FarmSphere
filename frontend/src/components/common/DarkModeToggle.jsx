import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";
import useThemeStore from "../../store/useThemeStore";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} />}
      </motion.div>
    </button>
  );
}
