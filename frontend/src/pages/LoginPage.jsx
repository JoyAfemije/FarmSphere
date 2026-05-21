import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { FaWheatAwn, FaEnvelope } from "react-icons/fa6";
import useAuthStore from "../store/useAuthStore";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate(result.user?.role === "admin" ? "/admin" : from, { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login — FarmSphere Africa</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-8"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-primary-600">
                <FaWheatAwn className="text-3xl" /> FarmSphere
              </Link>
              <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mt-4">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your FarmSphere account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" }
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="input pl-11"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input
                    {...register("password", { required: "Password is required" })}
                    type={showPwd ? "text" : "password"}
                    placeholder="Your password"
                    className="input pl-11 pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create Account</Link>
            </div>

            {/* Email alternative */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FaEnvelope size={16} className="flex-shrink-0 text-gray-800 dark:text-white" />
              <span>Or order directly via <a href="mailto:orders@farmsphere.africa" className="font-semibold underline text-primary-600">email</a> without an account</span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
