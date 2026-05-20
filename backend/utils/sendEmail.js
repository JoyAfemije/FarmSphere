const transporter = require("../config/nodemailer");

/**
 * Send a generic email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} [options.text] - Plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ""), // strip HTML for plain text
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

/**
 * Send order confirmation email to customer
 */
const sendOrderConfirmation = async (order, email) => {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₦${item.price.toLocaleString()}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#16a34a;color:#fff;padding:24px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:24px">🌾 Agrotech</h1>
        <p style="margin:8px 0 0;opacity:0.9">Order Confirmation</p>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #e5e7eb">
        <h2 style="color:#16a34a">Order Confirmed! 🎉</h2>
        <p>Hello <strong>${order.shippingAddress.fullName}</strong>,</p>
        <p>Thank you for your order. Here are your order details:</p>
        <p><strong>Order Number:</strong> <span style="color:#16a34a">${order.orderNumber}</span></p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px;text-align:left">Product</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Price</th>
              <th style="padding:8px;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;margin-top:16px">
          <p>Subtotal: <strong>₦${order.subtotal.toLocaleString()}</strong></p>
          <p>Shipping: <strong>₦${order.shippingFee.toLocaleString()}</strong></p>
          <p style="font-size:18px;color:#16a34a">Total: <strong>₦${order.total.toLocaleString()}</strong></p>
        </div>

        <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px">
          <h3>Delivery Address</h3>
          <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
          <p>Phone: ${order.shippingAddress.phone}</p>
        </div>

        <p style="margin-top:24px">Our team will contact you on WhatsApp to confirm your order. You can also track your order status on our website.</p>
      </div>
      <div style="background:#f3f4f6;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#6b7280">
        <p>© ${new Date().getFullYear()} Agrotech. All rights reserved.</p>
        <p>Nigeria's Premier Agricultural Technology Store</p>
      </div>
    </div>`;

  return sendEmail({ to: email, subject: `Order Confirmed - ${order.orderNumber} | Agrotech`, html });
};

/**
 * Send contact form notification to admin
 */
const sendContactNotification = async ({ name, email, phone, subject, message }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#16a34a;color:#fff;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">📩 New Contact Form Submission</h2>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #e5e7eb">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <h3>Message:</h3>
        <p style="background:#f9fafb;padding:16px;border-radius:6px">${message}</p>
      </div>
    </div>`;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact: ${subject} - from ${name}`,
    html,
  });
};

module.exports = { sendEmail, sendOrderConfirmation, sendContactNotification };
