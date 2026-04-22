# Website Karang Taruna

Website resmi Karang Taruna untuk mengelola informasi, kegiatan, dan aspirasi warga di tingkat Kelurahan dan RW.

## 📋 Tentang Proyek

Website Karang Taruna adalah platform digital yang dirancang untuk memfasilitasi komunikasi dan manajemen informasi antara pengurus Karang Taruna dengan warga. Website ini menyediakan fitur-fitur untuk mengelola pengumuman, agenda kegiatan, galeri foto, struktur organisasi, dan aspirasi warga.

## 🎯 Tujuan

- Meningkatkan transparansi informasi kegiatan Karang Taruna
- Memudahkan warga dalam menyampaikan aspirasi
- Menyediakan platform terpusat untuk informasi Kelurahan dan RW (001-006)
- Memfasilitasi pengelolaan konten oleh admin secara efisien

## ✨ Fitur Utama

### Untuk Warga (Public)
- **Beranda**: Informasi umum dan pengumuman penting
- **Pengumuman**: Daftar pengumuman terbaru dari Kelurahan dan RW
- **Agenda**: Jadwal kegiatan dan acara Karang Taruna
- **Galeri**: Dokumentasi foto kegiatan
- **Profil**: Struktur organisasi pengurus Kelurahan dan RW
- **Aspirasi**: Form untuk menyampaikan aspirasi dan keluhan

### Untuk Admin
- **Dashboard**: Ringkasan statistik dan aktivitas terbaru
- **Kelola Pengumuman**: CRUD pengumuman dengan kategori dan target RW
- **Kelola Agenda**: CRUD agenda kegiatan dengan detail waktu dan lokasi
- **Kelola Galeri**: Upload dan manajemen foto kegiatan
- **Kelola Struktur Organisasi**: Manajemen pengurus per unit (Kelurahan, RW 001-006)
- **Kelola Aspirasi**: Monitoring dan update status aspirasi warga
- **Autentikasi**: Login/logout dengan Supabase Auth

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool dan dev server yang cepat
- **React Router v6** - Routing dan navigasi
- **Native CSS** - Styling tanpa framework CSS eksternal

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL Database
  - Authentication & Authorization
  - Row Level Security (RLS)
  - Real-time subscriptions
  - RESTful API

### Development Tools
- **ESLint** - Linting untuk kualitas kode
- **Vite HMR** - Hot Module Replacement untuk development
- **Git** - Version control

### Deployment Ready
- **Vercel** - Recommended untuk deployment
- **Netlify** - Alternative deployment platform

### Key Libraries
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.x",
  "@supabase/supabase-js": "^2.x"
}
```

### Architecture
- **SPA (Single Page Application)** - Client-side rendering
- **Context API** - State management (AuthContext, RWContext)
- **Protected Routes** - Route guards untuk halaman admin
- **Responsive Design** - Mobile-first approach

## 📦 Struktur Database

### Tables
- `pengumuman`: Pengumuman dengan kategori dan target RW
- `agenda`: Agenda kegiatan dengan tanggal, waktu, lokasi
- `galeri`: Foto kegiatan dengan metadata
- `pengurus`: Struktur organisasi per unit (Kelurahan, RW 001-006)
- `aspirasi`: Aspirasi warga dengan status tracking

## 🚀 Cara Menjalankan Proyek

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Akun Supabase

### Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd karang-taruna-website
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
Buat file `.env.local` dan isi dengan:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Setup database
Jalankan SQL schema dari file `schema.sql` di Supabase SQL Editor

5. Jalankan development server
```bash
npm run dev
```

6. Buka browser di `http://localhost:5173`

## 🔐 Admin Access

Untuk mengakses admin panel:
1. Buka `/admin/login`
2. Login dengan kredensial admin yang sudah dibuat di Supabase Auth
3. Setelah login, akses dashboard di `/admin`

## 📁 Struktur Folder

```
src/
├── components/
│   └── layout/
│       ├── AdminSidebar.jsx    # Sidebar navigasi admin
│       └── ProtectedRoute.jsx  # Route guard untuk admin
├── context/
│   ├── AuthContext.jsx         # Context untuk autentikasi
│   └── RWContext.jsx           # Context untuk filter RW
├── lib/
│   └── supabase.js             # Konfigurasi Supabase client
├── pages/
│   ├── admin/                  # Halaman admin
│   │   ├── Dashboard.jsx
│   │   ├── AdminPengumuman.jsx
│   │   ├── AdminAgenda.jsx
│   │   ├── AdminGaleri.jsx
│   │   ├── AdminPengurus.jsx
│   │   ├── AdminAspirasi.jsx
│   │   └── Login.jsx
│   ├── Beranda.jsx             # Halaman public
│   ├── Pengumuman.jsx
│   ├── Agenda.jsx
│   ├── Galeri.jsx
│   ├── Profile.jsx
│   └── Aspirasi.jsx
├── admin.css                   # Styling untuk admin panel
├── global.css                  # Global styles
├── App.jsx                     # Main app component
└── main.jsx                    # Entry point
```

## 🎨 Design System

Website menggunakan custom design system dengan:
- **Color Palette**: 
  - Green Deep: `#0f3d23` (Primary)
  - Green Mid: `#1a5c38`
  - Gold: `#d4920a` (Accent)
  - Gold Light: `#f5b942`
- **Typography**: System fonts dengan Fraunces untuk logo
- **Components**: Reusable components dengan consistent styling
- **Layout**: Sidebar navigation untuk admin, responsive design

## 📝 Lisensi

Proyek ini dibuat untuk keperluan Karang Taruna.

## 👥 Kontributor

- Developer: [Mukgot Ega Sahputra]
- Design: [Mukgot Ega Sahputr]

## 📞 Kontak

Untuk pertanyaan atau dukungan, hubungi:
- Email: mukgotegasahputra@gmail.com
- Instagfram: @ageee01_11

---

Dibuat dengan ❤️ untuk Karang Taruna
