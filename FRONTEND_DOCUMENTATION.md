# GearNest Frontend Documentation — Web Application Architecture & Reference

> **System:** `gearnest-web`  
> **Framework:** Next.js 16+ (App Router), React 19, TypeScript/JavaScript  
> **UI System:** shadcn/ui (Tailwind CSS v4 + Radix Primitives), Atomic Design Architecture  
> **Animation Engine:** GSAP & ScrollTrigger  
> **State & HTTP:** Zustand 5 (Persist), Axios, Sonner  

---

## SECTION 1 — Overview & Tech Stack

### 1.1 Application Overview

`gearnest-web` is the single-page application (SPA) frontend for **GearNest**, a modern outdoor gear rental and booking platform. It provides a seamless, high-performance user interface for outdoor enthusiasts to browse, filter, reserve, and pay for premium outdoor gear (tents, backpacks, sleeping bags, stoves, etc.), as well as a comprehensive control panel for administrators to manage inventory, bookings, identity verification, and financial reporting.

The frontend is architected as a **decoupled, client-first Next.js application** that communicates with the `gearnest-api` backend exclusively through asynchronous HTTP REST requests. It contains no direct database connectivity or server-side data persistence; all domain logic, validation, payment processing (Midtrans Snap), and data persistence reside within the backend.

### 1.2 Technology Stack

| Layer | Technology | Role & Decision Rationale |
|---|---|---|
| **Framework** | Next.js 16+ (App Router) | Provides modern file-based routing, route groups `(main)`, client/server component boundaries, and fast bundle optimization. |
| **View Library** | React 19 | Declarative UI rendering, custom hooks, reactive state updates, and component reusability. |
| **UI Components** | shadcn/ui (Radix Primitives) | Accessible, unstyled primitives (`Button`, `Card`, `Input`, `Select`, `Badge`, `Skeleton`, `Table`, etc.) styled with custom design tokens. |
| **Component Architecture** | Atomic Design | Strict separation into `ui` (primitives), `atoms`, `molecules`, `organisms`, and `templates` for extreme modularity and clean maintenance. |
| **Animation Engine** | GSAP 3 & ScrollTrigger | Delivers smooth hero entrance animations, staggered grid entrances, parallax depth, and scroll-triggered reveals (`Reveal.jsx`). |
| **State Management** | Zustand 5 | Lightweight global state management for client-side authentication (`useAuthStore`) with local storage persistence and cart management (`useCartStore`). |
| **HTTP Client** | Axios | Centralized HTTP library configured with request token injection and global `401 Unauthorized` interceptors. |
| **Styling & Tokens** | Tailwind CSS v4 | Utility-first styling configured with "Basecamp Modern" custom color palettes and typography scales. |
| **Icons & Notifications** | Lucide React & Sonner | Clean vector icons and interactive toast notifications for user actions. |
| **Data Visualization** | Recharts | Responsive charts for admin revenue, category breakdown, booking status, and busiest periods. |

---

## SECTION 2 — Architecture & Data Flow

### 2.1 Decoupled Client-Server Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GEARNEST WEB (Next.js 16)                             │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │   Pages/Routes  │───>│  Atomic Comps   │───>│   Zustand Stores            │  │
│  │   (App Router)  │    │ (Orgs/Molecules)│    │ (useAuthStore/useCartStore) │  │
│  └────────┬────────┘    └─────────────────┘    └──────────────┬──────────────┘  │
│           │                                                   │                 │
│           ▼                                                   ▼                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                     Axios HTTP Client (lib/axios.js)                      │  │
│  │    • Interceptor 1: Injects "Authorization: Bearer <token>"               │  │
│  │    • Interceptor 2: Handles 401 Unauthorized → Auto Logout & Redirect    │  │
│  └────────────────────────────────────┬──────────────────────────────────────┘  │
└───────────────────────────────────────┼─────────────────────────────────────────┘
                                        │ HTTP REST (JSON Envelope)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GEARNEST API (Laravel 12)                             │
