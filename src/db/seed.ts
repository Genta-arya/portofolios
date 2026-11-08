import { db, pool } from './index';
import {
  users,
  siteSettings,
  services,
  projects,
  techStacks,
  blogCategories,
  blogPosts,
} from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding for Gentha Arya Pratama...');

  try {
    // 1. Seed Site Settings (ID 1)
    console.log('📌 Seeding Site Settings...');
    await db.insert(siteSettings).values({
      id: 1,
      fullName: 'Gentha Arya Pratama',
      roleTitle: 'Fullstack Developer · Web & Mobile',
      shortBio: 'Fullstack Developer berpengalaman dalam membangun solusi web dan mobile modern, performan, dan scalable. Berfokus pada arsitektur bersih, UI/UX interaktif, serta integrasi database yang andal.',
      aboutDescription: 'Halo! Saya Gentha Arya Pratama, seorang Fullstack Developer yang berfokus pada ekosistem web modern (React, Astro, Next.js, Express, MySQL) dan aplikasi mobile (React Native, Android). Terbiasa menangani siklus hidup pengembangan perangkat lunak dari perancangan antarmuka, pembuatan REST API terstruktur, manajemen database, integrasi payment gateway / Cloudinary, hingga deployment server.',
      availableForHire: true,
      heroAvatarUrl: '/avatar.png',
      resumeUrl: '#',
      githubUrl: 'https://github.com/Genta-arya',
      linkedinUrl: 'https://linkedin.com/in/mgentaarya',
      instagramUrl: 'https://instagram.com/gentaarya',
      fastworkUrl: 'https://fastwork.id/user/babfpfzm',
      whatsappNumber: null,
      emailContact: 'mgentaarya@gmail.com',
      statsCategoriesCount: 3,
      statsProjectsCount: '15+',
    }).onDuplicateKeyUpdate({
      target: siteSettings.id,
      set: {
        fullName: 'Gentha Arya Pratama',
        roleTitle: 'Fullstack Developer · Web & Mobile',
        fastworkUrl: 'https://fastwork.id/user/babfpfzm',
        availableForHire: true,
      },
    });

    // 2. Seed Admin User
    console.log('📌 Seeding Admin User...');
    const salt = await bcrypt.genSalt(10);
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe123!';
    const initialEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@example.com';
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    await db.insert(users).values({
      name: 'Gentha Arya Pratama',
      email: initialEmail,
      passwordHash,
      avatarUrl: '/avatar.png',
    }).onDuplicateKeyUpdate({
      target: users.email,
      set: {
        passwordHash,
        name: 'Gentha Arya Pratama',
      },
    });

    // 3. Seed Services
    console.log('📌 Seeding Services...');
    const initialServices = [
      {
        title: 'Landing Page & Profile',
        subtitle: 'High-Converting & Responsive Website',
        description: 'Perancangan landing page profil bisnis, UMKM, institusi pendidikan, dan e-commerce dengan visual cosmic/aurora modern, animasi halus, serta SEO teroptimasi.',
        iconName: 'Sparkles',
        tags: ['Astro', 'React', 'Framer Motion', 'Tailwind CSS', 'SEO Friendly'],
        ctaUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514?source=seller-center_my-service',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'Web Application',
        subtitle: 'Custom Web App & Sistem Informasi',
        description: 'Membangun aplikasi web enterprise, sistem inventori, portal manajemen, dan dashboard interaktif dengan arsitektur modern, proteksi role-based auth, serta REST API cepat.',
        iconName: 'LayoutDashboard',
        tags: ['React JS', 'Express JS', 'MySQL', 'Tailwind CSS', 'REST API'],
        ctaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045?source=seller-center_my-service',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'Mobile Application',
        subtitle: 'Android & Cross-Platform App Development',
        description: 'Pengembangan aplikasi mobile responsif untuk Android menggunakan React Native & Kotlin, terintegrasi real-time geolocation, push notification, dan offline storage.',
        iconName: 'Smartphone',
        tags: ['React Native', 'Kotlin', 'Android APK', 'Expo', 'REST API'],
        ctaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967?source=seller-center_my-service',
        displayOrder: 3,
        isActive: true,
      },
    ];

    for (const s of initialServices) {
      await db.insert(services).values(s);
    }

    // 4. Seed Tech Stacks
    console.log('📌 Seeding Tech Stacks...');
    const initialTech = [
      { name: 'React JS', roleLabel: 'Frontend UI', category: 'frontend' as const, glowColor: '#61DAFB', displayOrder: 1 },
      { name: 'Astro', roleLabel: 'Meta-Framework', category: 'frontend' as const, glowColor: '#FF5D01', displayOrder: 2 },
      { name: 'Next.js', roleLabel: 'Fullstack React', category: 'frontend' as const, glowColor: '#FFFFFF', displayOrder: 3 },
      { name: 'Tailwind CSS', roleLabel: 'Modern Styling', category: 'frontend' as const, glowColor: '#38BDF8', displayOrder: 4 },
      { name: 'TypeScript', roleLabel: 'Type Safety', category: 'frontend' as const, glowColor: '#3178C6', displayOrder: 5 },
      { name: 'Node.js', roleLabel: 'Runtime Backend', category: 'backend' as const, glowColor: '#5FA04E', displayOrder: 6 },
      { name: 'Express JS', roleLabel: 'REST API', category: 'backend' as const, glowColor: '#8B5CF6', displayOrder: 7 },
      { name: 'Drizzle ORM', roleLabel: 'High-Speed ORM', category: 'backend' as const, glowColor: '#C5F74F', displayOrder: 8 },
      { name: 'MySQL', roleLabel: 'Relational Database', category: 'database' as const, glowColor: '#4479A1', displayOrder: 9 },
      { name: 'React Native', roleLabel: 'Mobile Android/iOS', category: 'mobile' as const, glowColor: '#61DAFB', displayOrder: 10 },
      { name: 'Kotlin', roleLabel: 'Native Android', category: 'mobile' as const, glowColor: '#7F52FF', displayOrder: 11 },
      { name: 'Cloudinary', roleLabel: 'Media Storage CDN', category: 'devops' as const, glowColor: '#3448C5', displayOrder: 12 },
    ];

    for (const t of initialTech) {
      await db.insert(techStacks).values(t);
    }

    // 5. Seed Projects
    console.log('📌 Seeding Portfolio Projects...');
    const initialProjects = [
      // === CATEGORY: WEB APPLICATION (5 Proyek) ===
      {
        title: 'E-Perpustakaan (E-Library) SMKN 2 Ketapang',
        slug: 'elibrary-smkn2-ketapang',
        category: 'web_app' as const,
        subcategoryBadge: 'Sistem Pendidikan',
        shortDescription: 'Sistem perpustakaan digital terintegrasi untuk SMKN 2 Ketapang dengan katalog ribuan buku, pencatatan peminjaman, kunjungan harian, dan laporan otomatis berbasis web.',
        fullContent: 'E-Perpustakaan (E-Library) SMKN 2 Ketapang dibangun untuk mempermudah digitalisasi koleksi buku sekolah. Fitur utama mencakup katalog buku digital, manajemen peminjaman & pengembalian buku, statistik grafik peminjaman, pencatatan kunjungan harian, serta ekspor laporan ke berbagai format.',
        techStack: ['React JS', 'Express JS', 'MySQL', 'Tailwind CSS', 'REST API'],
        thumbnailUrl: '/projects/elibrary-smkn2-ketapang.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        githubRepoUrl: 'https://github.com/Genta-arya/eperpus-aljihad',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        title: 'Sistem Manajemen Bengkel & Service — Service Station Center',
        slug: 'sistem-manajemen-bengkel-service',
        category: 'web_app' as const,
        subcategoryBadge: 'Manajemen Bisnis',
        shortDescription: 'Aplikasi manajemen bengkel untuk pencatatan stok suku cadang, penugasan teknisi, transaksi servis, kasir, serta rekapitulasi laporan keuangan laba-rugi terstruktur.',
        fullContent: 'Platform aplikasi web komprehensif untuk operasional bengkel dan service station center. Membantu pemilik usaha mengelola inventori suku cadang, penugasan dan komisi teknisi, pencatatan transaksi kasir, analisis keuntungan per periode, dan grafik pendapatan bulanan.',
        techStack: ['React JS', 'Express JS', 'MySQL', 'Chart.js', 'REST API'],
        thumbnailUrl: '/projects/manajemen-bengkel-service.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        githubRepoUrl: 'https://github.com/Genta-arya/API-Bengkel',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        isFeatured: true,
        displayOrder: 2,
      },
      {
        title: 'Sistem Admin Toko Online — Boezang Apple',
        slug: 'sistem-admin-toko-online-boezang-apple',
        category: 'web_app' as const,
        subcategoryBadge: 'E-Commerce Admin',
        shortDescription: 'Dashboard admin retail toko gadget Apple untuk mengelola katalog produk, varian warna/storage, pop-up harga, event promo, quotes, dan pelacakan pengiriman pesanan.',
        fullContent: 'Dashboard administrasi toko retail gadget Boezang Apple yang dirancang khusus untuk mempermudah manajemen ratusan produk Apple. Dilengkapi fitur custom pop-up harga, jadwal diskon event & promo, verifikasi quotes pelanggan, pelacakan ekspedisi pesanan, serta monitoring omset toko.',
        techStack: ['React JS', 'Express JS', 'MySQL', 'Zustand', 'REST API'],
        thumbnailUrl: '/projects/admin-boezang-apple.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        githubRepoUrl: 'https://github.com/Genta-arya/adminBoezang',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        isFeatured: true,
        displayOrder: 3,
      },
      {
        title: 'Sistem Inventori & Aset Sarpras SMKN 2 Ketapang',
        slug: 'sistem-inventori-smkn-2-ketapang',
        category: 'web_app' as const,
        subcategoryBadge: 'Manajemen Aset',
        shortDescription: 'Sistem inventori aset sekolah berbasis web dengan fitur cetak QR Code & Barcode barang, pencatatan penerimaan stok, peminjaman alat praktik, dan monitoring kondisi aset.',
        fullContent: 'Sistem inventori dan manajemen sarana prasarana sekolah di SMKN 2 Ketapang. Membantu tim sarpras dalam pendataan aset elektronik dan perlengkapan kelas, pembuatan barcode/QR Code untuk inventarisasi fisik, pengawasan peminjaman alat laboratorium, dan cetak berita acara inventaris.',
        techStack: ['React JS', 'Express JS', 'MySQL', 'QR Code Generator', 'REST API'],
        thumbnailUrl: '/projects/sistem-inventori-smk.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        githubRepoUrl: 'https://github.com/Genta-arya/SERVER-INVENTARIS',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        isFeatured: true,
        displayOrder: 4,
      },
      {
        title: 'Sistem Informasi Kepegawaian (SIMPEG) — KPU Kabupaten Sekadau',
        slug: 'simpeg-kpu-kabupaten-sekadau',
        category: 'web_app' as const,
        subcategoryBadge: 'Sistem Pemerintahan',
        shortDescription: 'Sistem kepegawaian dan presensi digital instansi dengan rekapitulasi kehadiran harian/bulanan, verifikasi tanda tangan digital, manajemen data pegawai, dan laporan kinerja.',
        fullContent: 'Sistem Informasi Kepegawaian terintegrasi di lingkungan Komisi Pemilihan Umum (KPU) Kabupaten Sekadau. Memungkinkan monitoring kehadiran staf secara real-time, validasi presensi harian, manajemen data profil dan penempatan unit kerja, rekapitulasi bulanan, serta tanda tangan digital.',
        techStack: ['React JS', 'Express JS', 'MySQL', 'Geolocation API', 'Digital Signature'],
        thumbnailUrl: '/projects/simpeg-kpu-sekadau.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        githubRepoUrl: 'https://github.com/Genta-arya/presensi-kpu',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045',
        isFeatured: true,
        displayOrder: 5,
      },

      // === CATEGORY: MOBILE APPLICATION (6 Proyek) ===
      {
        title: 'Aplikasi Online Ticket Speedboat',
        slug: 'aplikasi-online-ticket-speedboat',
        category: 'mobile_app' as const,
        subcategoryBadge: 'Travel & Ticketing',
        shortDescription: 'Aplikasi mobile pemesanan tiket transportasi laut (speedboat) secara online: pemilihan rute Ketapang - Pangkalan Bun, denah pemilihan kursi interaktif, dan E-Ticket QR Code.',
        fullContent: 'Aplikasi mobile pemesanan tiket transportasi air yang dirancang untuk penumpang speedboat rute antar-kabupaten. Menyediakan informasi jadwal keberangkatan real-time, denah kursi interaktif (tersedia, terisi, dipilih), konfirmasi pembayaran aman, serta penerbitan E-Ticket ber-QR Code untuk boarding cepat.',
        techStack: ['React Native', 'Android Ready', 'Node.js', 'RESTful API'],
        thumbnailUrl: '/projects/online-ticket-speedboat.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        githubRepoUrl: 'https://github.com/Genta-arya/Ticket-Online',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        isFeatured: true,
        displayOrder: 6,
      },
      {
        title: 'Aplikasi Marketplace Kerajinan Lokal',
        slug: 'aplikasi-marketplace-kerajinan-lokal',
        category: 'mobile_app' as const,
        subcategoryBadge: 'E-Commerce Mobile',
        shortDescription: 'Platform mobile penjualan produk kerajinan daerah (anyaman rotan, miniatur kayu, tenun) dengan katalog kategori, detail spesifikasi, chat penjual, dan lacak status pesanan.',
        fullContent: 'Aplikasi mobile e-commerce untuk mengangkat potensi produk UMKM pengrajin lokal. Dilengkapi fitur filter kategori (kayu, rotan, tenun, keramik), rekomendasi produk terlaris, diskon promo, sistem keranjang belanja, integrasi database lokal SQLite, dan pelacakan status pengiriman barang.',
        techStack: ['React Native', 'SQLite Local DB', 'Android APK', 'Clean Architecture'],
        thumbnailUrl: '/projects/marketplace-kerajinan.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        isFeatured: true,
        displayOrder: 7,
      },
      {
        title: 'Aplikasi Pengelolaan Data Ijazah — SMKN 2 Ketapang',
        slug: 'aplikasi-pengelolaan-data-ijazah-smk',
        category: 'mobile_app' as const,
        subcategoryBadge: 'Internal Staf Sekolah',
        shortDescription: 'Aplikasi mobile internal staf SMKN 2 Ketapang untuk mengelola, mencari, dan menyimpan arsip data ijazah digital siswa berdasarkan tahun kelulusan dan jurusan keahlian.',
        fullContent: 'Aplikasi mobile khusus staf tata usaha (TU) SMKN 2 Ketapang guna mempermudah digitalisasi data ijazah alumni. Mendukung pencarian cepat berdasarkan NISN dan nama siswa, filtering per jurusan (Teknik Komputer Jaringan, Akuntansi, Otomotif), riwayat penerbitan, dan laporan rekapitulasi kelulusan.',
        techStack: ['React Native', 'Android Ready', 'REST API', 'Security Auth'],
        thumbnailUrl: '/projects/arsip-ijazah-smk.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        isFeatured: true,
        displayOrder: 8,
      },
      {
        title: 'Aplikasi Pengelolaan Ijazah Digital Multi-Jenjang',
        slug: 'aplikasi-pengelolaan-ijazah-digital',
        category: 'mobile_app' as const,
        subcategoryBadge: 'Digital Archive',
        shortDescription: 'Aplikasi mobile arsip ijazah praktis multi-jenjang (SD, SMP, SMA, D3, S1) dengan fitur pencarian instan, klasifikasi dokumen PDF, serta backup dan restore data terenkripsi.',
        fullContent: 'Solusi arsip digital serbaguna untuk lembaga pendidikan dan instansi dalam mengelola data ijazah seluruh jenjang pendidikan. Dilengkapi fitur upload lampiran dokumen PDF ijazah, pencarian berbasis nomor registrasi, statistik ringkas data tersimpan, serta fitur backup dan restore data berkala.',
        techStack: ['React Native', 'SQLite Local DB', 'Backup & Restore', 'Android'],
        thumbnailUrl: '/projects/kelola-ijazah-digital.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        isFeatured: true,
        displayOrder: 9,
      },
      {
        title: 'Transparansi Data Pembangunan Daerah — Kab. Ketapang',
        slug: 'transparansi-data-pembangunan-ketapang',
        category: 'mobile_app' as const,
        subcategoryBadge: 'Public Government App',
        shortDescription: 'Aplikasi mobile keterbukaan informasi publik pembangunan daerah Kabupaten Ketapang: dashboard anggaran proyek, progres fisik real-time, lokasi peta GPS, dan dokumentasi foto.',
        fullContent: 'Aplikasi mobile inisiatif keterbukaan informasi publik daerah Kabupaten Ketapang. Masyarakat dapat memantau realisasi anggaran proyek infrastruktur jalan/jembatan/sekolah, melihat persentase progres fisik per kecamatan, titik koordinat peta lokasi pengerjaan, kontraktor pelaksana, dan timeline target penyelesaian.',
        techStack: ['React Native', 'Android Ready', 'Map Integration', 'REST API'],
        thumbnailUrl: '/projects/transparansi-pembangunan-ketapang.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        isFeatured: true,
        displayOrder: 10,
      },
      {
        title: 'Aplikasi Info Gempa Bumi & Cuaca BMKG Real-time',
        slug: 'aplikasi-info-gempa-cuaca-bmkg',
        category: 'mobile_app' as const,
        subcategoryBadge: 'Geospatial & Safety',
        shortDescription: 'Aplikasi mobile pemantauan gempa bumi terkini dan prakiraan cuaca di seluruh Indonesia terintegrasi dengan sensor BMKG: visualisasi episentrum peta, magnitudo, dan kedalaman.',
        fullContent: 'Aplikasi informasi bencana gempa bumi dan cuaca real-time yang memanfaatkan open data stream BMKG. Menampilkan peringatan dini gempa terkini di atas 5.0 SR, jarak pusat gempa dari posisi pengguna, kedalaman getaran, riwayat gempa berkala, serta peta sebaran titik seismik interaktif.',
        techStack: ['React Native', 'BMKG Open API', 'Interactive Map', 'Android'],
        thumbnailUrl: '/projects/info-gempa-bmkg.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        githubRepoUrl: 'https://github.com/Genta-arya/Project-Gempa',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967',
        isFeatured: true,
        displayOrder: 11,
      },

      // === CATEGORY: LANDING PAGE (4 Proyek) ===
      {
        title: 'Website Profil Al-Jihad Ketapang — Islamic Studies Center',
        slug: 'website-profil-al-jihad-ketapang',
        category: 'landing_page' as const,
        subcategoryBadge: 'Islamic Institution',
        shortDescription: 'Website profil resmi Al-Jihad Ketapang Islamic Studies Center: perkenalan lembaga, program unggulan santri, publikasi berita, informasi SPMB, galeri kegiatan, dan e-perpustakaan.',
        fullContent: 'Website profil resmi Al-Jihad Ketapang Islamic Studies Center dengan nuansa hijau elegan bernuansa islami modern. Menyajikan informasi profil pengasuh, kurikulum pembelajaran santri, formulir SPMB online, liputan berita & prestasi, galeri dokumentasi foto, dan katalog buku perpustakaan.',
        techStack: ['React JS', 'Tailwind CSS', 'Vercel Deployment', 'Responsive Design'],
        thumbnailUrl: '/projects/landing-aljihad-ketapang.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        isFeatured: true,
        displayOrder: 12,
      },
      {
        title: 'Landing Page Boezang Apple — Apple Gadget Store',
        slug: 'landing-page-boezang-apple',
        category: 'landing_page' as const,
        subcategoryBadge: 'Gadget Retail Store',
        shortDescription: 'Landing page showcase toko retail gadget Apple (iPhone, iPad, MacBook): katalog harga transparan, promosi tukar tambah, garansi produk resmi, dan integrasi tombol WhatsApp order.',
        fullContent: 'Landing page promosi storefront Boezang Apple dengan gaya visual sleek minimalis khas Apple. Memajang etalase produk unggulan iPhone 14/13, aksesori original bergaransi, skema tukar tambah gawai lama, testimoni pelanggan, lokasi cabang toko offline, dan CTA chat WhatsApp instan.',
        techStack: ['React JS', 'Tailwind CSS', 'Responsive UI', 'SEO Friendly'],
        thumbnailUrl: '/projects/landing-boezang-apple.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        githubRepoUrl: 'https://github.com/Genta-arya/BoezangApple',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        isFeatured: true,
        displayOrder: 13,
      },
      {
        title: 'Landing Page Layanan Service AC Profesional',
        slug: 'landing-page-layanan-service-ac',
        category: 'landing_page' as const,
        subcategoryBadge: 'Jasa & Service AC',
        shortDescription: 'Landing page profesional konversi tinggi untuk jasa service & cuci AC: daftar harga transparan (1/2 PK - 2 PK), garansi 30 hari, alur pemesanan mudah, dan tombol WhatsApp instan.',
        fullContent: 'Landing page layanan perbaikan dan perawatan AC rumah tangga maupun kantor. Menampilkan penawaran promo cuci AC, isi freon, perbaikan kompresor bocor, keunggulan teknisi bersertifikat, garansi pengerjaan 30 hari, serta FAQ interaktif yang mendorong konversi pemesanan cepat via WhatsApp.',
        techStack: ['React JS', 'Tailwind CSS', 'Mobile First', 'Fast Performance'],
        thumbnailUrl: '/projects/landing-service-ac.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        isFeatured: true,
        displayOrder: 14,
      },
      {
        title: 'Landing Page Ouast Aiyung — Provider Internet & Paket Data',
        slug: 'landing-page-ouast-aiyung-provider',
        category: 'landing_page' as const,
        subcategoryBadge: 'Telco & Provider Internet',
        shortDescription: 'Landing page bertema modern dark/neon untuk penjualan kartu perdana & paket data internet: daftar kuota AlwaysOn/Happy, estimasi harga, cara pemesanan, dan promo gratis ongkir.',
        fullContent: 'Landing page e-commerce penjualan kuota data internet dan kartu perdana Ouast Aiyung. Mengusung konsep visual cyberpunk/dark neon modern, menyajikan katalog paket data Tri & Telkomsel lengkap dengan masa aktif, panduan pemesanan 4 langkah, promo gratis ongkir, dan WhatsApp direct order.',
        techStack: ['React JS', 'Tailwind CSS', 'Modern Dark UI', 'SEO Friendly'],
        thumbnailUrl: '/projects/landing-ouast-aiyung.png',
        liveDemoUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        githubRepoUrl: 'https://github.com/Genta-arya',
        hireCtaUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514',
        isFeatured: true,
        displayOrder: 15,
      },
    ];

    for (const p of initialProjects) {
      await db.insert(projects).values(p).onDuplicateKeyUpdate({
        target: projects.slug,
        set: {
          title: p.title,
          shortDescription: p.shortDescription,
          thumbnailUrl: p.thumbnailUrl,
          isFeatured: p.isFeatured,
        },
      });
    }

    // 6. Seed Blog Categories & Posts
    console.log('📌 Seeding Blog Categories & Initial Articles...');
    const categories = [
      { name: 'Web Architecture', slug: 'web-architecture', description: 'Arsitektur modern, performa web, dan best practice frontend/backend.' },
      { name: 'Fullstack & Database', slug: 'fullstack-database', description: 'Panduan database MySQL, Drizzle ORM, dan perancangan REST API terstruktur.' },
      { name: 'Mobile Development', slug: 'mobile-development', description: 'Eksplorasi pembuatan aplikasi Android, React Native, dan integrasi API.' },
    ];

    for (const c of categories) {
      await db.insert(blogCategories).values(c).onDuplicateKeyUpdate({
        target: blogCategories.slug,
        set: { name: c.name, description: c.description },
      });
    }

    const initialPosts = [
      {
        title: 'Membangun Web Portofolio Interaktif 3D Berkecepatan Tinggi dengan Astro 5 dan React Three Fiber',
        slug: 'membangun-web-portofolio-3d-astro-5-r3f',
        excerpt: 'Bagaimana memanfaatkan Astro Island Architecture untuk menyajikan pengalaman 3D Three.js yang memukau tanpa mengorbankan skor Lighthouse dan SEO web Anda.',
        content: `
          <h2>Mengapa Astro untuk Web Portofolio 3D?</h2>
          <p>Banyak developer ingin menambahkan elemen 3D ke website portofolio mereka menggunakan Three.js atau React Three Fiber. Namun kendala yang sering terjadi adalah ukuran bundle JavaScript yang membengkak dan menurunkan skor Core Web Vitals secara drastis.</p>
          <p>Dengan <strong>Astro 5 Island Architecture</strong>, seluruh kerangka halaman dirender sebagai HTML murni di server (SSR), sementara komponen 3D hanya di-hydrate di browser saat dibutuhkan menggunakan direktif <code>client:idle</code> atau <code>client:visible</code>.</p>
          <h2>Optimasi Rendering Tiga Dimensi</h2>
          <ul>
            <li>Batasi Device Pixel Ratio (DPR) di rentang <code>[1, 1.5]</code> agar GPU mobile tidak terbebani.</li>
            <li>Gunakan material berbasis instancing untuk partikel debu kosmik.</li>
            <li>Aktifkan frameloop="demand" jika objek tidak sedang dianimasikan secara konstan.</li>
          </ul>
          <p>Hasilnya adalah website dengan tampilan futuristik 3D namun tetap responsif dan instan saat dibuka di perangkat manapun.</p>
        `,
        coverImageUrl: '/projects/elibrary-smk.png',
        status: 'published' as const,
        isFeatured: true,
        readingTimeMinutes: 4,
        viewsCount: 142,
        seoTitle: 'Membangun Web Portofolio Interaktif 3D dengan Astro 5',
        seoDescription: 'Panduan lengkap membangun portofolio interaktif 3D menggunakan Astro 5, Three.js, dan React Islands.',
        publishedAt: new Date(),
      },
      {
        title: 'Mengapa Drizzle ORM Menjadi Pilihan Utama untuk MySQL di Ekosistem Node.js Modern',
        slug: 'mengapa-drizzle-orm-pilihan-utama-mysql-nodejs',
        excerpt: 'Perbandingan performa, zero-overhead, dan type-safety Drizzle ORM dibandingkan ORM tradisional seperti Prisma pada aplikasi serverless & SSR.',
        content: `
          <h2>Type-Safety Tanpa Biaya Overhead</h2>
          <p>Drizzle ORM menghadirkan query builder yang sangat mendekati sintaks SQL native sambil tetap memberikan type-safety penuh dari TypeScript. Tidak ada runtime binary raksasa yang harus di-download seperti pada beberapa ORM generasi sebelumnya.</p>
          <p>Pada arsitektur serverless atau Astro SSR, waktu cold start sangat krusial. Drizzle mampu mengeksekusi query dalam hitungan milidetik karena ia langsung memanfaatkan driver <code>mysql2/promise</code> tanpa lapisan abstraksi yang berat.</p>
        `,
        coverImageUrl: '/projects/boezang-apple.png',
        status: 'published' as const,
        isFeatured: true,
        readingTimeMinutes: 3,
        viewsCount: 98,
        seoTitle: 'Drizzle ORM: Pilihan Terbaik untuk MySQL di Node.js',
        seoDescription: 'Ulasan mendalam keunggulan Drizzle ORM dalam performa dan fleksibilitas query database MySQL.',
        publishedAt: new Date(),
      },
      {
        title: 'Mendesain Aplikasi Mobile Real-Time BMKG Menggunakan React Native & Expo',
        slug: 'mendesain-aplikasi-mobile-bmkg-react-native',
        excerpt: 'Studi kasus implementasi API data gempa BMKG, visualisasi peta episentrum seismik, dan arsitektur state management di Android.',
        content: `
          <h2>Tantangan Menampilkan Data Geografis Real-Time</h2>
          <p>Dalam proyek Project-Gempa, kecepatan penyampaian informasi parameter gempa bumi sangatlah vital. Data yang ditarik dari BMKG di-parse dan langsung divisualisasikan ke koordinat latitude & longitude di peta interaktif.</p>
          <p>Dengan memanfaatkan caching cerdas dan antarmuka bertema gelap kontras tinggi, pengguna dapat segera mengetahui tingkat magnitudo dan radius dampak gempa secara instan.</p>
        `,
        coverImageUrl: '/projects/project-gempa.png',
        status: 'published' as const,
        isFeatured: false,
        readingTimeMinutes: 3,
        viewsCount: 76,
        seoTitle: 'Mendesain Aplikasi Gempa BMKG dengan React Native',
        seoDescription: 'Eksplorasi pengembangan aplikasi mobile real-time BMKG dengan React Native dan Expo.',
        publishedAt: new Date(),
      },
    ];

    for (const post of initialPosts) {
      await db.insert(blogPosts).values(post).onDuplicateKeyUpdate({
        target: blogPosts.slug,
        set: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
        },
      });
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  } finally {
    await pool.end();
  }
}

seed();

