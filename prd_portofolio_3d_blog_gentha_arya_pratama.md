# Product Requirements Document (PRD)
## Project: Gentha Arya Pratama — 3D Interactive Portfolio, Blog & Dynamic Admin CMS

- **Project Owner:** Gentha Arya Pratama (Fullstack Developer — Web & Mobile)
- **Reference Website (v1):** `https://www.mgentaarya.my.id/`
- **Target Architecture (v2):** Astro (Hybrid/SSR Mode) + React Islands + Three.js (R3F) + Framer Motion + shadcn/ui + Tailwind CSS + MySQL (Drizzle ORM) + Cloudinary
- **Visual Theme:** Dark Cosmic & Purple Aurora (`#06040E` Obsidian Base, Violet/Fuchsia/Indigo Aurora Glow, Glassmorphism UI)

---

## 1. Executive Summary & Project Vision
Proyek ini adalah pembaruan total (*major upgrade*) dari website portofolio **Gentha Arya Pratama (`mgentaarya.my.id`)** menjadi **Web Portofolio Interaktif 3D + Portal Artikel/Berita (Blog) + Dynamic Admin CMS** yang sangat cepat, ringan, dan ramah SEO.

Menggunakan **Astro Island Architecture**, halaman publik disajikan sebagai HTML statis/SSR super cepat, sementara elemen berat seperti objek **3D Interaktif**, animasi **Framer Motion**, dan komponen **shadcn/ui** hanya dimuat secara selektif (*lazy-hydrated*) pada bagian yang membutuhkan interaksi. Seluruh data portofolio (Proyek, Layanan, Tech Stack, Profil) dan artikel Blog dikelola secara dinamis melalui **Halaman Admin (`/admin`)** yang terhubung ke database **MySQL** dan penyimpanan gambar **Cloudinary**.

---

## 2. Tech Stack & Library Specifications

> **Instruksi untuk AI Agent (Antigravity):** Gunakan daftar teknologi di bawah ini secara presisi. Jangan mengganti database ke PostgreSQL/MongoDB karena sistem wajib berjalan di **MySQL**.

### 2.1 Core & Frontend Framework
- **Meta-Framework:** `astro` (v5.x) dengan mode `output: 'server'` (dan `export const prerender = true` pada halaman statis, atau SSR dengan Cache-Control untuk halaman dinamis).
- **UI Library (Islands):** `@astrojs/react`, `react`, `react-dom` (TypeScript strict mode).
- **Styling:** `tailwindcss` + `@tailwindcss/typography` (untuk merender isi artikel blog dengan rapi).
- **UI Component System:**
  - **shadcn/ui** (Radix UI primitives + Tailwind) untuk *Admin Dashboard*, *Data Tables*, *Dialogs*, *Forms*, *Tabs*, *Toast*, *Command Palette*, dan *Badge*.
  - **Aceternity UI / Magic UI Patterns** (dibangun di atas Tailwind + Framer Motion) untuk halaman publik: *Aurora Background*, *3D Card Effect (Perspective Tilt)*, *Bento Grid*, *Spotlight Card*, dan *Floating Navbar*.
- **Icons:** `lucide-react` & `simple-icons` (untuk ikon teknologi).

### 2.2 3D Graphics & Animation Engine
- **3D Rendering:** `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`.
  - *Aturan Performa 3D:* Komponen Canvas 3D wajib dimuat menggunakan direktif Astro `client:idle` atau `client:visible`, menggunakan `dpr={[1, 1.5]}`, dan membatasi jumlah *draw calls* agar tetap 60 FPS di perangkat *mobile* maupun *desktop*.
- **UI & Scroll Animations:** `framer-motion` (untuk transisi elemen, *staggered list*, *layout animations*, dan efek *hover* interaktif).

