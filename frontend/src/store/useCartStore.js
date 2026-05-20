import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // { product, quantity }
      isOpen: false,   // Cart sidebar open state

      // Add item or increase quantity
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.product._id === product._id);

        if (existing) {
          const newQty = existing.quantity + quantity;
          if (newQty > product.stock) {
            toast.error(`Only ${product.stock} units available.`);
            return;
          }
          set({
            items: items.map((i) =>
              i.product._id === product._id ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          if (quantity > product.stock) {
            toast.error(`Only ${product.stock} units available.`);
            return;
          }
          set({ items: [...items, { product, quantity }] });
        }
        toast.success(`${product.name} added to cart! 🛒`);
      },

      // Remove item completely
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product._id !== productId) });
        toast.success("Item removed from cart.");
      },

      // Update quantity
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        });
      },

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Toggle cart sidebar
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Computed values
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.discountPrice || i.product.price;
          return sum + price * i.quantity;
        }, 0),
      shippingFee: () => (get().subtotal() >= 20000 ? 0 : 1500),
      total: () => get().subtotal() + get().shippingFee(),

      // Format items for order API
      getOrderItems: () =>
        get().items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
    }),
    {
      name: "agrotech_cart", // persisted to localStorage
    }
  )
);

export default useCartStore;
