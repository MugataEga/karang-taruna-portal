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

## 🛠️ Tech Stack

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

### Deployment
- **Cloudflare Pages** - Fast global CDN deployment (Recommended)
- **Vercel** - Alternative deployment platform
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

Buat file `.env.local` di root project dan isi dengan:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

**Cara mendapatkan credentials:**
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **Settings** → **API**
4. Copy **Project URL** untuk `VITE_SUPABASE_URL`
5. Copy **anon/public key** untuk `VITE_SUPABASE_PUBLISHABLE_KEY`

4. Setup database

Jalankan SQL schema dari file `schema.sql` di Supabase SQL Editor

5. Jalankan development server
```bash
npm run dev
```

6. Buka browser di `http://localhost:5173`

## 🚀 Deployment

### Deploy ke Cloudflare Pages (Recommended)

1. **Connect Repository**
   - Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pilih **Workers & Pages** → **Create application** → **Pages**
   - Connect ke Git repository Anda (GitHub/GitLab)

2. **Build Settings**
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: / (kosongkan)
   Node version: 18 atau 20
   ```

3. **Environment Variables**
   - Klik **Settings** → **Environment Variables**
   - Tambahkan untuk **Production** dan **Preview**:
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY = your_supabase_publishable_key
   ```

4. **Deploy**
   - Klik **Save and Deploy**
   - Website akan tersedia di `https://[project-name].pages.dev`

5. **Custom Domain (Opsional)**
   - Klik **Custom domains** → **Set up a custom domain**
   - Tambahkan domain Anda dan ikuti instruksi DNS

### Deploy ke Vercel

1. Install Vercel CLI atau connect via dashboard
2. Tambahkan environment variables di **Settings** → **Environment Variables**
3. Deploy dengan `vercel --prod`

### Deploy ke Netlify

1. Connect repository di Netlify dashboard
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Tambahkan environment variables di **Site settings** → **Environment variables**

## 🔐 Admin Access

Untuk mengakses admin panel:
1. Buka `/admin/login`
2. Login dengan kredensial admin yang sudah dibuat di Supabase Auth
3. Setelah login, akses dashboard di `/admin`

**Membuat Admin User:**
1. Buka Supabase Dashboard → Authentication → Users
2. Klik **Add user** → **Create new user**
3. Masukkan email dan password
4. User dapat login di `/admin/login`

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

### Color Palette
- **Green Deep**: `#0f3d23` (Primary)
- **Green Mid**: `#1a5c38`
- **Gold**: `#d4920a` (Accent)
- **Gold Light**: `#f5b942`
- **Cream**: `#fef9f3`
- **Border**: `#e0e0e0`

### Typography
- **Logo**: Fraunces (Serif)
- **Body**: System fonts stack
- **Headings**: Inter/System fonts

### Components
- Reusable components dengan consistent styling
- Sidebar navigation untuk admin
- Responsive design (Desktop, Tablet, Mobile)
- Data tables dengan sorting dan filtering
- Form components dengan validation

## 🌐 Rekomendasi Nama Domain

### Opsi Premium (Domain Berbayar)
- `karangtaruna.id` - Paling ideal dan profesional
- `karangtaruna.or.id` - Untuk organisasi non-profit
- `karangtaruna[namakelurahan].id` - Contoh: karangtarunacipete.id

### Opsi Gratis (Subdomain)
- `karangtaruna-[namakelurahan].pages.dev` (Cloudflare)
- `karangtaruna-[namakelurahan].vercel.app` (Vercel)
- `[namakelurahan]-karangtaruna.netlify.app` (Netlify)

## 🐛 Troubleshooting

### Error: Missing Supabase environment variables
- Pastikan file `.env.local` ada di root project
- Restart development server setelah menambah/mengubah `.env.local`
- Untuk deployment, tambahkan environment variables di dashboard platform

### Build Error
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install

# Hapus dist dan build ulang
rm -rf dist
npm run build
```

### Supabase Connection Error
- Periksa URL dan Key di `.env.local`
- Pastikan Supabase project aktif
- Cek Row Level Security (RLS) policies di Supabase

## 📝 Lisensi

Proyek ini dibuat untuk keperluan Karang Taruna.

## 👥 Kontributor

- **Developer**: Mukgot Ega Sahputra
- **Design**: Mukgot Ega Sahputra

## 📞 Kontak

Untuk pertanyaan atau dukungan, hubungi:
- **Email**: mukgotegasahputra@gmail.com
- **Instagram**: [@ageee01_11](https://instagram.com/ageee01_11)

---

**Dibuat dengan ❤️ untuk Karang Taruna**