### 2.3 Backend, Database & Media Storage
- **Database:** **MySQL 8.x**
- **ORM & Query Builder:** `drizzle-orm` + `mysql2` (dan `drizzle-kit` untuk migrasi skema). *Alasan: Jauh lebih ringan dan cepat dibandingkan Prisma untuk arsitektur Astro.*
- **Authentication (Admin):** `lucia` atau Session berbasis JWT (`jose` + `bcryptjs`) melalui Astro Cookies (`HttpOnly`, `Secure`, `SameSite=Strict`) + Astro Middleware (`src/middleware.ts`).
- **Media Storage & CDN:** `cloudinary` (Node.js SDK untuk *signed upload* & *delete* di sisi server + optimasi URL otomatis `f_auto,q_auto`).
- **Rich Text Editor (Blog Admin):** `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-code-block-lowlight`, `@tiptap/extension-link`.

---

## 3. Visual Design System: "Dark Purple Aurora"

Website wajib menggunakan **Dark Mode secara permanen (Default Dark Theme)** dengan estetika *Cyber-Cosmic Purple Aurora*.

### 3.1 Color Palette Tokens (CSS Variables / Tailwind Config)
| Token Name | Hex Value | Penggunaan |
| :--- | :--- | :--- |
| `--bg-obsidian` | `#05030A` | Warna latar belakang utama halaman (Deep Space Black) |
| `--bg-surface` | `#0D0818` | Warna dasar kartu, sidebar admin, dan container |
| `--bg-glass` | `rgba(18, 11, 36, 0.65)` | Latar komponen *glassmorphism* dengan `backdrop-blur-xl` |
| `--aurora-primary` | `#8B5CF6` | Ungu Violet utama (Primary Accent, CTA, Active State) |
| `--aurora-secondary` | `#D946EF` | Fuchsia / Magenta Aurora (Gradient Blend & Highlight) |
| `--aurora-indigo` | `#6366F1` | Indigo Glow (Secondary Gradient & 3D Ambient Light) |
| `--aurora-cyan` | `#06B6D4` | Aksen halus untuk *badge* status atau titik cahaya 3D |
| `--text-primary` | `#F8FAFC` | Warna judul dan teks utama |
| `--text-muted` | `#94A3B8` | Warna teks deskripsi, *subtitle*, dan *metadata* blog |
| `--border-glow` | `rgba(139, 92, 246, 0.25)` | Border tipis bercahaya pada kartu portofolio & blog |

### 3.2 Efek Visual Wajib
1. **Animated Aurora Mesh Background:** Latar belakang dengan kabut gradien bergerak lembut (`#8B5CF6` -> `#D946EF` -> `#4F46E5`) menggunakan *CSS keyframes* terakselerasi GPU (`transform: translate3d`) di belakang *Hero Section*.
2. **3D Interactive Hero Scene:** Di sisi kanan *Hero Section* (atau tengah pada *mobile*), tampilkan objek 3D interaktif menggunakan `@react-three/fiber` (contoh: *Floating 3D Cyber Core / Holographic Laptop / Interactive Tech Constellation Orb* dengan material *MeshTransmissionMaterial* atau *Wireframe Glow* berwarna ungu aurora yang mengikuti pergerakan kursor/sentuhan).
3. **3D Tilt Project Cards:** Setiap kartu proyek di halaman portofolio memiliki efek kemiringan 3D (*3D Perspective Tilt*) saat kursor diarahkan, lengkap dengan pantulan cahaya (*glare effect*) berwarna ungu lembut.

---

## 4. Database Schema (MySQL + Drizzle ORM)

Buat file skema di `src/db/schema.ts` dengan struktur tabel relasional berikut:

