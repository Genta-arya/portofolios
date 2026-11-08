# 🌌 Gentha Arya Pratama — 3D Cosmic Aurora Developer Portfolio & CMS

[![Astro](https://img.shields.io/badge/Astro-5.4-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.38-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Modern, High-Performance 3D Portfolio & Content Management System** dirancang khusus untuk menampilkan rekayasa web skala enterprise dan aplikasi mobile dengan estetika visual **Dark Cosmic Purple / Cosmic Aurora**.

---

## ✨ Fitur Unggulan (Key Features)

### 🛸 Interactive 3D & Cosmic Visuals
- **3D Physics Lanyard ID Card**: ID Card interaktif berbasis Three.js & `@react-three/drei` yang merespons gravitasi, drag kursor, dan rotasi 3D real-time.
- **3D Tech Stack Orbit**: Visualisasi orbit planet 3D interaktif yang merepresentasikan core stack developer (React, Astro, Express, MySQL, Android).
- **Tactile 3D Glass Navbar**: Navbar bergaya dock futuristik dengan efek hover 3D tilt magnetik, elevated active indicator, dan tombol CTA interaktif.
- **Cosmic Aurora Shader**: Latar belakang dinamis multi-layer dengan pancaran aurora ultraviolet dan debu bintang kosmik.
- **3D Circular Showcase**: Carousel silinder 3D autoplaying untuk eksplorasi teknologi dan tools.

### 💼 Portfolio Showcase & Services
- **Case Study Explorer**: Halaman detail studi kasus proyek lengkap dengan stack badge, metrik performa, arsitektur, dan tautan live.
- **Integrated Service Cards**: Kartu layanan terstruktur dengan label *"Paling Diminati"* yang terhubung langsung ke katalog layanan [Fastwork](https://fastwork.id/user/babfpfzm).
- **Career & Education Timeline**: Jejak rekam pengalaman kerja profesional dengan filter interaktif.

### 🛡️ Admin CMS & Security Architecture
- **Complete Admin Dashboard**: Manajemen proyek, artikel blog, portofolio, inbox pesan, dan pengaturan profil secara terpusat.
- **TipTap Rich Text Editor**: Editor artikel WYSIWYG canggih dengan upload media terintegrasi.
- **Cloudinary CDN Integration**: Manajemen aset media otomatis dengan kompresi cerdas dan pengoptimalan WebP.
- **Zero-Trust Security**: Otentikasi berbasis JWT (JOSE), hash password bcrypt, sanitasi input, dan proteksi penuh variabel environment.

### 🚀 Production-Grade SEO & Performance
- **Open Graph & Twitter Cards**: Pratinjau media kaya yang dinamis di WhatsApp, Telegram, Twitter/X, dan LinkedIn.
- **Schema.org Structured Data**: Graph JSON-LD komprehensif (`WebSite`, `Person`, `BlogPosting`) untuk visibilitas maksimal di Google Search.
- **Dynamic Sitemap & Robots.txt**: XML Sitemap otomatis (`/sitemap.xml`) yang mengindeks artikel dan proyek terbaru.
- **Sub-second SSR Performance**: Ditenagai Astro 5 Server-Side Rendering (Node.js adapter) dengan hidrasi parsial (`client:visible`, `client:load`).

---

## 🛠️ Tech Stack

| Lapisan / Kategori | Teknologi |
| :--- | :--- |
| **Framework & Engine** | [Astro 5](https://astro.build) (SSR Node Mode) |
| **UI Library** | [React 19](https://react.dev), [Tailwind CSS](https://tailwindcss.com) |
| **3D & Animasi** | [Three.js](https://threejs.org), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [Framer Motion](https://www.framer.com/motion) |
| **Database & ORM** | [MySQL](https://mysql.com), [Drizzle ORM](https://orm.drizzle.team) |
| **Media CDN** | [Cloudinary](https://cloudinary.com) |
| **Editor WYSIWYG** | [TipTap](https://tiptap.dev) |
| **Icons & Tipografi** | [Lucide React](https://lucide.dev), Simple Icons, Inter & Plus Jakarta Sans |

---

## 📁 Struktur Direktori

```text
├── public/                 # Static assets (favicons, robots.txt, avatars, thumbnails)
├── src/
│   ├── components/
│   │   ├── admin/          # Komponen Admin Dashboard & CMS Forms
│   │   ├── public/         # Komponen Publik (Hero, Navbar, Footer, Services, Orbit, dll)
│   │   ├── reactbits/      # Komponen animasi interaktif (SlingButton, Orbit, Tilts)
│   │   └── ui/             # Reusable UI primitives (Icons, Modals, Loaders)
│   ├── db/
│   │   ├── index.ts        # Inisialisasi Pool MySQL & Drizzle Connection
│   │   ├── schema.ts       # Definisi Skema Tabel Database Drizzle
│   │   └── seed.ts         # Seeder Data Awal
│   ├── layouts/
│   │   ├── AdminLayout.astro   # Layout Khusus Portal Admin
│   │   └── PublicLayout.astro  # Layout Publik dengan Schema JSON-LD & SEO Lengkap
│   ├── lib/
│   │   ├── auth.ts         # JWT Session Signing & Verification
│   │   ├── cloudinary.ts   # Integrasi Cloudinary Uploader
│   │   └── utils.ts        # Helper Formatting & Utilities
│   └── pages/
│       ├── api/            # Server Endpoint REST APIs (Auth, CMS, Contact, Views)
│       ├── admin/          # Halaman Admin CMS
│       ├── blog/           # Halaman Blog & Artikel Detail
│       ├── projects/       # Halaman Studi Kasus Portofolio
│       ├── 404.astro       # Custom Cosmic 404 Page (Fuzzy Text & Orb)
│       ├── index.astro     # Halaman Utama (One-Page Showcase)
│       └── sitemap.xml.ts  # Dynamic XML Sitemap Generator
├── .env.example            # Template Konfigurasi Environment
├── astro.config.mjs        # Konfigurasi Astro
├── drizzle.config.ts       # Konfigurasi Drizzle ORM
└── package.json            # Daftar Dependencies & Script Proyek
```

---

## ⚡ Panduan Instalasi Lokal (Quickstart)

### 1. Kloning Repository
```bash
git clone https://github.com/Genta-arya/portofolios.git
cd portofolios
```

### 2. Pasang Dependensi
```bash
npm install
# atau
pnpm install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan parameter database MySQL dan kredensial Cloudinary pada `.env`:
```ini
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="root"
DATABASE_PASSWORD="your_password"
DATABASE_NAME="gentha_portfolio_db"

JWT_SECRET="your-32-character-random-secret-key-here"
ADMIN_INITIAL_EMAIL="admin@example.com"
ADMIN_INITIAL_PASSWORD="ChangeMe123!"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

PUBLIC_SITE_URL="https://www.mgentaarya.my.id"
```

### 4. Sinkronisasi Database & Seeding
```bash
# Push skema tabel ke MySQL
npm run db:push

# Isi data awal (seed)
npm run db:seed
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:4321`.

---

## 🔒 Keamanan & Perlindungan Kredensial

Proyek ini telah dikonfigurasi dengan standar keamanan tinggi:
- Seluruh variabel privat (`DATABASE_PASSWORD`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`) **wajib** disimpan di file `.env`.
- File `.env`, `.env.*`, dan build artifacts secara otomatis diabaikan oleh `.gitignore` sehingga tidak akan pernah terpublikasi ke remote git repository.
- Seluruh endpoint API portal admin (`/api/admin/*`) dilindungi oleh middleware verifikasi JWT HTTP-only cookie.

---

## 👨‍💻 Profil & Kontak Pengembang

**Gentha Arya Pratama**  
*Fullstack Developer · Web Enterprise & Mobile Specialist*

- 🌐 **Website**: [mgentaarya.my.id](https://www.mgentaarya.my.id)
- 💼 **Fastwork Freelance**: [fastwork.id/user/babfpfzm](https://fastwork.id/user/babfpfzm)
- 🐙 **GitHub**: [@Genta-arya](https://github.com/Genta-arya)
- ✉️ **Email**: [mgentaarya@gmail.com](mailto:mgentaarya@gmail.com)

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Silakan gunakan dan modifikasi untuk keperluan personal atau komersial Anda.