│  • Sanctum Authentication   • Business Logic Validation   • Midtrans Payment   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 End-to-End User Workflows

#### 1. Authentication & Unified Login Flow
1. User navigates to `/login` (Full-screen portal without header/footer).
2. Form submits credentials (`email`, `password`) via `POST /api/login`.
3. Upon success, backend returns `{ user, token }`.
4. `useAuthStore.setAuth(user, token, role)` stores credentials in state and persists to `localStorage`.
5. **Role Routing**:
   - `role === 'admin'`: Redirected immediately to `/admin/dashboard`.
   - `role === 'customer'`: Redirected to target page (e.g., `/` or `/checkout`).
6. If any API request returns `401 Unauthorized`, the Axios response interceptor triggers `useAuthStore.logout()` and redirects to `/login`.

#### 2. Gear Catalog & Browsing Flow
1. User navigates to `/gears`.
2. Component sends `GET /api/gears` with active query parameters (`search`, `category`, `sort_by`, `sort_order`, `page`, `limit=8`).
3. Backend returns paginated gear items and `meta` page information.
4. `GearCard` molecules render items with stock badges and price per day.
5. Search inputs and filter selects update component state and trigger server-side re-fetching.

#### 3. Cart & Booking Checkout Flow
1. User clicks "Tambah ke Keranjang" on a `GearCard`. Item is added to `useCartStore` in browser state.
2. User opens `/cart`, selects rental start date and end date, and chooses delivery method (`pickup` or `delivery`).
3. User proceeds to `/checkout` (guarded by `RequireAuth`).
4. User agrees to identity verification requirements and submits booking via `POST /api/bookings`.
5. Frontend requests payment URL via `POST /api/bookings/{id}/payment`.
6. Frontend redirects user to Midtrans Snap payment gateway.
7. Upon completing payment, user is returned to `/account` to view booking status and print official rental receipt notes.

#### 4. Admin Management Flow
1. Admin logs in via `/login` and is redirected to `/admin/dashboard`.
2. `AdminShell` (guarded with `RequireAuth(admin=true)`) renders dark-mode toggle, responsive sidebar, and header.
3. Dashboard fetches `/api/admin/reports/dashboard`, `/api/admin/reports/popular-gear`, `/api/admin/reports/low-stock`, and `/api/admin/bookings`.
4. Admin can update booking statuses (`pending`, `confirmed`, `active`, `returned`, `cancelled`) or toggle identity verification status (`verified: true/false`).

---

## SECTION 3 — State Management

GearNest Frontend uses **Zustand** for state management due to its minimal boilerplate, hook-based API, and built-in `persist` middleware.

### 3.1 Auth Store (`src/store/useAuthStore.js`)

Manages client authentication state, token storage, and user role authorization.

#### State Structure

| Field | Type | Description |
|---|---|---|
| `user` | `UserObject \| null` | Authenticated user profile (`{ id, name, email, phone, role }`). |
| `token` | `string \| null` | Sanctum Bearer authentication token. |
| `role` | `'admin' \| 'customer' \| null` | User authorization role. |

#### Actions & Methods

| Method | Signature | Description |
|---|---|---|
| `setAuth` | `(user, token, role) => void` | Updates state with user info, Bearer token, and role. |
| `logout` | `() => void` | Clears all authentication state and removes token from storage. |
| `isAuthenticated` | `() => boolean` | Returns `true` if valid token exists. |

#### Persistence Strategy
Uses Zustand `persist` middleware storing state under `localStorage` key `'gearnest-auth'`. Automatically rehydrates upon app launch.

---

### 3.2 Cart Store (`src/store/useCartStore.js`)

Manages transient client-side rental cart, rental dates, and delivery preferences.

#### State Structure

| Field | Type | Description |
|---|---|---|
| `items` | `CartItem[]` | Array of items `{ gear: GearObject, quantity: number }`. |
| `startDate` | `string` | Rental start date formatted as `YYYY-MM-DD`. |
| `endDate` | `string` | Rental end date formatted as `YYYY-MM-DD`. |
| `deliveryType` | `'pickup' \| 'delivery'` | Choice of pickup at basecamp or location delivery. |
| `deliveryAddress` | `string` | Full address required for delivery option. |
| `deliveryDistanceKm` | `number` | Estimated distance in kilometers (default: 5km). |