### 4.1 Tabel `users` (Admin Authentication)
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `name`: `VARCHAR(100) NOT NULL`
- `email`: `VARCHAR(150) UNIQUE NOT NULL`
- `password_hash`: `VARCHAR(255) NOT NULL`
- `avatar_url`: `VARCHAR(500) NULL`
- `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 4.2 Tabel `site_settings` (Profil Dinamis & Statistik)
- `id`: `INT PRIMARY KEY DEFAULT 1`
- `full_name`: `VARCHAR(100)` (Default: `"Gentha Arya Pratama"`)
- `role_title`: `VARCHAR(150)` (Default: `"Fullstack Developer · Web & Mobile"`)
- `short_bio`: `TEXT`
- `about_description`: `TEXT`
- `available_for_hire`: `BOOLEAN DEFAULT TRUE`
- `hero_avatar_url`: `VARCHAR(500)`
- `hero_avatar_public_id`: `VARCHAR(255)` (Untuk hapus/ganti di Cloudinary)
- `resume_url`: `VARCHAR(500)`
- `github_url`: `VARCHAR(255)`
- `linkedin_url`: `VARCHAR(255)`
- `instagram_url`: `VARCHAR(255)`
- `fastwork_url`: `VARCHAR(255)`
- `whatsapp_number`: `VARCHAR(50)`
- `email_contact`: `VARCHAR(150)`
- `stats_categories_count`: `INT DEFAULT 3`
- `stats_projects_count`: `VARCHAR(20) DEFAULT '15+'`
- `updated_at`: `TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### 4.3 Tabel `services` (Layanan Profesional)
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `title`: `VARCHAR(150) NOT NULL` (contoh: `"Web Application"`, `"Mobile Application"`, `"Landing Page"`)
- `subtitle`: `VARCHAR(200) NOT NULL`
- `description`: `TEXT NOT NULL`
- `icon_name`: `VARCHAR(80)` (nama ikon Lucide)
- `tags`: `JSON` (contoh: `["Dashboard", "REST API", "MySQL"]`)
- `cta_url`: `VARCHAR(500)` (Link ke Fastwork / WhatsApp)
- `display_order`: `INT DEFAULT 0`
- `is_active`: `BOOLEAN DEFAULT TRUE`

