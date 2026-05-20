import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api/axios";

const contactInfo = [
  { icon: <FiPhone size={20} />, label: "Phone", value: "+234 801 234 5678", link: "tel:+2348012345678", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  { icon: <FaWhatsapp size={20} />, label: "WhatsApp", value: "+234 801 234 5678", link: "https://wa.me/2348012345678", color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
  { icon: <FiMail size={20} />, label: "Email", value: "info@agrotech.ng", link: "mailto:info@agrotech.ng", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600" },
  { icon: <FiMapPin size={20} />, label: "Address", value: "15 Agro Plaza, Abuja-Kano Road, Kaduna, Nigeria", link: null, color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600" },
  { icon: <FiClock size={20} />, label: "Hours", value: "Mon–Sat: 8:00 AM – 6:00 PM", link: null, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/users/contact", data);
      toast.success("Message sent! We'll reply within 24 hours. 🌾");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Agrotech Nigeria | WhatsApp & Email Support</title>
        <meta name="description" content="Contact Agrotech Nigeria for product inquiries, orders, and support. Reach us via WhatsApp, phone, or email. Located in Kaduna, Nigeria." />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Contact Agrotech
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-primary-100 max-w-lg mx-auto">
            Have questions? We're here to help Nigerian farmers succeed. Reach us via WhatsApp for the fastest response.
          </motion.p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Get in Touch</h2>
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                  {item.link ? (
                    <a href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary-600 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-800 dark:text-white">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2348012345678?text=Hello Agrotech! I need assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold justify-center transition-colors mt-4"
            >
              <FaWhatsapp size={22} /> Chat on WhatsApp Now
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8"
            >
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
                    <input {...register("name", { required: "Name is required" })} className="input" placeholder="Chukwuemeka Adeyemi" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                    <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} type="email" className="input" placeholder="you@email.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                  <input {...register("phone")} className="input" placeholder="08012345678" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
                  <input {...register("subject", { required: "Subject is required" })} className="input" placeholder="Product inquiry, Order status, Technical support..." />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                  <textarea {...register("message", { required: "Message is required", minLength: { value: 20, message: "Please provide more details (at least 20 characters)" } })} rows={5} className="input resize-none" placeholder="Tell us how we can help you..." />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base rounded-2xl">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <><FiSend size={18} /> Send Message</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-16">
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">Find Us on the Map</h2>
          <div className="rounded-2xl overflow-hidden h-80 shadow-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.7!2d7.4398!3d10.5105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104d348b3c7a7dcb%3A0x5c0c3cf7e7b35c7!2sKaduna!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Agrotech Nigeria Location"
            />
          </div>
        </div>
      </div>
    </>
  );
}