#### Actions & Computed Helpers

| Method | Signature | Description |
|---|---|---|
| `addItem` | `(gear, quantity = 1) => void` | Adds gear or increments quantity if already present. |
| `removeItem` | `(gearId) => void` | Removes specific gear item from cart. |
| `updateQuantity` | `(gearId, quantity) => void` | Sets exact item quantity (removes if <= 0). |
| `setBookingDates` | `(start, end) => void` | Updates rental start and end dates. |
| `setDeliveryInfo` | `(type, address, distance) => void` | Updates delivery preferences and distance. |
| `clearCart` | `() => void` | Empties cart and resets delivery preferences. |
| `getDurationDays` | `() => number` | Calculates total rental duration in days (minimum 1 day). |
| `getSubtotal` | `() => number` | Sums `gear.price_per_day * quantity * durationDays`. |
| `getDeliveryFee` | `() => number` | Calculates fee: `Rp 0` for pickup; `Rp 10.000 + (Rp 3.000 * km)` for delivery. |
| `getTotalPrice` | `() => number` | Returns `getSubtotal() + getDeliveryFee()`. |

#### Persistence Strategy
Uses Zustand `persist` middleware under `localStorage` key `'gearnest-cart'`.

---

## SECTION 4 — Code Structure & Atomic Architecture

The application adopts **Atomic Design Principles** combined with Next.js App Router route groups.

```
src/
├── app/
│   ├── layout.jsx                      # Root layout (fonts, Toaster notification root)
│   ├── login/page.jsx                  # Standalone portal login (No chrome)
│   ├── register/page.jsx               # Standalone portal register (No chrome)
│   └── (main)/                         # Route Group (Wrapped with SiteHeader & SiteFooter)
│       ├── layout.jsx                  # Main public layout (SiteHeader + Main + SiteFooter)
│       ├── page.jsx                    # Landing page orchestrator
│       ├── about/page.jsx              # Rental guide & identity rules
│       ├── account/page.jsx            # User booking history & receipt print
│       ├── cart/page.jsx               # Cart management & delivery options
│       ├── categories/page.jsx         # Gear category grid
│       ├── checkout/page.jsx           # Order confirmation & Midtrans payment submit
│       ├── gears/page.jsx              # Gear catalog (Search, filter, pagination)
│       └── admin/
│           └── dashboard/page.jsx      # Admin Control Panel & analytics
├── components/
│   ├── ui/                             # SHADCN/UI PRIMITIVES (ATOMS)
│   │   ├── badge.jsx                   # Status & category badges
│   │   ├── button.jsx                  # Brand buttons (ember, bone, outline, link)
│   │   ├── card.jsx                    # Card, CardHeader, CardTitle, CardContent
│   │   ├── checkbox.jsx                # Checkbox control (Radix)
│   │   ├── input.jsx                   # Styled form inputs
│   │   ├── label.jsx                   # Styled form labels (Radix)
│   │   ├── select.jsx                  # Styled dropdown select
│   │   ├── separator.jsx               # Visual dividers (Radix)
│   │   ├── skeleton.jsx                # Pulse loading skeletons
│   │   └── table.jsx                   # Table, TableHeader, TableRow, TableCell
│   ├── atoms/                          # BRAND ATOMS
│   │   ├── BrandMark.jsx               # GearNest logo mark & wordmark
│   │   ├── SectionHeading.jsx          # Title + ember line + subtitle
│   │   └── PriceTag.jsx                # Formatted Rupiah price display
│   ├── molecules/                      # MOLECULES
│   │   ├── AdventureCard.jsx           # Adventure category card with image hover
│   │   ├── FooterColumn.jsx            # Footer navigation list
│   │   ├── FormField.jsx               # Icon + label + input wrapper
│   │   ├── GearCard.jsx                # Gear product card with stock & add-to-cart
│   │   ├── StatCard.jsx                # Admin dashboard metric card
│   │   └── StepCard.jsx                # How-it-works numbered step card
│   ├── organisms/                      # ORGANISMS
│   │   ├── AdminShell.jsx              # Admin layout shell (sidebar, theme toggle, nav)
│   │   ├── AdventureGrid.jsx           # Section grid for adventure types
│   │   ├── AnalyticsCharts.jsx         # Recharts charts for admin metrics
│   │   ├── CtaBand.jsx                 # Full-width call-to-action banner
│   │   ├── FeaturedGearGrid.jsx        # Featured gear grid with skeletons
│   │   ├── Footer.jsx                  # Main public footer
│   │   ├── HeroSection.jsx             # Hero banner with GSAP animations
│   │   ├── HowItWorks.jsx              # 4-step rental guide grid
│   │   ├── Navbar.jsx                  # Header navigation bar with cart counter & profile
│   │   └── StatsBar.jsx                # Platform metrics banner with GSAP
│   └── templates/                      # TEMPLATES
│       ├── RequireAuth.jsx             # Auth & admin route guard template
│       └── SiteChrome.jsx              # Public header/footer conditionally rendered
├── lib/
│   ├── axios.js                        # Axios HTTP client with Bearer & 401 interceptors
│   ├── format.js                       # Rupiah and date formatting utilities
│   └── utils.js                        # Class merging helper cn() (clsx + tailwind-merge)
├── store/
│   ├── useAuthStore.js                 # Authentication Zustand store
│   └── useCartStore.js                 # Shopping cart Zustand store
└── Reveal.jsx                          # GSAP-powered ScrollTrigger reveal wrapper
```