### 4.4 Tabel `projects` (Portofolio Proyek)
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `title`: `VARCHAR(200) NOT NULL`
- `slug`: `VARCHAR(220) UNIQUE NOT NULL`
- `category`: `ENUM('web_app', 'mobile_app', 'landing_page') NOT NULL`
- `subcategory_badge`: `VARCHAR(100)` (contoh: `"Education System"`, `"Commerce Admin"`)
- `short_description`: `TEXT NOT NULL`
- `full_content`: `LONGTEXT NULL` (Detail studi kasus / fitur proyek)
- `tech_stack`: `JSON NOT NULL` (contoh: `["React JS", "Express JS", "MySQL"]`)
- `thumbnail_url`: `VARCHAR(500) NOT NULL`
- `thumbnail_public_id`: `VARCHAR(255) NULL` (Cloudinary `public_id`)
- `gallery_images`: `JSON NULL` (Array objek `[{ url, public_id, caption }]`)
- `live_demo_url`: `VARCHAR(500) NULL`
- `github_repo_url`: `VARCHAR(500) NULL`
- `hire_cta_url`: `VARCHAR(500) NULL`
- `is_featured`: `BOOLEAN DEFAULT TRUE`
- `display_order`: `INT DEFAULT 0`
- `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at`: `TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### 4.5 Tabel `tech_stacks` (Keahlian & Teknologi)
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `name`: `VARCHAR(100) NOT NULL` (contoh: `"React JS"`, `"Tailwind CSS"`, `"Express JS"`, `"MySQL"`, `"React Native"`)
- `role_label`: `VARCHAR(100)` (contoh: `"Frontend Modern"`, `"Backend API"`)
- `category`: `ENUM('frontend', 'backend', 'mobile', 'database', 'devops') NOT NULL`
- `icon_url`: `VARCHAR(500) NULL`
- `glow_color`: `VARCHAR(30) DEFAULT '#8B5CF6'`
- `display_order`: `INT DEFAULT 0`

### 4.6 Tabel `blog_categories` & `blog_posts` (Fitur Berita / Artikel)
**Tabel `blog_categories`:**
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `name`: `VARCHAR(100) NOT NULL`
- `slug`: `VARCHAR(120) UNIQUE NOT NULL`
- `description`: `VARCHAR(255) NULL`

**Tabel `blog_posts`:**
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `title`: `VARCHAR(255) NOT NULL`
- `slug`: `VARCHAR(255) UNIQUE NOT NULL`
- `excerpt`: `TEXT NOT NULL`
- `content`: `LONGTEXT NOT NULL` (HTML dari TipTap Editor)
- `cover_image_url`: `VARCHAR(500) NOT NULL` (Cloudinary URL)
- `cover_image_public_id`: `VARCHAR(255) NULL` (Cloudinary `public_id`)
- `category_id`: `INT NULL REFERENCES blog_categories(id) ON DELETE SET NULL`
- `tags`: `JSON NULL` (contoh: `["Astro", "React", "Tutorial", "Web Dev"]`)
- `status`: `ENUM('draft', 'published', 'archived') DEFAULT 'draft'`
- `is_featured`: `BOOLEAN DEFAULT FALSE`
- `reading_time_minutes`: `INT DEFAULT 3`
- `views_count`: `INT DEFAULT 0`
- `seo_title`: `VARCHAR(255) NULL`
- `seo_description`: `VARCHAR(320) NULL`
- `published_at`: `TIMESTAMP NULL`
- `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at`: `TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### 4.7 Tabel `contact_messages` (Pesan Masuk dari Klien)
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `sender_name`: `VARCHAR(150) NOT NULL`
- `sender_email`: `VARCHAR(150) NOT NULL`
- `service_interest`: `VARCHAR(100) NULL`
- `message`: `TEXT NOT NULL`
- `is_read`: `BOOLEAN DEFAULT FALSE`
- `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

---

## 5. Initial Seed Data (Dari `mgentaarya.my.id`)

> **Instruksi untuk Antigravity:** Buat script `src/db/seed.ts` yang otomatis mengisi data awal berikut ke MySQL agar saat pertama kali dijalankan, seluruh portofolio asli Gentha Arya Pratama langsung tampil.

1. **Profile:**
   - Nama: `Gentha Arya Pratama`
   - Role: `Fullstack Developer · Web & Mobile`
   - Bio: `"Fullstack Developer dengan pengalaman dalam pengembangan aplikasi web dan mobile. Berfokus pada pembangunan solusi digital yang modern, efisien, dan maintainable, mulai dari perancangan antarmuka, integrasi API, pengelolaan database, hingga deployment."`
   - Workflow: `Konsultasi → Design → Development → Testing → Deploy`
2. **Services (3 Kategori Utama):**
   - `Web Application` — *Custom Web App & Sistem Informasi* (React JS, Express JS, MySQL).
   - `Mobile Application` — *Android App Development* (React Native, Android APK).
   - `Landing Page` — *Landing Page & Website Profile* (Responsive, React JS, Tailwind CSS).
3. **Projects (14 Proyek Eksisting):**
   - **Kategori `web_app`:**
     1. *E-Library SMKN 2 Ketapang* (`Education System`) — Katalog buku, peminjaman, kunjungan, statistik, laporan, dan manajemen admin dalam satu sistem.
     2. *Service Station Center* (`Business Management`) — Manajemen barang, teknisi, transaksi service, keuangan, kasir, laporan, dan histori.
     3. *Boezang Apple — Admin System* (`Commerce Admin`) — Kelola produk, varian, harga, promo, quotes, tracking, serta statistik toko.
     4. *Sistem Inventori SMKN 2 Ketapang* (`Asset Management`) — Inventori aset sekolah, barang masuk-keluar, peminjaman, laporan, QR Code, dan kontrol kondisi barang.
     5. *Sistem Informasi Kepegawaian* (`Government Internal System`) — Presensi, data pegawai, rekap bulanan, laporan harian, pengumuman, dan dashboard kehadiran.
   - **Kategori `mobile_app`:**
     6. *Info Gempa* — Data gempa, peta interaktif, detail magnitudo dan riwayat.
     7. *Transparansi Pembangunan* — Monitoring proyek daerah, anggaran, progres, dokumentasi, dan laporan.
     8. *Pengelolaan Data Ijazah* — Aplikasi internal staff sekolah untuk kelola dan pencarian arsip ijazah.
     9. *Marketplace Kerajinan* — Katalog, produk, pesanan, chat penjual, dan marketplace lokal.
     10. *Online Ticket Speedboat* (`Travel & Ticketing`) — Pemilihan rute, jadwal, kursi, pembayaran, e-ticket, dan riwayat pesanan.
   - **Kategori `landing_page`:**
     11. *Al-Jihad Ketapang* (`Institution Profile`) — Website profil lembaga, program unggulan, publikasi, gallery, SPMB, dan perpustakaan.
     12. *Boezang Apple* (`Retail Landing Page`) — Landing page gadget dengan katalog, detail produk, layanan, promo, dan CTA WhatsApp.
     13. *Service AC* (`Service Business`) — Layanan, harga transparan, cara pemesanan, testimonial, FAQ, dan CTA konsultasi.
     14. *Outlet Aiyung* (`Internet Provider`) — Paket provider, harga, pemesanan, layanan, dan dukungan dalam tema visual dark-neon.

---

## 6. Functional Requirements & Page Breakdown

### 6.1 Public Pages (Astro + React Islands)

1. **Floating Glass Navbar:**
   - Navigasi ke `Profile`, `Services`, `Portfolio`, `Tech Stack`, `Blog`, dan tombol CTA `Let's Talk`.
   - Indikator *scroll spy* dengan warna *Purple Aurora*.
