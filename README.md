# Jijamata Gruh Udyog (SHG), Nashik — Full-Stack E-Commerce Application

A complete full-stack e-commerce platform for **Jijamata Gruh Udyog**, a women's Self-Help Group (SHG) based in Nashik, Maharashtra, producing authentic Maharashtrian delicacies (Papad, Achar, Chakli, Laddus, Masalas).

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Multilingual Support**: English, Marathi (मराठी), and Hindi (हिंदी) across products, categories, cart, checkout, tracking, and admin console.
- **Backend**: Node.js & Express REST API using TypeScript (`server.ts`, `server/app.ts`).
- **Database**: 
  - **MySQL** relational database with `mysql2/promise` connection pooling, parameterized queries, and ACID transactions.
  - **Automatic Fallback Engine**: If MySQL daemon is temporarily unreachable (e.g. sandbox container preview), the backend automatically engages an embedded persistent relational store preserving identical SQL semantics, tables, transactions, and state mutations in `.ecommerce_data_store.json`.
- **Authentication & Security**:
  - Bcrypt password hashing.
  - JSON Web Tokens (JWT) issued over secure HTTP-only cookies and Bearer headers.
  - Role-Based Access Control (RBAC): `customer` vs. `admin`.
  - Helmet HTTP security headers, CORS with credential support, request body size protection.
  - Server-side order total recalculation and inventory locking.

---

## 📁 Project Structure

```
├── database/
│   ├── schema.sql           # MySQL DDL (users, categories, products, orders, order_items, order_timelines, offers, reviews, contact_messages)
│   └── seed.sql             # Initial seed data for products, categories, coupons, reviews, admin user
├── server/
│   ├── config.ts            # Environment variables & runtime configuration
│   ├── database/
│   │   └── db.ts            # mysql2 connection pool, transactions, and fallback store
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication, requireAdmin, optionalAuth middlewares
│   ├── routes/
│   │   ├── auth.ts          # Register, Login, Logout, /me
│   │   ├── products.ts      # Product catalog, search, filter, admin CRUD
│   │   ├── categories.ts    # Categories listing and admin management
│   │   ├── orders.ts        # Order checkout, stock validation, tracking, admin status
│   │   ├── offers.ts        # Offers, coupon codes, admin discounts
│   │   ├── reviews.ts       # Customer reviews and moderation
│   │   ├── contact.ts       # Contact inquiries and admin inbox
│   │   └── customers.ts     # Customer analytics for admin dashboard
│   └── app.ts               # Express configuration, security, routes
├── src/
│   ├── components/          # Reusable UI components (Header, Footer, Toast, Modals)
│   ├── context/
│   │   └── AppContext.tsx   # Global application context integrating with REST API
│   ├── data/
│   │   ├── initialData.ts   # Reference product specifications & translations
│   │   └── translations.ts  # English, Marathi, Hindi dictionary
│   ├── pages/
│   │   ├── customer/        # Customer storefront pages (Home, Products, Detail, Cart, Checkout, Track, Story, Contact, Login, Dashboard)
│   │   └── admin/           # Admin Console (Dashboard, Products, Orders, Customers, Offers)
│   ├── services/
│   │   └── api.ts           # Centralized typed API client
│   └── types.ts             # TypeScript definitions
├── server.ts                # Express server mounting Vite middlewares in dev mode
├── .env.example             # Template for environment configuration
└── package.json             # Scripts & dependencies
```

---

## ⚙️ Environment Variables (`.env`)

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Web & API Server port | `3000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `DB_HOST` | MySQL hostname | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD`| MySQL password | *(empty)* |
| `DB_NAME` | MySQL database name | `jijamata_ecommerce` |
| `JWT_SECRET`| Secret key for signing authentication tokens | *(strong secret)* |
| `ADMIN_NAME`| Name of initial SHG coordinator | `Sunita Patil (SHG Coordinator)` |
| `ADMIN_EMAIL`| Admin login email | `admin@jijamata.org` |
| `ADMIN_PASSWORD` | Initial admin password | `Jijamata@Nashik2026` |
| `ADMIN_PHONE`| Admin phone number | `+91 94222 12345` |

---

## 🚀 Installation & Setup Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MySQL Database
Create the database and run the schema and seed scripts:

```bash
# Log in to MySQL CLI
mysql -u root -p

# Inside MySQL prompt:
CREATE DATABASE IF NOT EXISTS jijamata_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import schema and seed data
mysql -u root -p jijamata_ecommerce < database/schema.sql
mysql -u root -p jijamata_ecommerce < database/seed.sql
```

### 3. Start Development Server
```bash
npm run dev
```
The full-stack application will launch on `http://localhost:3000` with both the Express REST API and Vite frontend running simultaneously.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Default Credentials

- **SHG Staff / Admin Portal**:
  - Email: `admin@jijamata.org` (or username `admin`)
  - Password: `Jijamata@Nashik2026`
- **Customer Account (Demo)**:
  - Email: `rajesh.kulkarni@gmail.com`
  - Password: `Customer@123`

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new customer account.
- `POST /api/auth/login` — Login customer or admin (issues JWT).
- `POST /api/auth/logout` — Clear session cookies.
- `GET /api/auth/me` — Retrieve profile of authenticated user.

### Products & Categories
- `GET /api/products` — Filter products by category, featured tag, or search term.
- `GET /api/products/:id` — Product details.
- `POST /api/admin/products` — *[Admin]* Add new product (with client image upload & multiple pack sizes).
- `PUT /api/admin/products/:id` — *[Admin]* Update product pricing, description, stock, or tags.
- `DELETE /api/admin/products/:id` — *[Admin]* Remove product from catalog.
- `GET /api/categories` — Category list with live product counts.

### Orders & Tracking
- `POST /api/orders` — Recalculates order subtotal, checks stock in transaction, locks inventory, generates order ID and tracking hash.
- `GET /api/orders/:orderNumber` — Public or authenticated order lookup with live timeline events.
- `GET /api/customer/orders` — Orders placed by current authenticated customer.
- `GET /api/admin/orders` — *[Admin]* View all customer orders.
- `PATCH /api/admin/orders/:id/status` — *[Admin]* Update status (`Confirmed`, `Preparing`, `Packed`, `Shipped`, `Delivered`).

### Offers, Reviews & Messages
- `GET /api/offers` — List active coupon codes.
- `POST /api/offers/validate` — Validate coupon against order subtotal.
- `GET /api/reviews` — Approved customer reviews.
- `POST /api/reviews` — Submit a review (recalculates product average rating).
- `POST /api/contact` — Customer inquiry submission.
- `GET /api/admin/customers` — *[Admin]* Customer lifetime orders and expenditure metrics.