---

## SECTION 5 — Pages & Routes Reference

| Path | Route Group | Access | Purpose | Consumed API Endpoints |
|---|---|---|---|---|
| `/` | `(main)` | Public | Landing Page | `GET /api/gears?limit=8` |
| `/gears` | `(main)` | Public | Gear Catalog with Search & Filter | `GET /api/gears`, `GET /api/categories` |
| `/about` | `(main)` | Public | Rental Guidelines & Identity Rules | None (Static) |
| `/categories` | `(main)` | Public | Gear Categories | `GET /api/categories` |
| `/cart` | `(main)` | Public | Review Cart, Dates & Delivery | `useCartStore` (Client state) |
| `/checkout` | `(main)` | Customer | Booking Submission | `POST /api/bookings`, `POST /api/bookings/{id}/payment` |
| `/account` | `(main)` | Customer | Customer Booking History & Receipt Print | `GET /api/bookings`, `POST /api/bookings/{id}/payment` |
| `/login` | Standalone | Public / Guest | Portal Login (Customer & Admin) | `POST /api/login` |
| `/register` | Standalone | Public / Guest | Customer Account Registration | `POST /api/register` |
| `/admin/dashboard` | `(main)` | Admin | Admin Control Panel & Analytics | `GET /api/admin/reports/dashboard`, `GET /api/admin/reports/popular-gear`, `GET /api/admin/reports/low-stock`, `GET /api/admin/bookings`, `PATCH /api/admin/bookings/{id}/status`, `PATCH /api/admin/bookings/{id}/verify` |

---

## SECTION 6 — API Integration

### 6.1 Centralized Axios Client (`src/lib/axios.js`)

All API interactions flow through a pre-configured Axios instance that automatically handles header injection and token expiration.

```js
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token from Zustand Auth Store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 Unauthorized Automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 6.2 Standardized API Response Handling

Backend responses strictly follow the JSON envelope format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "total": 24
  }
}
```

Frontend consumption pattern:
```js
try {
  const res = await api.get('/gears', { params });
  const gearList = res.data.data;
  const paginationMeta = res.data.meta;
} catch (err) {
  const errorMessage = err.response?.data?.message || 'Failure message';
  toast.error(errorMessage);
}
```

---

## SECTION 7 — Component Reference

### 7.1 Key Primitives & Components