2. **Hero Section (`/`) — 3D + Aurora Experience:**
   - Badge status dinamis: `"Available for selected freelance opportunities"` (dengan titik hijau/ungu berdenyut).
   - Tipografi *headline* dengan efek gradien ungu-putih dan animasi *stagger reveal* menggunakan Framer Motion.
   - **Interactive 3D Canvas (`<Hero3DScene client:idle />`):** Objek 3D futuristik bertema *Fullstack & Cosmic Purple* yang merespons gerakan mouse, dilengkapi *floating badges* (`React JS`, `Tailwind CSS`, `Express JS`, `MySQL`, `React Native`).
   - Tombol CTA: `Explore My Work` & `Start a Project`.
3. **Professional Profile & Workflow Section:**
   - Menampilkan kartu statistik (`3 Kategori Utama`, `15+ Showcase Screens`) dalam *Bento Grid* bergaya kaca (*glassmorphism*).
   - Visualisasi alur kerja interaktif: `Konsultasi` → `Design` → `Development` → `Testing` → `Deploy`.
4. **Professional Services Section:**
   - Kartu layanan dengan *Spotlight hover effect* dan tombol pemesanan layanan (mengarah ke Fastwork / WhatsApp).
5. **Featured Projects Showcase (Filterable 3D Tilt Cards):**
   - Tab filter interaktif (`All`, `01 — Web Application`, `02 — Mobile Application`, `03 — Landing Page`) dengan animasi perpindahan `AnimatePresence` dari Framer Motion.
   - Klik kartu membuka halaman detail `/projects/[slug]` atau *Modal Drawer* berisi galeri gambar dari Cloudinary, deskripsi arsitektur, *tech stack badges*, serta tautan Live Demo / GitHub.
6. **Interactive 3D / Orbit Tech Stack Section:**
   - Menampilkan daftar teknologi yang dikuasai dengan efek *glowing border* sesuai warna teknologi.
7. **Blog & Tech News Section (`/blog` & `/blog/[slug]`):**
   - **Di Landing Page (`/`):** Menampilkan 3 artikel terbaru ("Latest Insights & Articles").
   - **Di Halaman `/blog`:** Fitur pencarian artikel secara *real-time*, filter berdasarkan kategori & *tag*, *Featured Post Banner*, serta *pagination*.
   - **Di Halaman Detail `/blog/[slug]`:**
     - *Server-Side Rendered* dengan *Cache-Control* agar super cepat dan langsung terindeks Google.
     - *Table of Contents* otomatis di sisi kanan, estimasi waktu baca, jumlah *views* (otomatis bertambah via *background API fetch*), tombol *Share* (WhatsApp, LinkedIn, X, Copy Link), *Syntax Highlighting* untuk blok kode, dan rekomendasi *Related Posts*.
