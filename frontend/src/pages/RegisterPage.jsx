import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import useAuthStore from "../store/useAuthStore";

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    const result = await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone });
    if (result.success) navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Create Account — Agrotech Nigeria</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-8"
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-primary-600">
                <GiWheat className="text-3xl" /> Agrotech
              </Link>
              <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mt-4">Create Account</h1>
              <p className="text-gray-500 text-sm mt-1">Join 15,000+ Nigerian farmers on Agrotech</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })} className="input pl-11" placeholder="Your full name" />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} type="email" className="input pl-11" placeholder="you@example.com" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input {...register("phone", { pattern: { value: /^[0-9+\-\s]{10,15}$/, message: "Enter a valid phone number" } })} className="input pl-11" placeholder="08012345678" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} type={showPwd ? "text" : "password"} className="input pl-11 pr-11" placeholder="Create a password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input {...register("confirmPassword", { required: "Please confirm your password", validate: val => val === password || "Passwords do not match" })} type={showPwd ? "text" : "password"} className="input pl-11" placeholder="Repeat your password" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <p className="text-xs text-gray-400">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and{" "}
                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : "Create Account 🌾"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