#### `<Button>` (`src/components/ui/button.jsx`)
- **Variants**: `default` (Ember orange), `secondary` (Bone light), `outline` (White border), `ghost` (Hover ink), `destructive` (Soft red), `link` (Underline text).
- **Sizes**: `default` (px-6 py-3), `sm` (px-4 py-2.5), `lg` (px-8 py-4), `icon` (10x10 square).

#### `<GearCard>` (`src/components/molecules/GearCard.jsx`)
- **Props**: `gear` (Gear item object), `onAddToCart` (Callback handler).
- **Features**: Image thumbnail with hover zoom, category/brand badge, stock badge, formatted daily rate, and add-to-cart button.

#### `<HeroSection>` (`src/components/organisms/HeroSection.jsx`)
- **Features**: GSAP staggered entrance for headline lines, subtitle, floating decorative orb, Ken Burns background image transition, and CTA buttons.

#### `<AdminShell>` (`src/components/organisms/AdminShell.jsx`)
- **Props**: `title` (Header title string), `children` (Page content).
- **Features**: Guarded by `RequireAuth(admin=true)`, dark mode toggle persisted in `localStorage` (`gn-admin-dark`), mobile drawer navigation, and admin profile summary.

---

## SECTION 8 — Running Locally

### 8.1 Prerequisites
1. Node.js 18+ installed.
2. `gearnest-api` (Laravel backend) running locally at `http://127.0.0.1:8000`.

### 8.2 Installation & Setup

```bash
# 1. Navigate to frontend directory
cd gearnest-web

# 2. Install dependencies
npm install

# 3. Environment Configuration
# Ensure .env.local contains:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# 4. Start Development Server
npm run dev
```

Application will be accessible at `http://localhost:3000`.

### 8.3 Test Credentials

| Role | Email | Password | Target Redirect |
|---|---|---|---|
| **Admin** | `admin@gearnest.com` | `admin123` | `/admin/dashboard` |
| **Customer** | `customer@gearnest.com` | `customer123` | `/` (Landing Page) |

---

## APPENDIX A — Error Handling Matrix

| HTTP Status | Trigger Scenario | Frontend Handling | User Experience |
|---|---|---|---|
| `401 Unauthorized` | Invalid token, expired session, or unauthenticated request to protected route. | Axios interceptor clears token (`useAuthStore.logout()`) and redirects to `/login`. | Toast notification: *"Session expired. Please log in again."* |
| `403 Forbidden` | Non-admin user attempting to access `/admin/*` routes. | `RequireAuth` template redirects customer to `/account` or `/`. | Toast notification: *"Akses ditolak. Membutuhkan hak akses admin."* |
| `404 Not Found` | Requested gear or booking ID does not exist. | Route handler catches error or renders Next.js not-found boundary. | User shown friendly empty state or not-found card. |
| `422 Unprocessable` | Validation error (e.g., duplicate email, invalid dates, out-of-stock items). | Component catches error response and extracts `err.response.data.message` or `errors` object. | Displayed directly under form inputs or via Sonner error toast. |
| `500 Server Error` | Unexpected backend error or database exception. | Catch block intercepts status 500. | Toast notification: *"Terjadi kesalahan pada server. Coba beberapa saat lagi."* |
| `Network Error` | Backend server (`127.0.0.1:8000`) is offline. | Axios throws connection error. | Toast notification: *"Gagal terhubung ke server GearNest."* |

---

## APPENDIX B — Integration Contract with Backend

1. **JSON Envelope Consistency**: Frontend assumes all successful API responses contain a top-level `data` key, and paginated lists contain a `meta` object with `current_page`, `last_page`, and `total`.
2. **Server-Side Pricing & Distance Calculation**: Frontend computes delivery fees and subtotal for display purposes in the cart, but the backend is the authoritative source for final prices, delivery calculations, and tax.
3. **Inventory Concurrency**: Booking creation via `POST /api/bookings` reserves gear inventory on the backend. If stock becomes unavailable between cart review and checkout submission, backend returns `422 Unprocessable Entity` with an out-of-stock message.