8. **Contact Section:**
   - Formulir kontak interaktif (menggunakan komponen `shadcn/ui` + validasi `zod`) yang langsung menyimpan pesan ke tabel `contact_messages` di MySQL, dilengkapi tombol pintas ke WhatsApp, Email, GitHub, Instagram, dan LinkedIn.

---

### 6.2 Dynamic Admin Dashboard (`/admin/*`)

Seluruh rute `/admin/*` (kecuali `/admin/login`) wajib dilindungi oleh **Astro Middleware** (`src/middleware.ts`). Gunakan komponen **shadcn/ui** bertema gelap (*Dark Violet Theme*).

1. **Authentication (`/admin/login`):**
   - Login dengan Email & Password, dilindungi *rate-limiting* sederhana dan *HttpOnly Session Cookie*.
2. **Dashboard Overview (`/admin`):**
   - Ringkasan metrik: Total Proyek, Total Artikel Blog (Published vs Draft), Total Views Artikel, dan Pesan Kontak Belum Dibaca.
   - Shortcut untuk *"Tulis Artikel Baru"* dan *"Tambah Proyek Baru"*.
3. **Manajemen Proyek (`/admin/projects`):**
   - Tabel data (`shadcn/ui Table`) dengan filter kategori, pencarian, dan *toggle Featured*.
   - Form Tambah/Edit Proyek lengkap dengan **Cloudinary Drag & Drop Uploader** untuk *Thumbnail* dan *Gallery Images* (mendukung *preview*, hapus gambar lama dari Cloudinary, dan pengurutan).
4. **Manajemen Blog / Berita (`/admin/blog`):**
   - Daftar artikel (Status: `Draft`, `Published`, `Archived`) dan manajemen Kategori Blog.
   - **Editor Artikel (`/admin/blog/new` & `/admin/blog/[id]`):**
     - Menggunakan **TipTap Rich Text Editor** dengan toolbar lengkap (Heading H2-H4, Bold, Italic, Code Block, Quote, List, Link, dan **Upload Gambar ke Cloudinary langsung di dalam isi artikel**).
     - Auto-generate `slug` dari judul dan kalkulasi otomatis `reading_time_minutes`.
     - Pengaturan *Meta Title* & *Meta Description* untuk SEO.
5. **Manajemen Layanan & Tech Stack (`/admin/services` & `/admin/tech-stack`):**
   - CRUD penuh untuk mengubah layanan, link Fastwork, dan daftar *tech stack*.
6. **Pengaturan Profil & Status (`/admin/settings`):**
   - Ubah bio, foto profil, link sosial media, nomor WhatsApp, dan *toggle switch* `"Available for freelance opportunities"` secara *real-time*.
7. **Inbox Pesan (`/admin/messages`):**
   - Membaca pesan dari pengunjung, menandai sudah dibaca, dan menghapus pesan.

---

## 7. Cloudinary Integration Architecture

Semua unggahan gambar (Thumbnail Proyek, Galeri, Cover Blog, maupun Gambar di dalam Editor Artikel) tidak boleh disimpan di *filesystem* lokal server, melainkan langsung ke **Cloudinary**.

1. **API Endpoint Upload (`POST /api/admin/upload`):**
   - Hanya dapat diakses oleh Admin yang sudah login.
   - Menerima `FormData` berisi file gambar dan parameter `folder` (contoh: `gentha-portfolio/projects`, `gentha-portfolio/blog`, `gentha-portfolio/profile`).
   - Mengunggah ke Cloudinary menggunakan SDK `cloudinary.v2.uploader.upload_stream` dengan opsi transformasi otomatis:
     - Format otomatis ke `webp` / `avif` (`fetch_format: "auto"`, `quality: "auto:good"`).
   - Mengembalikan JSON: `{ secure_url: string, public_id: string, width: number, height: number }`.
