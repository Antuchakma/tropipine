# TropiPine  Full PERN Stack Project Workflow
> Version 2.0  Detailed Developer Guide for Copilot Agent

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Folder Structure](#4-folder-structure)
5. [Database Schema (PostgreSQL + Prisma)](#5-database-schema-postgresql--prisma)
6. [Backend API  All Endpoints](#6-backend-api--all-endpoints)
7. [Frontend  User Website](#7-frontend--user-website)
8. [Frontend  Admin Dashboard](#8-frontend--admin-dashboard)
9. [Payment System (bKash / Nagad / Rocket)](#9-payment-system-bkash--nagad--rocket)
10. [Discount & Coupon System](#10-discount--coupon-system)
11. [Exclusive Stock System](#11-exclusive-stock-system)
12. [Security Implementation](#12-security-implementation)
13. [UI/UX Guidelines](#13-uiux-guidelines)
14. [Development Phases](#14-development-phases)
15. [Environment Variables](#15-environment-variables)
16. [Deployment Guide](#16-deployment-guide)

---

## 1. Project Overview

**TropiPine** is a fruit e-commerce platform for selling fresh, seasonal, and premium-grade fruits online. The platform supports:

- A customer-facing website for browsing and purchasing fruits
- A separate admin dashboard for managing products, orders, pricing, and inventory
- Manual MFS (Mobile Financial Service) payment verification via bKash, Nagad, and Rocket
- Dynamic pricing and discount configuration by admins
- Exclusive stock sections for premium fruit variants (e.g., Haribhanga Mango, Gopalbhog Mango)

---

## 2. Architecture

```
www.tropipine.com           Customer Website (React + Vite)
admin.tropipine.com         Admin Dashboard (React + Vite, separate app)
api.tropipine.com           Shared Backend API (Node.js + Express)
```

- Both frontends communicate with the **same backend API**
- Admin routes are protected by role-based middleware  never exposed in the user-facing website
- Admin dashboard is a completely separate React application deployed separately

```
[User Browser]              [Admin Browser]

[tropipine.com]         [admin.tropipine.com]

         [api.tropipine.com]

         [PostgreSQL Database]

         [Cloudinary (Images)]
```

---

## 3. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend Framework | React 18 + Vite | Both user and admin apps |
| Styling | Tailwind CSS v3 | Utility-first, responsive |
| Animations | Framer Motion | Page transitions, hover effects |
| State Management | Redux Toolkit + RTK Query | Global state + API caching |
| Backend | Node.js + Express.js | REST API |
| Database | PostgreSQL | Hosted on Neon or Supabase |
| ORM | Prisma | Type-safe DB queries |
| Auth | JWT + HTTP-only Cookies | Secure token storage |
| Image Hosting | Cloudinary | Product and gallery images |
| File Upload | Multer | Middleware before Cloudinary upload |
| Payment | bKash / Nagad / Rocket (Manual MFS) | Transaction ID verification |
| SSLCommerz | Placeholder only | Integrate later when available |
| Input Validation | Zod (backend) | Schema validation on all routes |
| Security | Helmet, CORS, bcrypt, Rate Limiter | |
| Version Control | Git + GitHub | Separate repos per app |
| Deployment Frontend | Vercel | Both React apps |
| Deployment Backend | Render or Railway | Node.js server |
| Database Host | Neon (recommended) or Supabase | |

---

## 4. Folder Structure

### 4.1 User Frontend  `tropipine-client/`

```
tropipine-client/
 public/
    favicon.ico
 src/
    assets/                    # Static images, logos
    components/
       layout/
          Navbar.jsx
          Footer.jsx
          ScrollToTop.jsx
       ui/
          Button.jsx
          Badge.jsx
          Spinner.jsx
          Modal.jsx
          Toast.jsx
          StarRating.jsx
       product/
          ProductCard.jsx
          ProductGrid.jsx
          ProductFilters.jsx
          ProductImageGallery.jsx
          StockBadge.jsx
       cart/
          CartDrawer.jsx
          CartItem.jsx
          CartSummary.jsx
       home/
           HeroSection.jsx
           FeaturedProducts.jsx
           ExclusiveSection.jsx
           SeasonalOffers.jsx
           Testimonials.jsx
           DeliveryInfo.jsx
    pages/
       HomePage.jsx
       ShopPage.jsx
       ProductDetailPage.jsx
       CartPage.jsx
       CheckoutPage.jsx
       OrderSuccessPage.jsx
       OrderTrackingPage.jsx
       WishlistPage.jsx
       GalleryPage.jsx
       AboutPage.jsx
       LoginPage.jsx
       RegisterPage.jsx
       ForgotPasswordPage.jsx
       ResetPasswordPage.jsx
       ProfilePage.jsx
    store/
       index.js
       slices/
          authSlice.js
          cartSlice.js
          wishlistSlice.js
       api/
           productApi.js
           orderApi.js
           authApi.js
           reviewApi.js
    hooks/
       useAuth.js
       useCart.js
       useDebounce.js
    utils/
       formatPrice.js
       formatDate.js
       validators.js
    constants/
       categories.js
    App.jsx
    main.jsx
    index.css
 .env
 .env.example
 vite.config.js
 tailwind.config.js
 package.json
```

---

### 4.2 Admin Dashboard  `tropipine-admin/`

```
tropipine-admin/
 src/
    components/
       layout/
          AdminLayout.jsx
          Sidebar.jsx
          AdminNavbar.jsx
       charts/
          RevenueChart.jsx
          OrdersChart.jsx
          TopProductsChart.jsx
       ui/
           StatCard.jsx
           DataTable.jsx
           ConfirmModal.jsx
    pages/
       DashboardPage.jsx
       products/
          ProductListPage.jsx
          AddProductPage.jsx
          EditProductPage.jsx
       orders/
          OrderListPage.jsx
          OrderDetailPage.jsx
       inventory/
          InventoryPage.jsx
       discounts/
          CouponListPage.jsx
          AddCouponPage.jsx
          ProductDiscountPage.jsx
       payments/
          PaymentVerificationPage.jsx
       gallery/
          GalleryPage.jsx
       customers/
          CustomerListPage.jsx
       analytics/
          AnalyticsPage.jsx
       AdminLoginPage.jsx
    store/
    hooks/
    utils/
    App.jsx
    main.jsx
 .env
 package.json
```

---

### 4.3 Backend  `tropipine-server/`

```
tropipine-server/
 src/
    config/
       db.js                  # Prisma client instance
       cloudinary.js          # Cloudinary config
       corsOptions.js
    controllers/
       auth.controller.js
       product.controller.js
       category.controller.js
       order.controller.js
       payment.controller.js
       review.controller.js
       coupon.controller.js
       gallery.controller.js
       user.controller.js
       wishlist.controller.js
       analytics.controller.js
    routes/
       auth.routes.js
       product.routes.js
       category.routes.js
       order.routes.js
       payment.routes.js
       review.routes.js
       coupon.routes.js
       gallery.routes.js
       user.routes.js
       wishlist.routes.js
       analytics.routes.js
    middleware/
       auth.middleware.js      # verifyToken
       role.middleware.js      # requireAdmin, requireSuperAdmin
       validate.middleware.js  # Zod schema validation
       upload.middleware.js    # Multer setup
       rateLimiter.js
    services/
       cloudinary.service.js
       email.service.js        # Nodemailer
       payment.service.js
    utils/
       generateToken.js
       hashPassword.js
       ApiError.js
    validations/
       auth.schema.js
       product.schema.js
       order.schema.js
       coupon.schema.js
    server.js
 prisma/
    schema.prisma
    seed.js
 .env
 .env.example
 package.json
```

---

## 5. Database Schema (PostgreSQL + Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//
// USER
//
model User {
  id                String    @id @default(cuid())
  name              String
  email             String    @unique
  password          String
  phone             String?
  role              Role      @default(USER)
  isActive          Boolean   @default(true)
  passwordResetToken String?
  passwordResetExp   DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  orders            Order[]
  reviews           Review[]
  wishlist          Wishlist[]
  addresses         Address[]
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

//
// ADDRESS
//
model Address {
  id          String   @id @default(cuid())
  userId      String
  label       String   // "Home", "Office" etc.
  fullName    String
  phone       String
  street      String
  city        String
  district    String
  postalCode  String?
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders      Order[]
}

//
// CATEGORY
//
model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  imageUrl    String?
  description String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())

  products    Product[]
}

//
// PRODUCT
//
model Product {
  id              String        @id @default(cuid())
  name            String
  slug            String        @unique
  description     String
  nutritionInfo   String?
  categoryId      String
  basePrice       Float                          // Original price per unit
  discountPercent Float         @default(0)      // Admin-set % discount (0 = no discount)
  discountAmount  Float         @default(0)      // Admin-set flat discount
  finalPrice      Float                          // Calculated: basePrice after discount
  unit            String        @default("kg")   // "kg", "piece", "dozen"
  minOrderQty     Float         @default(0.5)
  maxOrderQty     Float?
  stockQty        Float         @default(0)
  lowStockThreshold Float       @default(5)
  isAvailable     Boolean       @default(true)
  isFeatured      Boolean       @default(false)
  isBestSeller    Boolean       @default(false)
  isExclusive     Boolean       @default(false)  // For premium/exclusive variants
  exclusiveLabel  String?                        // e.g. "Haribhanga", "Gopalbhog"
  isSeasonal      Boolean       @default(false)
  seasonStart     DateTime?
  seasonEnd       DateTime?
  images          ProductImage[]
  tags            String[]      @default([])
  origin          String?       // e.g. "Rajshahi", "Chapainawabganj"
  harvestDate     DateTime?
  shelfLife       String?       // e.g. "3-5 days"
  sortOrder       Int           @default(0)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  category        Category      @relation(fields: [categoryId], references: [id])
  orderItems      OrderItem[]
  reviews         Review[]
  wishlist        Wishlist[]
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  url         String
  publicId    String   // Cloudinary public_id for deletion
  altText     String?
  isPrimary   Boolean  @default(false)
  sortOrder   Int      @default(0)

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

//
// GALLERY
//
model GalleryImage {
  id          String   @id @default(cuid())
  url         String
  publicId    String
  caption     String?
  category    GalleryCategory @default(FARM)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
}

enum GalleryCategory {
  FARM
  PACKAGING
  DELIVERY
  STORAGE
  TEAM
}

//
// COUPON
//
model Coupon {
  id              String      @id @default(cuid())
  code            String      @unique
  type            CouponType
  value           Float       // Percentage (e.g. 10 = 10%) or flat amount (e.g. 50 = 50)
  minOrderAmount  Float       @default(0)
  maxDiscount     Float?      // Max cap for percentage coupons
  usageLimit      Int?        // How many times total this coupon can be used
  usedCount       Int         @default(0)
  perUserLimit    Int         @default(1)
  isActive        Boolean     @default(true)
  expiresAt       DateTime?
  createdAt       DateTime    @default(now())

  orders          Order[]
}

enum CouponType {
  PERCENTAGE
  FIXED
}

//
// ORDER
//
model Order {
  id                String        @id @default(cuid())
  orderNumber       String        @unique  // e.g. TP-20240601-0001
  userId            String
  addressId         String
  couponId          String?
  couponDiscount    Float         @default(0)
  subtotal          Float
  deliveryCharge    Float         @default(0)
  totalAmount       Float
  status            OrderStatus   @default(PENDING)
  paymentMethod     PaymentMethod
  paymentStatus     PaymentStatus @default(UNPAID)
  specialNote       String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user              User          @relation(fields: [userId], references: [id])
  address           Address       @relation(fields: [addressId], references: [id])
  coupon            Coupon?       @relation(fields: [couponId], references: [id])
  items             OrderItem[]
  payment           Payment?
  statusHistory     OrderStatusHistory[]
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  productId   String
  productName String   // Snapshot at time of order
  unitPrice   Float    // Snapshot at time of order
  quantity    Float
  subtotal    Float

  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  status    OrderStatus
  note      String?
  changedAt DateTime    @default(now())

  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentMethod {
  BKASH
  NAGAD
  ROCKET
  CASH_ON_DELIVERY
  SSLCOMMERZ      // Placeholder for future integration
}

enum PaymentStatus {
  UNPAID
  PENDING_VERIFICATION
  PAID
  FAILED
  REFUNDED
}

//
// PAYMENT
//
model Payment {
  id              String        @id @default(cuid())
  orderId         String        @unique
  method          PaymentMethod
  senderNumber    String        // Customer's bKash/Nagad/Rocket number
  transactionId   String        // TrxID from MFS
  amount          Float
  status          PaymentStatus @default(PENDING_VERIFICATION)
  verifiedAt      DateTime?
  verifiedBy      String?       // Admin user ID
  rejectionNote   String?
  createdAt       DateTime      @default(now())

  order           Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

//
// REVIEW
//
model Review {
  id          String   @id @default(cuid())
  userId      String
  productId   String
  orderId     String?  // Only allow reviews for delivered orders
  rating      Int      // 1 to 5
  comment     String?
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  product     Product  @relation(fields: [productId], references: [id])
}

//
// WISHLIST
//
model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  productId String
  addedAt   DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

//
// DELIVERY CONFIG
//
model DeliveryConfig {
  id              String   @id @default(cuid())
  name            String   // e.g. "Inside Dhaka", "Outside Dhaka"
  charge          Float
  estimatedDays   String   // e.g. "1-2 days"
  isActive        Boolean  @default(true)
  updatedAt       DateTime @updatedAt
}

//
// SITE SETTINGS
//
model SiteSettings {
  id              String   @id @default(cuid())
  key             String   @unique
  value           String
  updatedAt       DateTime @updatedAt
}
// Keys: bkash_number, nagad_number, rocket_number,
//       free_delivery_threshold, maintenance_mode, etc.
```

---

## 6. Backend API  All Endpoints

### Base URL: `https://api.tropipine.com/api/v1`

### Auth: Routes marked `[AUTH]` require valid JWT cookie. `[ADMIN]` requires ADMIN or SUPER_ADMIN role. `[SUPER]` requires SUPER_ADMIN only.

---

### 6.1 Authentication  `/auth`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create new user account |
| POST | `/auth/login` | Public | Login, set HTTP-only cookie |
| POST | `/auth/logout` | [AUTH] | Clear auth cookie |
| GET | `/auth/me` | [AUTH] | Get current user profile |
| POST | `/auth/forgot-password` | Public | Send password reset email |
| POST | `/auth/reset-password/:token` | Public | Reset password with token |
| PATCH | `/auth/change-password` | [AUTH] | Change password |
| PATCH | `/auth/update-profile` | [AUTH] | Update name, phone |

---

### 6.2 Products  `/products`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | Get all products (with filters, pagination) |
| GET | `/products/:slug` | Public | Get single product by slug |
| GET | `/products/featured` | Public | Get featured products |
| GET | `/products/bestsellers` | Public | Get best sellers |
| GET | `/products/exclusive` | Public | Get exclusive/premium products |
| GET | `/products/seasonal` | Public | Get current seasonal products |
| GET | `/products/search?q=` | Public | Search products by name/tag |
| POST | `/products` | [ADMIN] | Create new product |
| PATCH | `/products/:id` | [ADMIN] | Update product details |
| PATCH | `/products/:id/price` | [ADMIN] | Update base price |
| PATCH | `/products/:id/discount` | [ADMIN] | Set discount (% or flat) |
| PATCH | `/products/:id/stock` | [ADMIN] | Update stock quantity |
| PATCH | `/products/:id/toggle-available` | [ADMIN] | Toggle availability |
| POST | `/products/:id/images` | [ADMIN] | Upload product images |
| DELETE | `/products/:id/images/:imageId` | [ADMIN] | Delete a product image |
| DELETE | `/products/:id` | [ADMIN] | Delete product |

**Query Params for GET /products:**
```
?category=mango
&minPrice=50
&maxPrice=500
&inStock=true
&isExclusive=true
&sortBy=price_asc | price_desc | newest | popular
&page=1
&limit=12
&search=haribhanga
```

---

### 6.3 Categories  `/categories`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | List all active categories |
| GET | `/categories/:slug` | Public | Get category with products |
| POST | `/categories` | [ADMIN] | Create category |
| PATCH | `/categories/:id` | [ADMIN] | Update category |
| DELETE | `/categories/:id` | [ADMIN] | Delete category |

---

### 6.4 Orders  `/orders`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/orders` | [AUTH] | Place a new order |
| GET | `/orders/my-orders` | [AUTH] | Get logged-in user's orders |
| GET | `/orders/my-orders/:id` | [AUTH] | Get single order detail |
| GET | `/orders` | [ADMIN] | Get all orders (with filters) |
| GET | `/orders/:id` | [ADMIN] | Get any order detail |
| PATCH | `/orders/:id/status` | [ADMIN] | Update order status |
| PATCH | `/orders/:id/cancel` | [AUTH] | Cancel order (PENDING only) |

**Query Params for Admin GET /orders:**
```
?status=PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED
&paymentStatus=UNPAID | PENDING_VERIFICATION | PAID
&paymentMethod=BKASH | NAGAD | ROCKET | CASH_ON_DELIVERY
&startDate=2024-01-01
&endDate=2024-12-31
&search=TP-2024
&page=1
&limit=20
```

---

### 6.5 Payments  `/payments`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/payments/submit` | [AUTH] | Submit MFS payment info (TrxID, number, method) |
| GET | `/payments` | [ADMIN] | List all payments (filterable) |
| GET | `/payments/:id` | [ADMIN] | View payment detail |
| PATCH | `/payments/:id/verify` | [ADMIN] | Approve payment, mark order CONFIRMED |
| PATCH | `/payments/:id/reject` | [ADMIN] | Reject payment with note |
| GET | `/payments/config` | Public | Get MFS numbers (bKash, Nagad, Rocket) |
| PATCH | `/payments/config` | [SUPER] | Update MFS numbers |

---

### 6.6 Coupons  `/coupons`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/coupons/validate` | [AUTH] | Validate coupon code + return discount |
| GET | `/coupons` | [ADMIN] | List all coupons |
| POST | `/coupons` | [ADMIN] | Create new coupon |
| PATCH | `/coupons/:id` | [ADMIN] | Update coupon |
| PATCH | `/coupons/:id/toggle` | [ADMIN] | Enable/disable coupon |
| DELETE | `/coupons/:id` | [ADMIN] | Delete coupon |

---

### 6.7 Reviews  `/reviews`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/reviews/product/:productId` | Public | Get approved reviews for a product |
| POST | `/reviews` | [AUTH] | Submit a review (order must be DELIVERED) |
| GET | `/reviews` | [ADMIN] | Get all reviews |
| PATCH | `/reviews/:id/approve` | [ADMIN] | Approve review |
| DELETE | `/reviews/:id` | [ADMIN] | Delete review |

---

### 6.8 Wishlist  `/wishlist`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/wishlist` | [AUTH] | Get user's wishlist |
| POST | `/wishlist/:productId` | [AUTH] | Add product to wishlist |
| DELETE | `/wishlist/:productId` | [AUTH] | Remove from wishlist |

---

### 6.9 Addresses  `/addresses`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/addresses` | [AUTH] | Get user's saved addresses |
| POST | `/addresses` | [AUTH] | Add new address |
| PATCH | `/addresses/:id` | [AUTH] | Update address |
| PATCH | `/addresses/:id/default` | [AUTH] | Set as default |
| DELETE | `/addresses/:id` | [AUTH] | Delete address |

---

### 6.10 Gallery  `/gallery`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/gallery` | Public | Get all gallery images |
| POST | `/gallery` | [ADMIN] | Upload gallery image |
| PATCH | `/gallery/:id` | [ADMIN] | Update caption / sort order |
| DELETE | `/gallery/:id` | [ADMIN] | Delete gallery image |

---

### 6.11 Users (Admin)  `/users`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/users` | [ADMIN] | List all customers |
| GET | `/users/:id` | [ADMIN] | View user detail + order history |
| PATCH | `/users/:id/toggle-active` | [ADMIN] | Activate / deactivate user |
| PATCH | `/users/:id/role` | [SUPER] | Change user role |

---

### 6.12 Analytics  `/analytics`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/analytics/overview` | [ADMIN] | Total sales, orders, revenue, customers |
| GET | `/analytics/revenue?period=` | [ADMIN] | Revenue by day/week/month |
| GET | `/analytics/top-products` | [ADMIN] | Best-selling products |
| GET | `/analytics/order-statuses` | [ADMIN] | Order count by status |
| GET | `/analytics/low-stock` | [ADMIN] | Products below threshold |

---

### 6.13 Delivery Config  `/delivery`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/delivery` | Public | Get delivery zones and charges |
| POST | `/delivery` | [ADMIN] | Add delivery zone |
| PATCH | `/delivery/:id` | [ADMIN] | Update delivery zone |
| DELETE | `/delivery/:id` | [ADMIN] | Remove delivery zone |

---

## 7. Frontend  User Website

### 7.1 Routing (React Router v6)

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/shop" element={<ShopPage />} />
  <Route path="/shop/:slug" element={<ProductDetailPage />} />
  <Route path="/category/:slug" element={<ShopPage />} />
  <Route path="/exclusive" element={<ShopPage filter="exclusive" />} />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
  <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
  <Route path="/order-success/:id" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
  <Route path="/orders" element={<PrivateRoute><ProfilePage tab="orders" /></PrivateRoute>} />
  <Route path="/orders/:id" element={<PrivateRoute><OrderTrackingPage /></PrivateRoute>} />
  <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
  <Route path="/gallery" element={<GalleryPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
  <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
</Routes>
```

---

### 7.2 Homepage Sections

**Hero Section:**
- Full-width banner with tropical image background
- Headline: "Fresh From the Farm, Straight to Your Door"
- CTA buttons: "Shop Now", "See Exclusive Picks"
- Animated fruit elements with Framer Motion

**Exclusive Stock Section** (prominent placement, before Featured):
- Title: " Exclusive Premium Collection"
- Horizontal scroll row of exclusive products
- Each card shows: gold "Exclusive" badge, variety label (e.g. "Haribhanga Mango"), origin, price
- "Limited Stock" red indicator if stock < 10

**Featured Products Section:**
- Grid of 8 featured products
- ProductCard shows: image, name, category, price, discounted price (if applicable), Add to Cart button

**Seasonal Offers Banner:**
- Dynamic banner based on current seasonal products
- Auto-generated based on `isSeasonal = true` and date range

**Best Sellers:**
- 46 product cards flagged `isBestSeller = true`

**Delivery Info Strip:**
- Icons:  Fast Delivery |  Farm Fresh |  Secure Payment |  Safe Packaging

**Testimonials:**
- 34 customer reviews in a carousel

---

### 7.3 Shop Page

- Left sidebar: Category filter, Price range slider, In-stock only toggle, Exclusive only toggle
- Top bar: Search input, Sort dropdown (Newest, Price , Popular), Results count
- Product grid: 3 columns (desktop), 2 (tablet), 1 (mobile)
- Pagination: Page-based (12 per page)
- Each ProductCard:
  - Primary image (hover shows second image if exists)
  - Category badge
  - Exclusive badge (gold) if `isExclusive`
  - Name and origin
  - Price  if discounted, show original strikethrough + discounted price in green
  - Stock badge: "In Stock" / "Low Stock (3 left)" / "Out of Stock"
  - Add to Cart / View buttons

---

### 7.4 Product Detail Page

- Image gallery: main image + thumbnails, click to zoom
- Product name, exclusive label, origin, harvest date
- Ratings summary (average + count)
- Price display:
  - If discount active: show original price (strikethrough) + sale price + "X% OFF" badge
- Quantity selector (respects min/max order qty and unit)
- Stock status indicator (live from API)
- Add to Cart + Add to Wishlist buttons
- Tabs: Description | Nutrition Info | Shelf Life & Storage | Reviews
- Related products section (same category)

---

### 7.5 Cart System

- Persistent cart stored in Redux (localStorage sync for guests, API sync for logged-in users)
- CartDrawer (slide-in from right) on desktop; full page on mobile
- Line items: image, name, unit, price, quantity stepper, remove button
- Coupon input: enter code  validate via API  show discount applied
- Order summary: Subtotal, Coupon Discount (if any), Delivery Charge, **Total**
- Proceed to Checkout button

---

### 7.6 Checkout Page

Three-step flow (stepper UI):

**Step 1  Delivery Address:**
- Show saved addresses (if logged in) with radio select
- Option to add new address
- Delivery zone selector  updates delivery charge

**Step 2  Payment:**
- Payment method selector: bKash | Nagad | Rocket | Cash on Delivery
- On selecting MFS method, show:
  - Merchant number to send money to
  - Instructions: "Send {totalAmount} to {merchantNumber} and enter the transaction ID below"
  - Input: Your {bKash/Nagad/Rocket} number
  - Input: Transaction ID (TrxID)
- Note: "Your order will be confirmed after payment verification (usually within 1 hour)"
- Cash on Delivery: available only if enabled in SiteSettings

**Step 3  Review & Place Order:**
- Summary of items, address, payment method
- Special note input
- Place Order button
- On success: redirect to /order-success/:id

---

### 7.7 Order Tracking Page

- Order number, placed date
- Status timeline stepper:
  ```
   Order Placed   Confirmed   Processing   Shipped   Delivered
  ```
- Each status shows timestamp
- Payment status badge
- Order items list
- Delivery address

---

### 7.8 User Profile

Tabs:
- **My Orders**  list with status, order number, total, date, View button
- **Saved Addresses**  manage addresses
- **Wishlist**  shortcut to wishlist page
- **Account Settings**  name, phone, password change

---

## 8. Frontend  Admin Dashboard

### 8.1 Admin Routing

```jsx
<Routes>
  <Route path="/login" element={<AdminLoginPage />} />
  <Route element={<AdminPrivateRoute />}>
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="products" element={<ProductListPage />} />
      <Route path="products/add" element={<AddProductPage />} />
      <Route path="products/edit/:id" element={<EditProductPage />} />
      <Route path="orders" element={<OrderListPage />} />
      <Route path="orders/:id" element={<OrderDetailPage />} />
      <Route path="payments" element={<PaymentVerificationPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="discounts/coupons" element={<CouponListPage />} />
      <Route path="discounts/coupons/add" element={<AddCouponPage />} />
      <Route path="discounts/products" element={<ProductDiscountPage />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="customers" element={<CustomerListPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Route>
</Routes>
```

---

### 8.2 Admin Dashboard Page

**Stat Cards (top row):**
- Today's Revenue ()
- Total Orders (with pending count badge)
- Pending Payment Verifications (urgent badge if > 0)
- Low Stock Products (alert if any)

**Charts:**
- Revenue chart: last 30 days (line chart using Recharts)
- Orders by status: donut chart
- Top 5 products this week: bar chart

**Quick Action Buttons:**
- Add New Product
- Verify Payments
- View Pending Orders

---

### 8.3 Product Management

**Product List:**
- Table: Image thumbnail | Name | Category | Base Price | Discount | Final Price | Stock | Status | Actions
- Inline quick-edit for stock quantity
- Bulk actions: toggle availability, delete

**Add/Edit Product Form:**
- Name, slug (auto-generated)
- Category dropdown
- Description (textarea), Nutrition Info, Shelf Life
- Base price, unit (kg/piece/dozen)
- Min/max order quantity
- Stock quantity, low stock threshold
- Discount section:
  - Discount type: None | Percentage | Flat Amount
  - Discount value input
  - Final price preview (auto-calculated)
- Flags: Featured  | Best Seller  | Exclusive  | Seasonal
- Exclusive label input (shows if Exclusive is checked)
- Season start/end dates (shows if Seasonal is checked)
- Origin, harvest date
- Image upload: drag-and-drop, multiple images, set primary
- Tags input

---

### 8.4 Order Management

**Order List:**
- Filterable by status, payment status, payment method, date range
- Table: Order # | Customer | Items | Total | Payment | Status | Date | Actions
- Color-coded status badges

**Order Detail:**
- Customer info, delivery address
- Ordered items with snapshots
- Payment info (method, TrxID if MFS, status)
- Status update dropdown (with note input)
- Status history timeline
- Print/download invoice button

---

### 8.5 Payment Verification Page

> This is a dedicated page  the most time-sensitive admin page.

- Tabs: **Pending Verification** | **Verified** | **Rejected**
- Each pending payment card shows:
  - Order number and customer name
  - Amount to verify
  - Payment method (bKash/Nagad/Rocket) with logo
  - Sender's number
  - Transaction ID (TrxID)  prominent display
  - Time since submission
  - [ Verify] and [ Reject] buttons
- On Verify  order status changes to CONFIRMED, payment status  PAID
- On Reject  admin enters rejection note, customer can resubmit

---

### 8.6 Discount Management

**Product Discount Page:**
- Table of all products with current discount
- Inline edit: set discount type and value per product
- Bulk discount: apply same discount to entire category
- "Clear Discount" button per product

**Coupon Management:**
- Create coupons with: code, type (% or flat), value, min order, max discount cap, usage limit, per-user limit, expiry date
- List view with usage stats (X/N used)
- Enable/disable toggle per coupon

---

### 8.7 Inventory Management

- Table: Product | Category | Stock Qty | Unit | Low Stock Threshold | Status
- Inline stock quantity update
- Low stock filter tab
- Out of stock filter tab
- Sort by stock ascending

---

### 8.8 Settings Page (Super Admin only)

- bKash merchant number
- Nagad merchant number
- Rocket merchant number
- Free delivery threshold amount
- Cash on delivery: enabled/disabled
- Maintenance mode toggle
- Delivery zone management

---

## 9. Payment System (bKash / Nagad / Rocket)

### 9.1 Flow Overview

```
Customer selects bKash/Nagad/Rocket at checkout

System shows merchant number + amount to send

Customer sends money via their MFS app

Customer enters: sender number + Transaction ID (TrxID)

Order placed with status: PENDING, PaymentStatus: PENDING_VERIFICATION

Admin receives notification on dashboard

Admin manually verifies TrxID  clicks Verify

Order status  CONFIRMED, PaymentStatus  PAID

Customer sees order confirmed on tracking page
```

### 9.2 Data Stored for Each MFS Payment

```json
{
  "orderId": "order_id",
  "method": "BKASH",
  "senderNumber": "01XXXXXXXXX",
  "transactionId": "ABC123XYZ",
  "amount": 850.00,
  "status": "PENDING_VERIFICATION"
}
```

### 9.3 Backend Logic

```javascript
// POST /payments/submit
// 1. Verify order belongs to user
// 2. Verify amount matches order total
// 3. Check TrxID not already used (unique constraint)
// 4. Save payment record
// 5. Update order paymentStatus to PENDING_VERIFICATION
// 6. Return success

// PATCH /payments/:id/verify (Admin)
// 1. Load payment
// 2. Update payment status  PAID, set verifiedAt, verifiedBy
// 3. Update order status  CONFIRMED
// 4. Add status history entry
// 5. Send confirmation email to customer (optional)

// PATCH /payments/:id/reject (Admin)
// 1. Update payment status  FAILED
// 2. Save rejection note
// 3. Order status remains PENDING
// 4. Customer can resubmit payment
```

### 9.4 SSLCommerz Placeholder

```javascript
// routes/payment.routes.js
router.post('/sslcommerz/init', requireAuth, (req, res) => {
  res.status(503).json({
    message: 'SSLCommerz integration coming soon. Please use bKash, Nagad, or Rocket.'
  });
});
```

---

## 10. Discount & Coupon System

### 10.1 Product-Level Discount (Admin-set)

Admin can set discount per product:
- **Percentage:** `finalPrice = basePrice - (basePrice * discountPercent / 100)`
- **Flat:** `finalPrice = basePrice - discountAmount`
- `finalPrice` is stored in DB and updated whenever admin changes price or discount
- Frontend always displays `finalPrice` as the active price
- If no discount: `finalPrice = basePrice`

Price change trigger logic (backend):
```javascript
// When admin updates basePrice or discount:
const finalPrice = calculateFinalPrice(basePrice, discountType, discountValue);
await prisma.product.update({ where: { id }, data: { basePrice, discountPercent, discountAmount, finalPrice } });
```

### 10.2 Coupon System

Validation endpoint (`POST /coupons/validate`):
```javascript
// 1. Find coupon by code
// 2. Check isActive, not expired, usageLimit not reached
// 3. Check perUserLimit not exceeded for this user
// 4. Check minOrderAmount satisfied
// 5. Calculate discount:
//    PERCENTAGE: min(cartTotal * value/100, maxDiscount ?? Infinity)
//    FIXED: min(value, cartTotal)
// 6. Return: { valid: true, discountAmount, couponId }
```

### 10.3 UI Display

- Original price shown with strikethrough when discounted
- "X% OFF" badge (green/red pill) on product cards
- Coupon discount shown as a line item in cart summary: `- {amount} (Coupon: SUMMER10)`

---

## 11. Exclusive Stock System

### 11.1 What "Exclusive" Means

Exclusive products are premium, high-quality variants of fruits  e.g.:
- **Haribhanga Mango** (origin: Rajshahi)
- **Gopalbhog Mango** (origin: Chapainawabganj)
- **Langra Mango** (origin: Dinajpur)
- **Khirsapat/Himsagar Mango**

These products have:
- `isExclusive = true`
- `exclusiveLabel` field (e.g. "Haribhanga")
- Typically higher `basePrice`
- Special gold "Exclusive" badge in UI
- Separate section on homepage
- Filterable in shop with "Exclusive Only" toggle

### 11.2 Homepage Exclusive Section

```jsx
<section className="exclusive-section">
  <div className="section-header">
    <GoldCrownIcon />
    <h2> Exclusive Premium Collection</h2>
    <p>Handpicked, superior-grade varieties  limited quantities available</p>
  </div>
  <HorizontalScrollRow products={exclusiveProducts} />
</section>
```

Each exclusive product card shows:
- Gold border / gold badge: "Exclusive"
- `exclusiveLabel` below the product name
- Origin: "From Rajshahi"
- Price (premium)
- Stock urgency if stock < 10: "Only {n} kg left!"

---

## 12. Security Implementation

### 12.1 Authentication

```javascript
// JWT stored in HTTP-only cookie (not localStorage)
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### 12.2 Middleware Stack (server.js)

```javascript
app.use(helmet());                          // Secure HTTP headers
app.use(cors(corsOptions));                 // Whitelist: tropipine.com, admin.tropipine.com
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/api/v1/auth/login', loginLimiter); // Rate limit login: 10 req/15 min
app.use('/api/v1/auth/register', registerLimiter);
app.use('/api/v1', router);
app.use(errorHandler);                      // Global error handler
```

### 12.3 Role Middleware

```javascript
// middleware/role.middleware.js
const requireAdmin = (req, res, next) => {
  if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }
  next();
};
```

### 12.4 Input Validation with Zod

```javascript
// validations/product.schema.js
const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  basePrice: z.number().positive(),
  stockQty: z.number().min(0),
  categoryId: z.string().cuid(),
  // ...
});
```

### 12.5 Other Security Practices

- Passwords hashed with bcrypt (salt rounds: 12)
- All DB queries through Prisma (parameterized  no SQL injection)
- Cloudinary for images (no local file storage)
- `.env` files gitignored, `.env.example` committed
- HTTPS enforced in production
- Admin frontend on separate subdomain  admin routes never referenced in user bundle
- Transaction IDs stored with unique constraint  prevents duplicate payment submissions

---

## 13. UI/UX Guidelines

### 13.1 Design Language

| Property | Value |
|---|---|
| Primary Color | `#2D6A4F` (deep tropical green) |
| Accent Color | `#F4A261` (warm mango orange) |
| Exclusive Gold | `#C9A84C` |
| Background | `#FAFAF7` (warm off-white) |
| Text Primary | `#1A1A1A` |
| Text Secondary | `#6B7280` |
| Error | `#DC2626` |
| Success | `#16A34A` |
| Font | Inter (body), Playfair Display (headings) |
| Border Radius | `rounded-2xl` cards, `rounded-full` badges/buttons |
| Shadow | Soft shadows: `shadow-sm` default, `shadow-md` hover |

### 13.2 Component Rules

- **ProductCard:** Consistent 4:3 image ratio, always show price (never blank)
- **Badges:** Color-coded  green (in stock), yellow (low stock), red (out of stock), gold (exclusive), orange (discount %)
- **Buttons:** Primary = green filled, Secondary = green outline, Danger = red
- **Loading States:** Skeleton loaders (not spinners) for product grids
- **Empty States:** Illustrated empty states with CTA (e.g. "No products found  Browse All")
- **Mobile Nav:** Bottom navigation bar (Home, Shop, Cart, Profile)
- **Toast Notifications:** Bottom-right, auto-dismiss 3s (success green, error red)

### 13.3 Framer Motion Usage

```jsx
// Page transitions
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

// Product card hover
whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}

// Cart drawer
initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}

// Exclusive badge pulse
animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
```

### 13.4 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Mobile (< 640px) | 1 column, bottom nav |
| Tablet (6401024px) | 2 columns, top nav |
| Desktop (> 1024px) | 3 columns + sidebar, top nav |

---

## 14. Development Phases

### Phase 1  Project Setup (Day 12)

- [ ] Create 3 GitHub repos: `tropipine-client`, `tropipine-admin`, `tropipine-server`
- [ ] Initialize backend: `npm init`, install Express, Prisma, bcrypt, jsonwebtoken, cookie-parser, helmet, cors, multer, cloudinary, zod, nodemailer
- [ ] Initialize Prisma: `npx prisma init`, write full `schema.prisma`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Run `npx prisma db seed` (seed categories, sample products, super admin user)
- [ ] Initialize both React apps with Vite + Tailwind + Redux Toolkit
- [ ] Setup `.env` files, configure CORS

---

### Phase 2  Backend Core (Day 38)

- [ ] Auth system: register, login, logout, forgot/reset password, JWT middleware
- [ ] Category CRUD
- [ ] Product CRUD with image upload (Multer  Cloudinary)
- [ ] Price and discount update logic
- [ ] Stock management
- [ ] Order placement logic (validate cart, apply coupon, calculate delivery charge, create order + items)
- [ ] Order status management + history
- [ ] Payment submission and verification endpoints
- [ ] Coupon validation and management
- [ ] Wishlist endpoints
- [ ] Address endpoints
- [ ] Review endpoints
- [ ] Gallery endpoints
- [ ] Analytics endpoints
- [ ] Delivery config endpoints

---

### Phase 3  User Frontend (Day 918)

- [ ] Setup Redux store, RTK Query API slices
- [ ] Navbar + Footer + layout
- [ ] Home page: Hero, Exclusive Section, Featured, Seasonal, Bestsellers, Testimonials, Delivery strip
- [ ] Shop page: filters, search, sort, product grid, pagination
- [ ] Product detail page: gallery, price display, quantity, add to cart, reviews tab
- [ ] Cart system: Redux cart, CartDrawer, coupon input, totals
- [ ] Checkout: 3-step flow, address selection, MFS payment instructions + TrxID input
- [ ] Order success page and order tracking page
- [ ] Wishlist page
- [ ] User profile (orders tab, address tab, settings tab)
- [ ] Auth pages: login, register, forgot password, reset password
- [ ] Gallery page
- [ ] About page
- [ ] Responsive mobile layout (bottom nav, mobile filters)

---

### Phase 4  Admin Dashboard (Day 1926)

- [ ] Admin login (separate auth flow)
- [ ] Admin layout: sidebar, top bar
- [ ] Dashboard: stat cards, charts (Recharts)
- [ ] Product list + add/edit form with image upload
- [ ] Order list + order detail + status update
- [ ] Payment verification page (pending, verified, rejected tabs)
- [ ] Inventory management (inline stock edit)
- [ ] Coupon management (CRUD)
- [ ] Product discount management (bulk + individual)
- [ ] Gallery management (upload, reorder, delete)
- [ ] Customer list + detail
- [ ] Analytics page (revenue charts, top products)
- [ ] Settings page (MFS numbers, delivery config)

---

### Phase 5  Testing (Day 2730)

- [ ] Test all API endpoints (Postman / Thunder Client)
- [ ] Test auth flow (register, login, token expiry)
- [ ] Test full checkout flow with MFS payment
- [ ] Test admin payment verification flow
- [ ] Test discount and coupon calculation
- [ ] Test exclusive product filtering
- [ ] Test stock updates and low-stock alerts
- [ ] Mobile responsiveness testing (Chrome DevTools + real device)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Test edge cases: out of stock add to cart, invalid coupon, duplicate TrxID

---

### Phase 6  Deployment (Day 3133)

- [ ] Deploy backend to Render/Railway, set environment variables
- [ ] Deploy database to Neon, run production migrations
- [ ] Deploy user frontend to Vercel, set env vars
- [ ] Deploy admin frontend to Vercel (separate project), set env vars
- [ ] Configure custom domains: `tropipine.com`, `api.tropipine.com`, `admin.tropipine.com`
- [ ] Enable HTTPS on all domains (Vercel handles frontend, Render handles backend)
- [ ] Test full production flow end to end
- [ ] Setup Cloudinary production environment

---

## 15. Environment Variables

### Backend  `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/tropipine?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email (Nodemailer  for password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="TropiPine <noreply@tropipine.com>"

# App
NODE_ENV="development"
PORT=5000
CLIENT_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"

# SSLCommerz (placeholder  configure later)
SSLCOMMERZ_STORE_ID=""
SSLCOMMERZ_STORE_PASS=""
SSLCOMMERZ_IS_LIVE=false
```

### User Frontend  `.env`

```env
VITE_API_URL="http://localhost:5000/api/v1"
VITE_APP_NAME="TropiPine"
```

### Admin Frontend  `.env`

```env
VITE_API_URL="http://localhost:5000/api/v1"
VITE_APP_NAME="TropiPine Admin"
```

---

## 16. Deployment Guide

### Backend (Render)

1. Connect GitHub repo `tropipine-server` to Render
2. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
3. Start command: `node src/server.js`
4. Add all env variables in Render dashboard
5. Set custom domain: `api.tropipine.com`

### Frontend  User (Vercel)

1. Connect `tropipine-client` to Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env vars in Vercel dashboard
6. Set custom domain: `tropipine.com`

### Frontend  Admin (Vercel)

1. Connect `tropipine-admin` to Vercel (separate project)
2. Same build settings as user frontend
3. Set custom domain: `admin.tropipine.com`
4. Consider adding HTTP Basic Auth at Vercel edge level as extra security layer

### Database (Neon)

1. Create project at neon.tech
2. Copy connection string to `DATABASE_URL` env var
3. Run `npx prisma migrate deploy` from backend server on first deploy
4. Enable connection pooling for production

---

## Key Development Notes for Copilot Agent

1. **Always calculate `finalPrice` server-side** when price or discount changes  never trust client-sent finalPrice
2. **Snapshot product prices in `OrderItem`**  store `productName` and `unitPrice` at order time so price changes don't affect historical orders
3. **Transaction ID uniqueness**  add unique constraint on `transactionId` in Payment model to prevent duplicate payment submissions
4. **Cart is client-side (Redux + localStorage)**  sync to server only on checkout
5. **Prisma `updatedAt`**  all price and stock fields should trigger `updatedAt` for audit trail
6. **Admin app has its own login**  uses same `/auth/login` endpoint but validates `role === 'ADMIN' || 'SUPER_ADMIN'` before allowing dashboard access
7. **Exclusive products** filter: `GET /products?isExclusive=true`  use the same product endpoint with query params
8. **Image primary flag**  `ProductImage.isPrimary = true` for the first/main image; use this in product cards
9. **Low stock badge**  show when `stockQty <= lowStockThreshold`, computed server-side in product response
10. **Delivery charge**  fetched from `DeliveryConfig` based on zone selected at checkout; stored in `Order.deliveryCharge` as snapshot
11. **Order number format**  generate as `TP-YYYYMMDD-{4-digit-sequence}` using a DB sequence or timestamp-based logic
12. **Review gating**  only allow review submission if user has a DELIVERED order containing that product
13. **Coupon per-user limit**  check by counting orders where `couponId = X` and `userId = Y`

---

*Document Version: 2.0 | TropiPine PERN Stack Full Workflow*
*Last Updated: 2025*
