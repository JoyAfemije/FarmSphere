import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/auth";
import toast from "react-hot-toast";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login(credentials);
          localStorage.setItem("agrotech_token", data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome back, ${data.user.name}! 👋`);
          return { success: true, user: data.user };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed.";
          toast.error(message);
          return { success: false, message };
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(userData);
          localStorage.setItem("agrotech_token", data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome to Agrotech, ${data.user.name}! 🌾`);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Registration failed.";
          toast.error(message);
          return { success: false, message };
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem("agrotech_token");
        localStorage.removeItem("agrotech_user");
        set({ user: null, token: null });
        toast.success("Logged out successfully.");
      },

      // Refresh user profile
      refreshUser: async () => {
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.user });
        } catch (_) {
          get().logout();
        }
      },

      // Computed helpers
      isAuthenticated: () => !!get().user,
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "agrotech_auth", // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