2. **API Endpoint Delete (`DELETE /api/admin/upload`):**
   - Ketika proyek/artikel dihapus atau gambarnya diganti di Admin, panggil `cloudinary.v2.uploader.destroy(public_id)` agar penyimpanan Cloudinary tetap bersih dan hemat kuota.

---

## 8. Recommended Project Folder Structure

```text
├── astro.config.mjs
├── drizzle.config.ts
├── package.json
├── tailwind.config.mjs
├── .env.example
├── src/
│   ├── middleware.ts                  # Proteksi rute /admin & /api/admin
│   ├── env.d.ts
│   ├── styles/
│   │   └── globals.css                # Variabel CSS Dark Purple Aurora & Tailwind
│   ├── db/
│   │   ├── index.ts                   # Koneksi pool mysql2 + Drizzle instance
│   │   ├── schema.ts                  # Definisi seluruh tabel MySQL
│   │   └── seed.ts                    # Seed data awal dari mgentaarya.my.id
│   ├── lib/
│   │   ├── auth.ts                    # Helper JWT / Session & Password hashing
│   │   ├── cloudinary.ts              # Konfigurasi Cloudinary SDK & URL optimizer
│   │   └── utils.ts                   # Helper cn() shadcn, format tanggal, slugify
│   ├── components/
│   │   ├── ui/                        # Komponen shadcn/ui (Button, Dialog, Table, Input, dll.)
│   │   ├── three/
│   │   │   ├── Hero3DScene.tsx        # React Three Fiber 3D Interactive Scene
│   │   │   └── CosmicParticles.tsx    # Efek partikel 3D ringan
│   │   ├── public/
│   │   │   ├── AuroraBackground.tsx   # Efek latar Purple Aurora
│   │   │   ├── FloatingNavbar.tsx     # Navbar kaca melayang
│   │   │   ├── ProjectGrid.tsx        # Filter + 3D Tilt Project Cards (Framer Motion)
│   │   │   ├── ServiceCards.tsx       # Kartu layanan dengan efek spotlight
│   │   │   ├── TechStackOrbit.tsx     # Grid/Orbit tech stack
│   │   │   └── ContactForm.tsx        # Form kontak interaktif
│   │   └── admin/
│   │       ├── AdminSidebar.tsx       # Navigasi dashboard admin
│   │       ├── CloudinaryUploader.tsx # Komponen drag-and-drop upload ke Cloudinary
│   │       ├── TipTapEditor.tsx       # Rich text editor untuk blog
│   │       ├── ProjectFormModal.tsx   # Form CRUD Proyek
│   │       └── BlogForm.tsx           # Form CRUD Artikel Blog
│   ├── layouts/
│   │   ├── PublicLayout.astro         # Layout utama pengunjung (SEO, OG Tags, Aurora Theme)
│   │   └── AdminLayout.astro          # Layout dashboard admin
│   └── pages/
│       ├── index.astro                # Halaman Utama Portofolio 3D
│       ├── projects/
│       │   ├── index.astro            # Katalog penuh proyek
│       │   └── [slug].astro           # Detail studi kasus proyek
│       ├── blog/
│       │   ├── index.astro            # Portal daftar artikel/berita + filter
│       │   └── [slug].astro           # Halaman baca artikel (SEO + TOC + Share)
│       ├── admin/
│       │   ├── login.astro
│       │   ├── index.astro            # Dashboard statistik
│       │   ├── projects.astro         # CRUD Proyek
│       │   ├── blog/
│       │   │   ├── index.astro        # Daftar artikel
│       │   │   ├── new.astro          # Tulis artikel baru
│       │   │   └── [id].astro         # Edit artikel
│       │   ├── services.astro         # CRUD Layanan & Tech Stack
│       │   ├── messages.astro         # Pesan masuk
│       │   └── settings.astro         # Edit profil & sosial media
│       └── api/
│           ├── contact.ts             # POST pesan dari pengunjung
│           ├── blog/
│           │   └── [slug]/view.ts     # POST increment view counter
│           └── admin/
│               ├── auth/login.ts
│               ├── auth/logout.ts
│               ├── upload.ts          # POST & DELETE Cloudinary image
│               ├── projects.ts        # CRUD API Proyek
│               ├── blog.ts            # CRUD API Blog
│               ├── services.ts        # CRUD API Layanan & Tech Stack
│               └── settings.ts        # PUT Update Profil
```

