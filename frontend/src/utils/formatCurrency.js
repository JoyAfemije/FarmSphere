/**
 * Format number as USD currency (pan-African standard)
 * @param {number} amount
 * @returns {string} e.g. "$12,500"
 */
export const formatUSD = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Alias kept so existing imports still work
export const formatNaira = formatUSD;

/**
 * Format a number with thousand separators
 */
export const formatNumber = (num) => Number(num).toLocaleString("en-US");

/**
 * Build email order link
 * @param {Array} items - cart items
 * @param {number} total
 * @returns {string} mailto URL
 */
export const buildEmailOrderURL = (items, total) => {
  const subject = encodeURIComponent("New Order — FarmSphere");
  const body = encodeURIComponent(
    `Hello FarmSphere Team,\n\nI would like to place the following order:\n\n${items
      .map((i) => {
        const price = i.product.discountPrice || i.product.price;
        return `• ${i.product.name} x${i.quantity} = ${formatUSD(price * i.quantity)}`;
      })
      .join("\n")}\n\nOrder Total: ${formatUSD(total)}\n\nPlease confirm my order and provide payment details.\n\nThank you!`
  );
  return `mailto:orders@farmsphere.africa?subject=${subject}&body=${body}`;
};

/**
 * Build email inquiry link for a single product
 */
export const buildEmailProductURL = (product) => {
  const price = product.discountPrice || product.price;
  const subject = encodeURIComponent(`Product Inquiry — ${product.name}`);
  const body = encodeURIComponent(
    `Hello FarmSphere,\n\nI am interested in:\n\n*${product.name}*\nPrice: ${formatUSD(price)}\n\nPlease provide more details.\n\nThank you!`
  );
  return `mailto:orders@farmsphere.africa?subject=${subject}&body=${body}`;
};
