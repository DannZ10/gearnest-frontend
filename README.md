# ⛰️ Kembara.id Web — Outdoor Rental Web Application (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)

**Kembara.id Web** adalah antarmuka web modern untuk platform sewa perlengkapan outdoor & peralatan gunung. Dibangun menggunakan **Next.js App Router murni JavaScript (`.js` & `.jsx`)**, **Tailwind CSS v4**, **Zustand State Management**, **Axios**, dan integrasi pembayaran otomatis **Midtrans Snap**.

---

## 🎨 Tampilan & Fitur Utama

- 🏠 **Beranda (Landing Page)**: Hero Banner, 14 Kategori Grid, Katalog Gear Paling Populer, dan Timeline Cara Sewa.
- 🔍 **Katalog Gear & Filter Real-Time**: Pencarian kata kunci, filter kategori, pengurutan harga/stok, dan paginasi.
- 🛒 **Keranjang Sewa Dinamis**: Pemilihan tanggal mulai/selesai sewa, kalkulator durasi hari, opsi **Ambil Mandiri (Pickup)** vs **Layanan Antar (Delivery Rp 10.000 + Rp 3.000/km)**, manajemen kuantitas gear, dan rincian biaya.
- 💳 **Checkout & Midtrans Integration**: Ringkasan penyewa, persetujuan jaminan identitas KTP/SIM, catatan khusus, dan peluncuran pembayaran instan via Midtrans Snap.
- 📋 **Dashboard Customer**: Riwayat booking sewa, indikator status (`pending`, `confirmed`, `active`, `returned`, `cancelled`), dan tombol bayar ulang.
- 🔁 **Pengembalian & Jaminan**: Panel serah-terima (tanggal ambil/kembali, jatuh tempo, peringatan lewat tempo) dan status kartu jaminan identitas per booking.
- 🕓 **Riwayat Aktivitas**: Timeline audit per booking untuk customer, dan halaman feed aktivitas terpusat untuk admin.
- 🔓 **Login Google (OAuth)**: Masuk / daftar via akun Google (`/auth/callback`), berdampingan dengan login email/password.
- 🛡️ **Dashboard Admin Control Panel**: Ringkasan omset & statistik, peringatan stok menipis (≤ 3 unit), ranking gear terpopuler, pengubah status booking, toggle verifikasi & pengembalian jaminan identitas, dan **cetak invoice** printable per booking.

---

## 📁 Struktur Proyek (JavaScript `.js` / `.jsx`)

```text
kembara-web/
├── public/                # Static assets & logos
├── src/
│   ├── app/               # Next.js App Router Pages
│   │   ├── admin/dashboard/page.jsx  # Admin Control Panel
│   │   ├── cart/page.jsx             # Keranjang Sewa & Delivery
│   │   ├── categories/page.jsx       # 14 Kategori Grid
│   │   ├── checkout/page.jsx         # Konfirmasi & Midtrans Trigger
│   │   ├── dashboard/page.jsx        # Customer My Bookings
│   │   ├── gears/page.jsx            # Katalog & Filter Search
│   │   ├── login/page.jsx            # Portal Masuk (Demobox)
│   │   ├── register/page.jsx         # Portal Daftar
│   │   ├── layout.jsx                # Root Layout (Nav, Footer, Toast)
│   │   └── page.jsx                  # Home Landing Page
│   ├── components/        # Reusable UI Components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── lib/               # Utilities & Axios API Client
│   │   ├── axios.js
│   │   └── format.js
│   └── store/             # Zustand State Management Stores
│       ├── useAuthStore.js
│       └── useCartStore.js
├── jsconfig.json          # Path alias configuration (@/*)
├── package.json           # Dependencies & Scripts
└── tailwind.config.js     # Styling tokens & design system
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/DannZ10/kembara-frontend.git kembara-web
cd kembara-web
npm install
```

### 2. Konfigurasi Environment File (`.env.local`)
Buat file `.env.local` di root folder `kembara-web`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# Nomor WhatsApp admin untuk konfirmasi "Bayar di Tempat" (format internasional, tanpa +)
NEXT_PUBLIC_ADMIN_WHATSAPP=6281217409277
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di: `http://localhost:3000`

### 4. Membangun Production Bundle (Build Check)
```bash
npm run build
```

---

## 🔑 Kredensial Demo Cepat

- **Admin Account**: `admin@kembara.com` / `admin123`
- **Customer Account**: `customer@kembara.com` / `customer123`
