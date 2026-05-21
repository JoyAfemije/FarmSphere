import { Link } from "react-router-dom";
import { FaWheatAwn, FaPhone, FaEnvelope, FaLocationDot, FaFacebook, FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const footerLinks = {
  shop: [
    { label: "All Products", to: "/products" },
    { label: "Tools & Equipment", to: "/products?category=tools-equipment" },
    { label: "Fertilizers", to: "/products?category=fertilizers" },
    { label: "Pesticides", to: "/products?category=pesticides" },
    { label: "Irrigation Systems", to: "/products?category=irrigation" },
    { label: "Seeds", to: "/products?category=seeds" },
  ],
  company: [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Blog", to: "/blog" },
    { label: "Careers", to: "/careers" },
  ],
  support: [
    { label: "FAQ", to: "/faq" },
    { label: "Shipping Policy", to: "/shipping" },
    { label: "Return Policy", to: "/returns" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* ── Main Footer Content ── */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-white mb-4">
              <FaWheatAwn className="text-primary-400 text-3xl" />
              FarmSphere
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Africa's premier agricultural technology platform. We supply farmers, agro-dealers, and agricultural businesses across Africa with quality tools, chemicals, and equipment.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 text-sm">
              <a href="tel:+2348012345678" className="flex items-center gap-2.5 text-gray-400 hover:text-primary-400 transition-colors">
                <FaPhone size={13} className="text-white flex-shrink-0" />
                +234 801 234 5678
              </a>
              <a href="mailto:info@farmsphere.africa" className="flex items-center gap-2.5 text-gray-400 hover:text-primary-400 transition-colors">
                <FaEnvelope size={13} className="text-white flex-shrink-0" />
                info@farmsphere.africa
              </a>
              <div className="flex items-start gap-2.5 text-gray-400">
                <FaLocationDot size={13} className="text-white flex-shrink-0 mt-0.5" />
                <span>Pan-African Operations · Serving 20+ Countries</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                <FaFacebook size={16} className="text-white" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <FaInstagram size={16} className="text-white" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors" aria-label="X / Twitter">
                <FaXTwitter size={15} className="text-white" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gray-800">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {currentYear} FarmSphere Africa. All rights reserved. Africa's Premier Agro-Tech Platform.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5 opacity-50 grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 opacity-50 grayscale" />
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Bank Transfer</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Mobile Money</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