---

## 9. Environment Variables (`.env.example`)

```env
# Database (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/gentha_portfolio_db"

# Admin Authentication
JWT_SECRET="ganti-dengan-secret-key-minimal-32-karakter-acak"
ADMIN_INITIAL_EMAIL="admin@example.com"
ADMIN_INITIAL_PASSWORD="ChangeMe123!"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="nama_cloud_kamu"
CLOUDINARY_API_KEY="api_key_cloudinary_kamu"
CLOUDINARY_API_SECRET="api_secret_cloudinary_kamu"
PUBLIC_CLOUDINARY_CLOUD_NAME="nama_cloud_kamu"

# Site Metadata
PUBLIC_SITE_URL="https://www.mgentaarya.my.id"
```

---

## 10. Step-by-Step Implementation Plan for Antigravity

> **Instruksi Eksekusi untuk AI Agent (Antigravity):** Kerjakan proyek ini secara bertahap mengikuti 5 fase di bawah ini agar kode bebas dari *error* dan mudah diuji.

- **Phase 1 — Project Initialization & Database Setup:**
  1. Inisialisasi proyek Astro dengan TypeScript, Tailwind CSS, dan integrasi `@astrojs/react`.
  2. Konfigurasi tema warna *Dark Purple Aurora* di `tailwind.config.mjs` dan `globals.css`, serta pasang komponen dasar `shadcn/ui`.
  3. Buat skema database MySQL menggunakan Drizzle ORM (`src/db/schema.ts`), jalankan migrasi, dan buat script `src/db/seed.ts` yang berisi seluruh data proyek asli dari `mgentaarya.my.id` serta 1 akun Admin dan 3 artikel blog contoh.
- **Phase 2 — Authentication, Cloudinary API & Admin Dashboard (`/admin`):**
  1. Buat sistem autentikasi (`src/lib/auth.ts` & `src/middleware.ts`) dan halaman `/admin/login`.
  2. Buat integrasi Cloudinary (`src/lib/cloudinary.ts` & `/api/admin/upload`) serta komponen `CloudinaryUploader.tsx`.
  3. Bangun halaman Admin untuk mengelola Profil, Proyek, Layanan, Tech Stack, dan Pesan Kontak.
- **Phase 3 — Blog CMS & Public Blog Portal (`/blog`):**
  1. Bangun halaman manajemen Blog di `/admin/blog` lengkap dengan **TipTap Rich Text Editor** dan fitur unggah gambar ke Cloudinary.
  2. Bangun halaman publik `/blog` (pencarian, filter kategori) dan `/blog/[slug]` (SEO meta tags, OpenGraph image dari Cloudinary, Table of Contents, *syntax highlighting*, dan *view counter*).
- **Phase 4 — 3D Interactive Portfolio & Framer Motion Animations (`/`):**
  1. Bangun komponen `AuroraBackground.tsx` dan `Hero3DScene.tsx` menggunakan `@react-three/fiber` dan `@react-three/drei` dengan optimasi `client:idle`.
  2. Bangun seluruh *section* di halaman utama (`Hero`, `Profile & Workflow`, `Services`, `Filterable 3D Tilt Projects`, `Tech Stack`, `Latest Blog Posts`, dan `Contact Form`) menggunakan **Framer Motion**.
- **Phase 5 — Performance Optimization & SEO Polish:**
  1. Pastikan semua gambar dari Cloudinary menggunakan parameter transformasi `f_auto,q_auto`.
  2. Tambahkan `sitemap` dan `robots.txt` agar artikel blog dan halaman portofolio terindeks optimal di Google.