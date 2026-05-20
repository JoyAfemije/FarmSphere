/**
 * Format number as Nigerian Naira currency
 * @param {number} amount
 * @returns {string} e.g. "₦12,500"
 */
export const formatNaira = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "₦0";
  return `₦${amount.toLocaleString("en-NG")}`;
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (num) => {
  return Number(num).toLocaleString("en-NG");
};

/**
 * Build WhatsApp message URL for order
 * @param {Array} items - cart items
 * @param {number} total - order total
 * @returns {string} WhatsApp URL
 */
export const buildWhatsAppOrderURL = (items, total, phone = "2348012345678") => {
  const itemLines = items
    .map((i) => {
      const price = i.product.discountPrice || i.product.price;
      return `• ${i.product.name} x${i.quantity} = ${formatNaira(price * i.quantity)}`;
    })
    .join("%0A");

  const message = encodeURIComponent(
    `Hello Agrotech! 🌾\n\nI'd like to place an order:\n\n${items
      .map((i) => {
        const price = i.product.discountPrice || i.product.price;
        return `• ${i.product.name} x${i.quantity} = ${formatNaira(price * i.quantity)}`;
      })
      .join("\n")}\n\n*Total: ${formatNaira(total)}*\n\nPlease confirm my order. Thank you!`
  );

  return `https://wa.me/${phone}?text=${message}`;
};

/**
 * Build WhatsApp single product order URL
 */
export const buildWhatsAppProductURL = (product, phone = "2348012345678") => {
  const price = product.discountPrice || product.price;
  const message = encodeURIComponent(
    `Hello Agrotech! 🌾\n\nI'm interested in ordering:\n\n*${product.name}*\nPrice: ${formatNaira(price)}\n\nPlease provide more details. Thank you!`
  );
  return `https://wa.me/${phone}?text=${message}`;
};
