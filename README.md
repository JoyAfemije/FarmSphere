# 🌾 Agrotech — Nigeria's Premier Agricultural Technology Ecommerce Platform

A full-stack, production-ready ecommerce website for selling agricultural tools, farming equipment, chemicals, fertilizers, pesticides, and irrigation systems. Built specifically for the Nigerian and African agricultural market.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Animations | Framer Motion |
| State Management | Zustand |
| Forms | React Hook Form |
| SEO | React Helmet Async |
| Slider | Swiper.js |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Image Storage | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| File Uploads | Multer |

---

## 📁 Project Structure

```
AgroFresh/
├── backend/
│   ├── config/          # Database, Cloudinary, Email config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error handler, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Token generation, email utils
│   ├── .env.example
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/         # Axios API services
    │   ├── components/  # Reusable UI components
    │   │   ├── common/  # Navbar, Footer, Cart, etc.
    │   │   ├── home/    # Hero, Categories, Testimonials
    │   │   └── products/ # ProductCard, Filter, Gallery
    │   ├── pages/       # Route pages
    │   │   └── admin/   # Admin dashboard pages
    │   ├── store/       # Zustand state stores
    │   ├── utils/       # Currency formatting, WhatsApp
    │   ├── App.jsx      # Routing
    │   └── main.jsx     # App entry
    ├── tailwind.config.js
    ├── vite.config.js
    └── vercel.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Backend Environment

```bash
cp backend/.env.example backend/.env
# Fill in your values in backend/.env
```

Required values:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — A long random secret string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `EMAIL_USER`, `EMAIL_PASSWORD` — Gmail credentials (use App Password)
- `ADMIN_EMAIL` — Email to receive contact form notifications

### 3. Frontend Environment

```bash
cp frontend/.env.example frontend/.env
# Set VITE_API_URL to your backend URL
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 API Endpoints

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products (filterable) |
| GET | `/api/products/:slug` | Get product by slug |
| GET | `/api/products/:id/related` | Get related products |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/orders` | Create order (public/auth) |
| GET | `/api/orders/my-orders` | Get user's orders |
| GET | `/api/orders/admin` | Get all orders (Admin) |
| GET | `/api/orders/admin/stats` | Dashboard stats (Admin) |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

### Categories
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category (Admin) |
| PUT | `/api/categories/:id` | Update category (Admin) |

### Reviews
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/reviews/product/:id` | Get product reviews |
| POST | `/api/reviews` | Create review (Auth) |
| PUT | `/api/reviews/:id` | Update review (Auth) |
| DELETE | `/api/reviews/:id` | Delete review (Auth/Admin) |

---

## 🌐 Deployment

### Frontend — Vercel

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set Root Directory: `frontend`
4. Add environment variables (`VITE_API_URL`, etc.)
5. Deploy — Vercel auto-handles the `vercel.json` SPA rewrites

### Backend — Render

1. Connect repo to [Render](https://render.com)
2. Create Web Service, set Root Directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env.example`
6. Set `NODE_ENV=production`

### Database — MongoDB Atlas

1. Create free cluster at [mongodb.com](https://www.mongodb.com/atlas)
2. Create database user and get connection string
3. Whitelist `0.0.0.0/0` (or Render's IP) in Network Access
4. Paste connection string as `MONGODB_URI`

---

## 🛍️ Features

### Customer Features
- ✅ Browse 8 product categories
- ✅ Advanced filtering (price, category, rating)
- ✅ Full-text product search
- ✅ Product image gallery
- ✅ Customer reviews & star ratings
- ✅ Add to cart with quantity control
- ✅ Cart sidebar with order summary
- ✅ Checkout form with Nigerian state picker
- ✅ WhatsApp ordering integration
- ✅ Order confirmation emails
- ✅ User registration & login
- ✅ Dark / Light mode toggle
- ✅ Responsive design (mobile-first)

### Admin Features
- ✅ Dashboard with revenue analytics
- ✅ Add/Edit/Delete products with image upload
- ✅ Manage orders & update status
- ✅ Manage users (role, active status)
- ✅ Protected admin routes

### SEO & Performance
- ✅ React Helmet Async for dynamic meta tags
- ✅ Open Graph & Twitter Card tags
- ✅ Schema.org structured data (Product, OnlineStore)
- ✅ Lazy loading for images
- ✅ Code splitting with React lazy/Suspense
- ✅ robots.txt

---

## 🎨 Design System

- **Primary Color**: Green (`#16a34a`) — Agricultural brand
- **Typography**: Inter (body) + Poppins (headings)
- **Border Radius**: Rounded cards (xl/2xl)
- **Shadows**: Soft green-tinted shadows
- **Dark Mode**: Full dark theme support

---

## 🇳🇬 Nigeria-Specific Features

- Currency in Nigerian Naira (₦)
- Nigerian state dropdown in checkout
- WhatsApp ordering button (most common Nigerian payment method)
- Free shipping threshold (₦20,000)
- Nigeria-optimized Google Maps embed
- Target markets: farmers, agro-dealers, agricultural businesses

---

## 📞 Support

- **WhatsApp**: +234 801 234 5678
- **Email**: info@agrotech.ng
- **Website**: https://agrotech-store.vercel.app

---

© 2025 Agrotech Nigeria. Built with ❤️ for Nigerian Farmers.
