# ⛰️ Kembara.id Web — Outdoor Rental & Booking (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![JavaScript](https://img.shields.io/badge/Code-JS_%2F_JSX-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand-593D2B?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

Antarmuka web modern untuk **Kembara.id** — platform penyewaan perlengkapan outdoor & alat gunung. Dibangun dengan **Next.js 16 (App Router, React 19, murni JavaScript `.js`/`.jsx`)**, **Tailwind CSS v4**, **Zustand**, **Axios**, dengan sistem desain **Earth Tones** dan pembayaran ganda (**Midtrans Snap** online / **WhatsApp** on-site).

> **Bagian frontend dari sistem full-stack decoupled** — mengonsumsi REST API Laravel ([kembara-backend](https://github.com/DannZ10/kembara-backend)).

---

## 🔗 Live

| Sumber | URL |
|---|---|
| Aplikasi (Frontend) | https://kembara-frontend.vercel.app |
| REST API (Backend) | `https://kembara-backend.onrender.com/api` |
| Dokumentasi API (Swagger) | https://kembara-backend.onrender.com/docs/api |

Login demo: **admin** `admin@kembara.com` / `admin123` · **customer** `customer@kembara.com` / `customer123`.

---

## 🧱 Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19) — **pure JS/JSX** |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` di `globals.css`, tanpa `tailwind.config.js`) |
| State | **Zustand** (+ `persist`) — cart & auth |
| HTTP | **Axios** (interceptor Bearer token + auto-logout 401) |
| UI/UX | lucide-react (ikon), sonner (toast), **recharts** (chart admin), GSAP, Radix (primitives), react-hook-form + zod, date-fns |
| Tipografi | **next/font**: Outfit (display) · Inter (body) · JetBrains Mono (angka/harga/eyebrow) |
| Deploy | **Vercel** |

---

## 🎨 Sistem Desain — Earth Tones

Palet nuansa alam bebas (didefinisikan sebagai token Tailwind v4 di `globals.css`):

| Token | Hex | Peran |
|---|---|---|
| Forest Green | `#1F382B` | teks/headings gelap, surface |
| Pine | `#3E5A44` | aksen sekunder |
| Campfire Amber | `#CC7A2E` | **CTA / aksi utama** |
| Terracotta | `#8C4A27` | aksen harga/urgensi |
| Warm Sand | `#FBF9F5` | kanvas latar |
| Deep Forest | `#16261D` | hero/footer/sidebar |

---

## 🌟 Fitur

- 🏠 **Landing** — hero + counter animasi, kategori, **katalog live** (dari API), kalkulator estimasi ongkir, testimoni, FAQ, CTA.
- 🔍 **Katalog & filter real-time** — pencarian, filter kategori, sortir, paginasi server, modal detail gear.
- 🛒 **Keranjang dinamis** — pilih tanggal sewa, kalkulasi durasi, **Pickup** vs **Delivery** (pratinjau ongkir live dari `/delivery/quote`), atur kuantitas & rincian biaya.
- 💳 **Checkout & pembayaran ganda** — ringkasan penyewa, persetujuan jaminan identitas (KTP/SIM), lalu bayar via **Midtrans Snap (online)** atau **WhatsApp (on-site)**.
- 📋 **Akun customer** — riwayat & status booking (`pending`/`confirmed`/`active`/`returned`/`cancelled`), bayar ulang, **cetak invoice**.
- 🔁 **Pengembalian & jaminan** — panel serah-terima (tanggal ambil/kembali, jatuh tempo) + status kartu jaminan per booking.
- 🔓 **Login Google (OAuth)** — masuk/daftar via Google (`/auth/callback`, alur code-exchange), berdampingan dengan email/password.
- 🛡️ **Panel Admin** — dashboard KPI, **analitik chart** (pendapatan, gear populer, stok menipis, performa kategori, periode ramai), kelola gear/varian/kategori, ubah status booking, verifikasi & pengembalian jaminan, **modal "Lihat Aktivitas" per booking**, atur biaya antar. Sidebar **collapsible** (rail ikon ↔ penuh) + drawer mobile + mode terang/gelap.

---

## 📁 Struktur Proyek (Atomic Design)

```text
src/
├── app/                        # App Router (routing berbasis folder)
│   ├── layout.jsx              # Root: font (next/font), metadata, <Toaster>
│   ├── (main)/                 # Grup rute publik (memakai chrome situs)
│   │   ├── layout.jsx          # SiteChrome (header + footer)
│   │   ├── page.jsx            # Landing
│   │   ├── gears/ categories/  # Katalog & kategori
│   │   ├── cart/ checkout/     # Keranjang & checkout
│   │   ├── account/ about/     # Akun/riwayat, tentang
│   │   ├── dashboard/          # redirect → /account
│   │   └── admin/              # dashboard · analytics · bookings · gears · categories · settings
│   ├── login/ register/        # Layar auth (AuthShell)
│   └── auth/callback/          # Pertukaran one-time code OAuth → token
├── components/
│   ├── atoms/                  # BrandMark · PriceTag · CountUp · SectionHeading
│   ├── molecules/              # FormField · StatCard · StepCard · ...
│   ├── organisms/              # Navbar · Footer · GearCard · GearDetailModal · BookingActivityModal · AnalyticsCharts · AdminShell · BookingInvoice
│   ├── templates/              # SiteChrome · AuthShell · RequireAuth · IdleTimeout
│   ├── admin/ui.jsx            # Primitives admin (CARD/Modal/Field/AdminSelect)
│   └── ui/                     # Primitives gaya shadcn (button, input, card, ...)
├── lib/                        # axios (klien API) · format · useReveal · utils (cn) · config
└── store/                      # useAuthStore · useCartStore (Zustand + persist)
```

**Alur data:** semua panggilan API lewat `lib/axios` (menyisipkan Bearer token dari `useAuthStore`, auto-logout saat 401). Rute terproteksi dibungkus `RequireAuth` (admin diarahkan ke `/admin`).

---

## 🚀 Menjalankan Lokal

**Prasyarat:** Node.js ≥ 18, npm ≥ 9.

```bash
git clone https://github.com/DannZ10/kembara-frontend.git kembara-web
cd kembara-web
npm install
```

Buat `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# Nomor WhatsApp admin untuk "Bayar di Tempat" (format internasional, tanpa +)
NEXT_PUBLIC_ADMIN_WHATSAPP=6281217409277
```

```bash
npm run dev      # http://localhost:3000
npm run build    # cek build production
```

> `NEXT_PUBLIC_API_URL` **di-bake saat build** — pastikan sudah benar sebelum `build`/deploy.

---

## ☁️ Deployment (Vercel)

Frontend di-deploy native di **Vercel** dari repo GitHub (auto-deploy tiap push ke `main`).

1. Import repo `DannZ10/kembara-frontend` ke Vercel (framework Next.js terdeteksi otomatis).
2. **Settings → Environment Variables** → set `NEXT_PUBLIC_API_URL = https://<backend>/api` (Production) + `NEXT_PUBLIC_ADMIN_WHATSAPP`.
3. Deploy → dapat URL `https://<project>.vercel.app`.
4. Set `FRONTEND_URL` di backend (Render) = URL Vercel ini agar **CORS** lolos.

---

## 🔑 Kredensial Demo

- **Admin**: `admin@kembara.com` / `admin123`
- **Customer**: `customer@kembara.com` / `customer123`
