/**
 * Script to generate high-intent long-tail SEO Title, SEO Description, and Keywords
 * for all 92 blog posts to maximize Google Search ranking and organic traffic.
 */
const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const posts = require('./blog_posts_current.json');

const SEO_MAP = {
  1: {
    seo_title: "Cara Membuat Web Portofolio 3D Cepat dengan Astro 5 & Three.js",
    seo_description: "Tutorial langkah demi langkah membangun website portofolio interaktif 3D berkecepatan tinggi menggunakan Astro 5 Island Architecture dan React Three Fiber.",
    tags: ["cara membuat web portofolio 3d", "tutorial astro 5 three js", "astro react three fiber", "portofolio developer 3d"]
  },
  2: {
    seo_title: "Tutorial Drizzle ORM MySQL Node.js: Panduan Setup & Performa",
    seo_description: "Pelajari cara setup Drizzle ORM dengan MySQL di Node.js modern, keunggulan type-safety tanpa overhead, dan perbandingannya dengan Prisma.",
    tags: ["tutorial drizzle orm mysql nodejs", "cara menggunakan drizzle orm", "drizzle orm vs prisma", "database mysql nodejs"]
  },
  3: {
    seo_title: "Cara Membuat Aplikasi Gempa BMKG Real-Time dengan React Native",
    seo_description: "Panduan lengkap integrasi API terbuka BMKG, peta episentrum seismik, dan state management aplikasi mobile peringatan gempa bumi dengan Expo.",
    tags: ["cara membuat aplikasi gempa bmkg", "tutorial react native expo", "integrasi api bmkg", "aplikasi android gempa bumi"]
  },
  4: {
    seo_title: "Panduan Lengkap Vibe Coding 2026: Cara Cepat Bikin Software dengan AI",
    seo_description: "Pelajari teknik Vibe Coding: alur kerja membuat aplikasi fullstack secara instan dengan panduan prompt arsitektur AI tanpa mengetik boilerplate manual.",
    tags: ["panduan vibe coding", "cara membuat software dengan ai", "vibe coding workflow", "ai software engineer indonesia"]
  },
  5: {
    seo_title: "Cara Vibe Coding dengan Google Gemini: Manfaatkan Context 2M Token",
    seo_description: "Trik praktis menggunakan Google Gemini untuk audit seluruh repositori kode, membaca diagram UI, dan integrasi API dalam satu sesi percakapan.",
    tags: ["cara vibe coding google gemini", "tutorial coding google gemini", "context window gemini developer", "ai coding assistant"]
  },
  6: {
    seo_title: "Tutorial Claude 3.7 Sonnet & Claude Code CLI untuk Vibe Coding",
    seo_description: "Panduan menggunakan Claude 3.7 Sonnet hybrid reasoning dan terminal agent Claude Code CLI untuk refactoring kode otomatis dan debugging repositori.",
    tags: ["tutorial claude 3.7 sonnet", "cara pakai claude code cli", "vibe coding claude", "ai reasoning programming"]
  },
  7: {
    seo_title: "Cara Menggunakan GitHub Copilot Agent & OpenAI Codex untuk Koding",
    seo_description: "Panduan memaksimalkan fitur autonomous agent mode pada GitHub Copilot dan model reasoning OpenAI untuk menyelesaikan issue repositori secara mandiri.",
    tags: ["cara menggunakan github copilot agent", "tutorial openai codex", "copilot agent mode", "ai coding otonom"]
  },
  8: {
    seo_title: "Framework Web Terbaik 2026: Rekomendasi Tech Stack Modern & AI",
    seo_description: "Daftar teknologi web paling populer dan efisien di era AI: Astro 5, Bun runtime, Drizzle ORM, dan Tailwind CSS untuk performa maksimal.",
    tags: ["framework web terbaik 2026", "tech stack modern web", "astro 5 bun drizzle", "teknologi web masa kini"]
  },
  9: {
    seo_title: "Contoh Prompt Engineering Developer: Trik Menulis Kode Bebas Bug",
    seo_description: "Pelajari formula prompt teknis terstruktur (P-C-R-O) untuk menghasilkan kode produksi yang rapi, aman dari bug, dan mudah di-maintain.",
    tags: ["contoh prompt engineering developer", "cara prompt ai untuk koding", "prompt coding bebas bug", "panduan prompt developer"]
  },
  10: {
    seo_title: "Masa Depan Karir Programmer di Era AI: Skill yang Tetap Bertahan",
    seo_description: "Analisis mendalam peran software engineer masa depan: mengapa arsitektur sistem, domain knowledge, dan debugging tetap tidak tergantikan oleh AI.",
    tags: ["masa depan karir programmer", "apakah programmer tergantikan ai", "skill wajib software engineer", "karir IT masa depan"]
  },
  11: {
    seo_title: "Perbandingan Gemini vs Claude 3.7 vs OpenAI Codex untuk Coding",
    seo_description: "Benchmark komparasi AI coding terbaik 2026: akurasi sintaks, kemampuan reasoning, batas token, dan rekomendasi model sesuai kebutuhan proyek.",
    tags: ["perbandingan gemini vs claude vs codex", "ai coding terbaik 2026", "benchmark model ai programmer", "pilih ai untuk koding"]
  },
  12: {
    seo_title: "Cara Mengamankan Kode Hasil AI: Mencegah Bug & Celah Keamanan",
    seo_description: "Panduan DevSecOps untuk memeriksa kode buatan AI: cara mendeteksi package halusinasi palsu, kebocoran secret key API, dan celah SQL injection.",
    tags: ["keamanan kode ai", "cara audit kode buatan ai", "mencegah celah vulnerability ai", "devsecops ai coding"]
  },
  13: {
    seo_title: "Cara Membuat Aplikasi Fullstack 1 Hari Menggunakan Vibe Coding",
    seo_description: "Studi kasus nyata membangun aplikasi SaaS lengkap dengan database MySQL, auth JWT, dan payment gateway dari nol dalam waktu 24 jam.",
    tags: ["cara membuat aplikasi fullstack 1 hari", "bikin aplikasi kilat dengan ai", "tutorial fullstack vibe coding", "saas dalam 24 jam"]
  },
  14: {
    seo_title: "Pengalaman Migrasi Node.js ke Bun di Production: Hemat RAM 67%",
    seo_description: "Studi kasus nyata migrasi microservice serverless dari Node.js ke Bun runtime: penghematan memori, p99 latency 3.8x lebih cepat, dan tips kompatibilitas.",
    tags: ["migrasi nodejs ke bun production", "bun runtime vs nodejs", "keuntungan pakai bun server", "benchmark performa bun"]
  },
  15: {
    seo_title: "Kenapa AI Tidak Membunuh Software Engineer: Bedah Mitos Coding",
    seo_description: "Mengapa AI hanya menggantikan tukang ketik sintaks permukaan, sedangkan problem solving, perancangan sistem, dan database locking tetap butuh engineer.",
    tags: ["kenapa ai tidak membunuh programmer", "tukang ketik vs software engineer", "apakah ai menggantikan koder", "realita industri tech"]
  },
  16: {
    seo_title: "Kelemahan React 19 Server Actions & Solusi TanStack Start / Islands",
    seo_description: "Bedah tuntas celah deserialization Flight protocol, masalah memory payload bloat pada React 19 Server Actions, serta alternatif arsitektur modern.",
    tags: ["kelemahan react 19 server actions", "masalah react server components", "tanstack start vs react 19", "arsitektur web modern"]
  },
  17: {
    seo_title: "Panduan Astro 5 Content Layer: Cara Kelola Headless CMS Cepat",
    seo_description: "Pelajari fitur baru Content Layer API di Astro 5 untuk menghubungkan ribuan dokumen markdown, API eksternal, dan database dengan cache bawaan.",
    tags: ["panduan astro 5 content layer", "cara kelola headless cms astro", "astro content collections", "optimasi build astro 5"]
  },
  18: {
    seo_title: "Panduan Arsitektur Micro-Frontends dengan Module Federation 2026",
    seo_description: "Kapan harus mengadopsi micro-frontends? Simak panduan implementasi Module Federation 2.0 untuk tim enterprise multi-repo tanpa over-engineering.",
    tags: ["panduan micro frontends", "tutorial module federation vite webpack", "arsitektur enterprise frontend", "skalabilitas tim web"]
  },
  19: {
    seo_title: "Cara Menggunakan CSS Container Queries untuk Desain Komponen UI",
    seo_description: "Tinggalkan batasan media queries viewport! Panduan praktis CSS Container Queries untuk membuat kartu dan widget yang responsif terhadap ukuran parent-nya.",
    tags: ["cara menggunakan css container queries", "tutorial css container query", "desain komponen responsif css", "modern css tricks"]
  },
  20: {
    seo_title: "Arsitektur Zero-JS Web: Cara Bikin Website Super Cepat Tanpa JS",
    seo_description: "Mitos atau kenyataan? Pelajari teknik membangun web interaktif dengan HTML form primitif, CSS modern, dan server-rendering tanpa JavaScript bloat di client.",
    tags: ["cara membuat web tanpa javascript", "zero js web architecture", "kecepatan web maksimal", "optimasi web super cepat"]
  },
  21: {
    seo_title: "Cara Optimasi INP (Interaction to Next Paint) Skor 100 Web Vitals",
    seo_description: "Panduan membedah metrik INP Google Web Vitals: cara memecah long-tasks JavaScript, memprioritaskan input user, dan menaikkan ranking SEO teknis.",
    tags: ["cara optimasi inp web vitals", "tutorial interaction to next paint", "memperbaiki core web vitals", "skor lighthouse 100"]
  },
  22: {
    seo_title: "Perbedaan Partial Hydration vs Resumability: Qwik vs Astro",
    seo_description: "Pahami perbedaan mendasar Island Architecture Astro dan Resumability Qwik dalam mengeliminasi eksekusi JavaScript yang tidak perlu di browser.",
    tags: ["partial hydration vs resumability", "perbedaan qwik vs astro", "konsep hydration web", "performa framework frontend"]
  },
  23: {
    seo_title: "Tutorial Design System UI dengan CSS Variables & Warna OKLCH",
    seo_description: "Cara membangun design system yang konsisten dan aksesibel memanfaatkan ruang warna OKLCH, CSS tokens, serta mode tema gelap terang otomatis.",
    tags: ["tutorial design system css", "cara pakai warna oklch css", "css custom properties tokens", "desain dark mode web"]
  },
  24: {
    seo_title: "Cara Memangkas Bundle Size JavaScript Web Hingga 70% Lebih Ramping",
    seo_description: "Strategi audit bundle size: tree-shaking efisien, dynamic imports, mengganti dependensi gemuk (moment.js/lodash), dan kompresi Brotli.",
    tags: ["cara memangkas bundle size javascript", "optimasi ukuran bundle web", "tree shaking vite webpack", "mempercepat loading web"]
  },
  25: {
    seo_title: "Cara Konfigurasi Header Keamanan HTTP: Panduan CSP, HSTS & CORS",
    seo_description: "Panduan mengamankan server web produksi dari XSS dan Clickjacking dengan Content Security Policy (CSP), Strict-Transport-Security (HSTS), dan CORS ketat.",
    tags: ["cara konfigurasi header keamanan http", "panduan content security policy csp", "hsts security headers web", "mengamankan website dari xss"]
  },
  26: {
    seo_title: "Tutorial View Transitions API: Animasi Halaman SPA Tanpa Library",
    seo_description: "Pelajari cara membuat transisi navigasi halaman yang mulus layaknya aplikasi mobile native menggunakan standar native Web View Transitions API.",
    tags: ["tutorial view transitions api", "animasi navigasi halaman web", "transisi halaman tanpa framework", "native web animation"]
  },
  27: {
    seo_title: "Cara Optimasi Indeks Database MySQL & PostgreSQL via EXPLAIN",
    seo_description: "Panduan membaca EXPLAIN ANALYZE: teknik membuat composite index, menghindari full table scan, dan mempercepat query SQL lambat hingga 10x lipat.",
    tags: ["cara optimasi indeks mysql postgresql", "tutorial explain analyze sql", "mengatasi query lambat database", "database indexing best practice"]
  },
  28: {
    seo_title: "Perbandingan Drizzle ORM vs Prisma di Lingkungan Serverless",
    seo_description: "Mengapa Drizzle ORM lebih unggul di serverless & edge runtime: cold-start mikrodetik, tanpa rust engine binary besar, dan sintaks mirip SQL murni.",
    tags: ["drizzle orm vs prisma serverless", "perbandingan orm nodejs", "orm tercepat untuk serverless", "drizzle cold start"]
  },
  29: {
    seo_title: "Strategi Caching Redis: Cara Mencegah Cache Stampede & Breakdown",
    seo_description: "Pelajari pola mitigasi Cache Stampede dengan XFetch probabilistic early expiration, mutex locking, dan pre-warming cache pada sistem traffic tinggi.",
    tags: ["strategi caching redis", "cara mencegah cache stampede", "redis cache breakdown solution", "optimasi performa redis"]
  },
  30: {
    seo_title: "Desain Skema Database Multi-Tenant: Siloed vs Pooled Architecture",
    seo_description: "Panduan memilih arsitektur database SaaS multi-tenant: row-level security (pooled) vs schema per tenant (siloed) dari segi biaya dan kepatuhan data.",
    tags: ["desain database multi tenant", "siloed vs pooled multi tenancy", "arsitektur database saas", "row level security postgres"]
  },
  31: {
    seo_title: "Perbandingan REST API vs tRPC vs GraphQL untuk Aplikasi Web Modern",
    seo_description: "Panduan menentukan kontrak komunikasi backend-frontend: kapan memilih kesederhanaan REST, kecepatan full-type tRPC, atau fleksibilitas GraphQL.",
    tags: ["perbandingan rest api vs trpc vs graphql", "pilih trpc atau rest api", "arsitektur api web 2026", "end to end type safety"]
  },
  32: {
    seo_title: "Cara Mengatasi N+1 Problem pada Database: Panduan DataLoader",
    seo_description: "Solusi tuntas masalah N+1 query yang membuat server lambat: teknik batching, query joins, dan implementasi DataLoader pada REST & GraphQL API.",
    tags: ["cara mengatasi n+1 problem database", "solusi n+1 query sql", "tutorial dataloader batching", "optimasi relasi database"]
  },
  33: {
    seo_title: "Tutorial Event-Driven Architecture dengan Apache Kafka & RabbitMQ",
    seo_description: "Panduan pemula memahami arsitektur berbasis event: perbedaan Kafka (log streaming) vs RabbitMQ (message queue), dan pola pub/sub asinkron.",
    tags: ["tutorial event driven architecture", "perbedaan apache kafka vs rabbitmq", "panduan message broker pemula", "arsitektur microservices asinkron"]
  },
  34: {
    seo_title: "Tutorial Menulis Unit Test & Integration Test Efektif dengan Vitest",
    seo_description: "Panduan lengkap menguji aplikasi TypeScript dengan Vitest: strategi mock database, AAA pattern (Arrange-Act-Assert), dan menjaga coverage sehat.",
    tags: ["tutorial unit test vitest", "cara membuat integration test typescript", "panduan testing software", "testing pyramid best practice"]
  },
  35: {
    seo_title: "Cara Setup Connection Pooling Database di Serverless Tanpa Crash",
    seo_description: "Mengatasi error batas koneksi database di AWS Lambda dan Vercel: integrasi Prisma Accelerate, PgBouncer, atau PlanetScale MySQL connection manager.",
    tags: ["cara setup connection pooling serverless", "mengatasi too many connections mysql", "pgbouncer serverless guide", "database pooling lambda"]
  },
  36: {
    seo_title: "Cara Membuat Audit Log Anti-Ubah (Immutable) dengan Database CDC",
    seo_description: "Membangun sistem jejak audit riwayat data transaksi yang aman dan patuh regulasi keuangan menggunakan PostgreSQL triggers dan Debezium CDC.",
    tags: ["cara membuat audit log database", "immutable audit log cdc", "database change data capture", "audit trail transaksi aman"]
  },
  37: {
    seo_title: "Panduan React Native New Architecture: TurboModules & Fabric",
    seo_description: "Pahami cara kerja arsitektur baru React Native: menghapus asynchronous bridge lama dan beralih ke integrasi C++ JSI yang responsif tanpa jeda render.",
    tags: ["panduan react native new architecture", "tutorial turbomodules fabric", "react native bridge vs jsi", "performa react native 2026"]
  },
  38: {
    seo_title: "Cara Membuat Aplikasi Mobile Offline-First dengan WatermelonDB",
    seo_description: "Panduan membangun aplikasi mobile yang tetap berfungsi 100% tanpa internet: caching lokal SQLite WatermelonDB dan sinkronisasi otomatis ke server.",
    tags: ["cara membuat aplikasi offline first", "tutorial watermelondb react native", "sinkronisasi database mobile lokal", "arsitektur offline first"]
  },
  39: {
    seo_title: "Cara Memperkecil Ukuran APK Android: Panduan ProGuard & App Bundles",
    seo_description: "Trik memangkas ukuran APK hingga 60%: aktivasi R8/ProGuard code shrinking, konversi aset WebP, dan implementasi Android App Bundles (AAB).",
    tags: ["cara memperkecil ukuran apk android", "panduan proguard r8 shrinking", "optimasi ukuran aplikasi android", "android app bundle aab"]
  },
  40: {
    seo_title: "Cara Membuat Background Geolocation Tracking Android Hemat Baterai",
    seo_description: "Implementasi pelacakan lokasi latar belakang di Android: menggunakan FusedLocationProviderClient, geofencing, dan foreground service hemat daya.",
    tags: ["background geolocation tracking hemat baterai", "tutorial pelacakan lokasi android", "fused location provider react native", "foreground service gps"]
  },
  41: {
    seo_title: "Perbandingan Flutter vs React Native 2026: Mana Lebih Unggul?",
    seo_description: "Analisis komparasi mendalam Flutter (Dart) vs React Native New Architecture (TypeScript): performa rendering, ekosistem library, dan prospek karir.",
    tags: ["perbandingan flutter vs react native 2026", "pilih flutter atau react native", "kelebihan kekurangan flutter react native", "framework mobile terbaik"]
  },
  42: {
    seo_title: "Cara Mengamankan Aplikasi Mobile dari Reverse Engineering & Decompile",
    seo_description: "Panduan proteksi APK Android dan iOS: SSL pinning, root & jailbreak detection, obfusikasi kode DexGuard, dan enkripsi secure storage.",
    tags: ["cara mengamankan aplikasi mobile", "mencegah reverse engineering apk", "tutorial ssl pinning react native", "keamanan aplikasi android"]
  },
  43: {
    seo_title: "Tutorial Zustand React Native: State Management Ringan Pengganti Redux",
    seo_description: "Mengapa developer beralih dari Redux ke Zustand? Pelajari cara setup store global, persist middleware AsyncStorage, dan optimasi re-render komponen.",
    tags: ["tutorial zustand react native", "zustand vs redux", "state management react ringan", "cara menggunakan zustand store"]
  },
  44: {
    seo_title: "Cara Integrasi Push Notification Firebase FCM & Notifee di Android",
    seo_description: "Tutorial langkah demi langkah setup push notifikasi yang andal: penanganan pesan latar belakang (background handler), badge icon, dan deep linking.",
    tags: ["cara integrasi push notification firebase", "tutorial notifee fcm react native", "notifikasi android latar belakang", "setup firebase cloud messaging"]
  },
  45: {
    seo_title: "Cara Optimasi FlatList React Native untuk Render Ribuan Data Mulus",
    seo_description: "Solusi lag dan patah-patah saat scrolling list panjang: konfigurasi windowSize, maxToRenderPerBatch, getItemLayout, dan FlashList Shopify.",
    tags: ["cara optimasi flatlist react native", "mengatasi lag scroll flatlist", "tutorial flashlist shopify", "render ribuan data react native"]
  },
  46: {
    seo_title: "Tutorial CI/CD Aplikasi Mobile dengan Fastlane dan GitHub Actions",
    seo_description: "Otomatisasi build APK/AAB, signing sertifikat keystore, dan upload langsung ke Google Play Console Internal Track dengan pipeline CI/CD Fastlane.",
    tags: ["tutorial cicd mobile fastlane", "github actions build apk android", "otomatisasi release google play", "devops mobile development"]
  },
  47: {
    seo_title: "Panduan Model Context Protocol (MCP): Arsitektur AI Agent 2026",
    seo_description: "Pelajari standar protokol baru Model Context Protocol (MCP) dari Anthropic: cara menghubungkan AI model dengan database lokal, tools CLI, dan API internal.",
    tags: ["panduan model context protocol mcp", "tutorial mcp anthropic", "arsitektur ai agent mcp", "menghubungkan ai ke database tools"]
  },
  48: {
    seo_title: "Tutorial Advanced RAG: HyDE, Re-Ranking & Hybrid Search LLM",
    seo_description: "Tingkatkan akurasi chatbot dokumen perusahaan: implementasi Hypothetical Document Embeddings (HyDE), Cohere reranker, dan hybrid search BM25.",
    tags: ["tutorial advanced rag llm", "cara meningkatkan akurasi rag", "hyde reranking hybrid search", "retrieval augmented generation enterprise"]
  },
  49: {
    seo_title: "Cara Install AI Coding Assistant Lokal dengan Ollama & DeepSeek Coder",
    seo_description: "Panduan menjalankan model asisten koding offline tanpa kuota dan privasi 100% aman: setup Ollama, download DeepSeek Coder, dan integrasi VS Code Continue.",
    tags: ["cara install ai coding assistant lokal", "tutorial ollama deepseek coder", "ai koding offline vs code", "local llm programming"]
  },
  50: {
    seo_title: "Cara Evaluasi Output LLM Otomatis Menggunakan LLM-as-a-Judge",
    seo_description: "Metode pengukuran kualitas jawaban AI tanpa uji manual: menyusun rubrik evaluasi, menghitung metrik RAG Triad (faithfulness & relevansi) dengan G-Eval.",
    tags: ["cara evaluasi output llm otomatis", "tutorial llm as a judge", "mengukur akurasi chatbot ai", "rag triad evaluation"]
  },
  51: {
    seo_title: "Pilih Fine-Tuning atau RAG? Panduan Memilih Strategi AI yang Tepat",
    seo_description: "Jangan salah invest biaya compute! Analisis perbandingan kapan harus melatih ulang bobot model (fine-tuning) vs menyuntikkan dokumen konteks (RAG).",
    tags: ["fine tuning vs rag", "kapan harus fine tuning model ai", "perbedaan rag dan fine tuning", "strategi adopsi llm bisnis"]
  },
  52: {
    seo_title: "Cara Mengamankan Aplikasi AI dari Serangan Prompt Injection",
    seo_description: "Lindungi sistem LLM Anda dari jailbreak, data exfiltration, dan indirect injection dengan teknik input guardrails NeMo, Llama Guard, dan dual-LLM.",
    tags: ["cara mencegah prompt injection", "keamanan aplikasi llm ai", "jailbreak defense guardrails", "cybersecurity ai prompt"]
  },
  53: {
    seo_title: "Tutorial Structured Outputs LLM: Cara Hasilkan JSON Pasti Valid",
    seo_description: "Hentikan parsing string regex yang rawan error! Pelajari fitur Structured Outputs OpenAI & Gemini berbasis JSON Schema dan Pydantic tool-calling.",
    tags: ["tutorial structured outputs llm", "cara hasilkan json valid dari ai", "json schema tool calling openai", "function calling llm"]
  },
  54: {
    seo_title: "Perbandingan Index Vector Database: Algoritma HNSW vs IVF-Flat",
    seo_description: "Pahami trade-off pencarian vektor untuk sistem RAG: kecepatan latensi, penggunaan memori RAM, dan recall rate algoritma HNSW vs IVF-Flat di Milvus & Qdrant.",
    tags: ["perbandingan vector index hnsw vs ivfflat", "algoritma vector database", "optimasi performa vector search", "qdrant milvus benchmark"]
  },
  55: {
    seo_title: "Cara Menghemat Biaya Token API LLM: Kompresi Prompt & Semantic Cache",
    seo_description: "Trik memangkas tagihan OpenAI / Claude hingga 75%: implementasi semantic caching GPTCache Redis, token pruning, dan prompt distillation.",
    tags: ["cara menghemat biaya token llm", "semantic caching redis openai", "kompresi prompt hemat token", "optimasi biaya api ai"]
  },
  56: {
    seo_title: "Arsitektur Multi-Agent AI Systems: Cara Koordinasi Tim Agen Cerdas",
    seo_description: "Pelajari cara membangun kolaborasi multi-agen dengan LangGraph dan CrewAI: pembagian peran planner, coder, reviewer, dan resolusi konflik otomatis.",
    tags: ["arsitektur multi agent system ai", "tutorial langgraph crewai", "cara membuat agen ai kolaboratif", "multi agent workflow 2026"]
  },
  57: {
    seo_title: "Tutorial Docker Multi-Stage Build: Pangkas Image Node.js 80%",
    seo_description: "Panduan mengecilkan image Docker Node.js dari 1GB menjadi 80MB: memisahkan tahap build dependencies dan runtime production menggunakan Alpine Linux.",
    tags: ["tutorial docker multi stage build", "cara mengecilkan image docker nodejs", "optimasi dockerfile production", "docker alpine slim"]
  },
  58: {
    seo_title: "Cara Membangun Zero-Downtime Deployment: Strategi Blue-Green & Canary",
    seo_description: "Panduan merilis aplikasi web tanpa gangguan bagi pengguna aktif: konfigurasi routing NGINX / Kubernetes ingress, health check, dan rollback instan.",
    tags: ["cara zero downtime deployment", "strategi blue green deployment", "canary release kubernetes", "deploy tanpa offline web"]
  },
  59: {
    seo_title: "Prinsip Clean Code & SOLID: Cara Refactor Kode Kusut Menjadi Elegan",
    seo_description: "Panduan praktis membedah 5 prinsip SOLID di TypeScript: memecah file monolitis (SRP) dan menerapkan Dependency Inversion (DIP) yang mudah di-test.",
    tags: ["prinsip clean code dan solid", "cara refactor kode kusut", "tutorial solid principle typescript", "best practice coding bersih"]
  },
  60: {
    seo_title: "Tutorial Observability Sistem: Setup Metrics, Logs & Traces OpenTelemetry",
    seo_description: "Kupas tuntas 3 pilar observability: instrumentasi tracing otomatis dengan OpenTelemetry, visualisasi dashboard Grafana, dan pencatatan log terpusat.",
    tags: ["tutorial observability opentelemetry", "setup metrics logs traces", "grafana prometheus tempo monitoring", "distributed tracing microservices"]
  },
  61: {
    seo_title: "Tutorial GitOps dengan ArgoCD di Kubernetes: Panduan Deploy Otomatis",
    seo_description: "Otomatisasi deployment infrastruktur: cara menghubungkan repositori Git dengan kluster Kubernetes via ArgoCD untuk sinkronisasi state deklaratif.",
    tags: ["tutorial gitops argocd kubernetes", "cara deploy otomatis argocd", "declarative infrastructure gitops", "k8s continuous delivery"]
  },
  62: {
    seo_title: "Cara Mengamankan Secrets & Password di CI/CD: Tinggalkan Hardcoded",
    seo_description: "Hentikan kebiasaan menyimpan API key di git! Pelajari pengelolaan rahasia aman dengan HashiCorp Vault, AWS Secrets Manager, dan Doppler.",
    tags: ["cara mengamankan secrets cicd", "manajemen credential api key", "hashicorp vault doppler guide", "mencegah kebocoran api key git"]
  },
  63: {
    seo_title: "Panduan Arsitektur Hexagonal (Ports & Adapters) di Node.js & Go",
    seo_description: "Desain software tahan masa depan: memisahkan logika domain bisnis inti dari database dan framework HTTP menggunakan interface ports and adapters.",
    tags: ["panduan arsitektur hexagonal", "tutorial ports and adapters nodejs go", "clean architecture backend", "domain driven design modular"]
  },
  64: {
    seo_title: "Tutorial Load Testing Web dengan k6: Uji Ketahanan Server Skala Tinggi",
    seo_description: "Simulasikan 10.000 pengguna bersamaan: cara menulis skrip stress test k6, membaca metrik latency p95/p99, dan menemukan bottleneck CPU.",
    tags: ["tutorial load testing k6", "cara uji ketahanan server web", "stress testing website k6", "analisis bottleneck server"]
  },
  65: {
    seo_title: "Strategi Backup & Disaster Recovery Database: Hitung Target RTO & RPO",
    seo_description: "Cegah musibah kehilangan data: panduan membuat snapshot otomatis, replikasi WAL continuous archiving, dan simulasi pemulihan bencana (drill test).",
    tags: ["strategi backup disaster recovery database", "menghitung rto rpo database", "pemulihan data crash server", "database snapshot replication"]
  },
  66: {
    seo_title: "Tutorial Regular Expressions (RegEx) Pemula: Pola Praktis Siap Pakai",
    seo_description: "Kuasai RegEx tanpa pusing: panduan lookahead positif/negatif, non-capturing group, validasi email/password kuat, dan cara mencegah celah ReDoS.",
    tags: ["tutorial regex pemula", "cara membaca regular expressions", "contoh pola regex siap pakai", "validasi regex password email"]
  },
  67: {
    seo_title: "Panduan Install Microsoft Office via CLI: Office Deployment Tool (ODT)",
    seo_description: "Cara instalasi paket aplikasi Microsoft Office / 365 secara bersih, cepat, dan otomatis melalui terminal Command Line menggunakan configuration.xml dan ODT.",
    tags: ["panduan install office via cli odt", "cara install microsoft office command line", "tutorial office deployment tool", "instalasi office custom xml"]
  },
  68: {
    seo_title: "Panduan Konfigurasi & Diagnostik Lisensi Office via CMD ospp.vbs",
    seo_description: "Cara mengecek status lisensi, mencopot product key lama yang konflik, dan aktivasi lisensi resmi Microsoft Office melalui Command Prompt (CMD).",
    tags: ["panduan konfigurasi lisensi office cmd", "cara cek status lisensi office ospp vbs", "hapus product key lama office cmd", "aktivasi office legal cmd"]
  },
  69: {
    seo_title: "Cara Install Ulang Windows 10/11 Mudah & Cepat: Panduan Bootable USB",
    seo_description: "Tutorial lengkap instal ulang sistem operasi Windows 10 & 11 dari awal: persiapan flashdisk Rufus, setting boot BIOS/UEFI, hingga partisi hardisk bersih.",
    tags: ["cara install ulang windows 10 11", "tutorial install windows flashdisk rufus", "setting bios uefi install windows", "panduan instalasi windows pemula"]
  },
  70: {
    seo_title: "Arsitektur SaaS Full-Stack Modern: Panduan Edge Computing & AI",
    seo_description: "Cara mendesain sistem SaaS berkecepatan tinggi: pemindahan logika auth ke Cloudflare Workers edge, streaming AI response SSE, dan database multi-tenant.",
    tags: ["arsitektur saas modern fullstack", "edge computing cloudflare workers", "membangun aplikasi saas scalable", "desain sistem saas ai"]
  },
  71: {
    seo_title: "Implementasi Hybrid RAG LLM untuk Chatbot Customer Service B2B",
    seo_description: "Trik membangun asisten customer service yang akurat: kombinasi dense vector search dan sparse BM25 (Reciprocal Rank Fusion) dengan guardrails ketat.",
    tags: ["implementasi hybrid rag llm", "chatbot customer service b2b", "reciprocal rank fusion rrf rag", "arsitektur ai customer support"]
  },
  72: {
    seo_title: "Strategi Migrasi Monolith ke Microservices TypeScript Tanpa Rewrite",
    seo_description: "Terapkan Strangler Fig Pattern: cara memisahkan modul monolitik menjadi microservices bertahap sambil mempertahankan end-to-end type safety.",
    tags: ["migrasi monolith ke microservices typescript", "strangler fig pattern tutorial", "arsitektur modular monolith nodejs", "pembagian service tanpa downtime"]
  },
  73: {
    seo_title: "Panduan Zero-Trust API Security: Cara Implementasi mTLS & OAuth 2.0",
    seo_description: "Tinggalkan model keamanan firewall jadul! Terapkan prinsip Never Trust Always Verify dengan Mutual TLS antar microservices dan token sesi OAuth 2.0.",
    tags: ["panduan zero trust api security", "cara implementasi mtls microservices", "keamanan api oauth 2.0", "zero trust architecture indonesia"]
  },
  74: {
    seo_title: "Panduan Migrasi Web React ke PWA: Service Worker & Fitur Offline",
    seo_description: "Cara mengubah website React menjadi Progressive Web App: setup cache Workbox, background data sync saat sinyal hilang, dan push notification mobile.",
    tags: ["panduan migrasi react ke pwa", "tutorial progressive web app react", "setup service worker workbox", "fitur offline web app"]
  },
  75: {
    seo_title: "Kubernetes GPU Orchestration: Pipeline Container-Native AI Training",
    seo_description: "Optimalkan biaya komputasi AI mahal: teknik pemecahan GPU dengan NVIDIA MIG dan autoscaling cerdas KEDA berdasarkan panjang antrean inferensi.",
    tags: ["kubernetes gpu orchestration", "nvidia mig slice k8s", "autoscaling gpu keda", "container native ai ml pipeline"]
  },
  76: {
    seo_title: "Tutorial GraphQL Federation 2.0: Gabungkan Microservices Tanpa Gateway",
    seo_description: "Satukan multi-subgraph tim backend menjadi Supergraph terpadu menggunakan direktif @key dan @shareable dengan router performa tinggi berbasis Rust.",
    tags: ["tutorial graphql federation 2.0", "menggabungkan microservices graphql", "apollo federation supergraph", "arsitektur api graphql"]
  },
  77: {
    seo_title: "Arsitektur Serverless-First: Dari Lambdalith ke AWS Step Functions",
    seo_description: "Hindari cold start Lambdalith! Pelajari desain event-driven orchestration dengan EventBridge dan state machine Saga Pattern di Step Functions.",
    tags: ["arsitektur serverless first", "aws step functions event driven", "saga pattern serverless", "eventbridge lambda microservices"]
  },
  78: {
    seo_title: "Tutorial WebAssembly Backend: Kompilasi Go ke WASM untuk API Cepat",
    seo_description: "Jalankan fungsi backend dalam mikrodetik dengan WebAssembly System Interface (WASI): ukuran biner super ramping dan isolasi memori sandboxing ketat.",
    tags: ["tutorial webassembly backend", "kompilasi go ke wasm wasi", "backend ultra cepat wasm", "serverless webassembly microservices"]
  },
  79: {
    seo_title: "Integrasi DevSecOps & SIEM: Deteksi Ancaman Siber Otomatis",
    seo_description: "Lindungi sistem dari eksploitasi zero-day: deteksi anomali trafik pemanggilan API menggunakan model machine learning dan respon blokir otomatis WAF.",
    tags: ["integrasi devsecops siem", "deteksi ancaman siber otomatis", "machine learning security monitoring", "soar incident response playbook"]
  },
  80: {
    seo_title: "Migrasi JAMStack ke AI-Native Web: Panduan Generative UI & Vector",
    seo_description: "Tingkatkan interaktivitas web modern: implementasi Generative UI dinamis, pencarian semantik vektor in-browser, dan integrasi model LLM adaptif.",
    tags: ["migrasi jamstack ke ai native", "tutorial generative ui web", "vector search di browser", "arsitektur modern web ai"]
  },
  81: {
    seo_title: "Membangun API Cepat & Aman dengan Rust dan WebAssembly (WASM)",
    seo_description: "Manfaatkan kecepatan bare-metal dan memory safety bahasa Rust dalam format biner WASM: solusi cold start sub-milidetik untuk komputasi tepi (edge).",
    tags: ["membangun api rust webassembly", "tutorial rust wasm backend", "api performa tinggi rust", "memory safety webassembly"]
  },
  82: {
    seo_title: "Strategi Multi-Cloud Kubernetes: Federasi Cluster & Service Mesh Istio",
    seo_description: "Hubungkan cluster AWS EKS dan GCP GKE tanpa keterikatan vendor: setup global service discovery, failover otomatis, dan enkripsi mTLS lintas cloud.",
    tags: ["strategi multicloud kubernetes", "federasi cluster istio service mesh", "koneksi eks dan gke privat", "arsitektur multi cloud enterprise"]
  },
  83: {
    seo_title: "Pola Komunikasi Microservices Apache Kafka: Solusi Outbox Pattern",
    seo_description: "Mencegah data inkonsisten antar layanan: implementasi Idempotent Producer, Transactional Outbox Pattern, dan Change Data Capture Debezium.",
    tags: ["komunikasi microservices apache kafka", "transactional outbox pattern tutorial", "idempotent producer kafka", "event streaming microservices"]
  },
  84: {
    seo_title: "Otomatisasi Keamanan CI/CD: Integrasi SAST, DAST, dan SCA Praktis",
    seo_description: "Deteksi celah kerentanan kode sejak pull request: implementasi Semgrep (SAST), Trivy dependensi (SCA), dan OWASP ZAP (DAST) otomatis.",
    tags: ["otomatisasi keamanan cicd pipeline", "tutorial sast dast sca", "shift left security devsecops", "scanning celah kode github actions"]
  },
  85: {
    seo_title: "Tutorial GraphQL Subscriptions & WebSocket Real-Time Skala Besar",
    seo_description: "Bangun fitur live chat dan notifikasi real-time: setup graphql-ws modern, penanganan koneksi pool, dan sinkronisasi multi-server via Redis Pub/Sub.",
    tags: ["tutorial graphql subscriptions websocket", "real time api graphql ws", "koneksi websocket redis pubsub", "live notification graphql"]
  },
  86: {
    seo_title: "Keamanan Perangkat IoT: Onboarding Zero-Touch & Enkripsi Data Edge",
    seo_description: "Lindungi ekosistem IoT dari botnet: otentikasi sertifikat hardware TPM/Secure Element, protokol MQTT TLS, dan pembaruan firmware aman OTA.",
    tags: ["keamanan perangkat iot", "onboarding zero touch iot", "enkripsi data edge mqtt tls", "firmware ota security update"]
  },
  87: {
    seo_title: "Tutorial AWS API Gateway v2 HTTP APIs: Hemat Biaya 70% & Latensi Rendah",
    seo_description: "Panduan migrasi dari REST API v1 ke HTTP APIs v2: integrasi Lambda hemat biaya, mapping custom domain dengan sertifikat ACM, dan CORS simpel.",
    tags: ["tutorial aws api gateway v2 http", "hemat biaya api gateway lambda", "custom domain api gateway acm", "rest api vs http api aws"]
  },
  88: {
    seo_title: "Tutorial Real-Time Stream Processing Menggunakan Apache Pulsar",
    seo_description: "Keunggulan arsitektur decoupling Apache Pulsar (Brokers vs BookKeeper): isolasi multi-tenancy dan geo-replication otomatis antar data center.",
    tags: ["tutorial apache pulsar stream processing", "keunggulan apache pulsar vs kafka", "real time analytics pulsar", "geo replication event stream"]
  },
  89: {
    seo_title: "Tutorial Setup Monitoring Stack: Prometheus, Grafana & Alertmanager",
    seo_description: "Bangun dashboard observability produksi: pembuatan custom metric prometheus di Node.js, visualisasi panel Grafana, dan konfigurasi alert cerdas.",
    tags: ["tutorial setup prometheus grafana", "monitoring server alertmanager", "custom metric nodejs prometheus", "dashboard observability grafana"]
  },
  90: {
    seo_title: "Tutorial Policy-as-Code Terraform: Validasi Keamanan dengan OPA Rego",
    seo_description: "Cegah salah konfigurasi cloud sejak fase Pull Request: cara menulis aturan keamanan Open Policy Agent (OPA) untuk memblokir port publik di Terraform.",
    tags: ["tutorial policy as code terraform", "open policy agent opa rego", "keamanan infrastructure as code", "gitops security validation"]
  },
  92: {
    seo_title: "Panduan Teknologi Backend Modern 2026: Arsitektur & Database Terbaik",
    seo_description: "Panduan lengkap memilih arsitektur backend modern: Node.js vs Go vs Bun, database relasional vs vector, dan strategi perancangan REST API teruji.",
    tags: ["panduan teknologi backend modern", "arsitektur backend terbaik 2026", "belajar backend engineering", "database api microservices"]
  },
  93: {
    seo_title: "Cara Instalasi Opencode di Tahun 2026: Panduan Setup Cepat & Mudah",
    seo_description: "Tutorial langkah demi langkah menginstal dan mengonfigurasi Opencode di lingkungan lokal: persiapan dependensi, konfigurasi environment, dan verifikasi.",
    tags: ["cara instalasi opencode 2026", "tutorial setup opencode", "panduan install opencode pemula", "konfigurasi opencode"]
  }
};

async function runUpdate() {
  console.log('Connecting to database...');
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  let updatedCount = 0;
  for (const post of posts) {
    const seoData = SEO_MAP[post.id];
    if (!seoData) {
      console.log(`⏩ Skipping ID ${post.id}: No custom mapping defined.`);
      continue;
    }

    const { seo_title, seo_description, tags } = seoData;

    await conn.execute(
      `UPDATE blog_posts 
       SET seo_title = ?, 
           seo_description = ?, 
           tags = ?, 
           updated_at = NOW() 
       WHERE id = ?`,
      [seo_title, seo_description, JSON.stringify(tags), post.id]
    );

    console.log(`✓ [ID ${post.id}] Updated SEO: "${seo_title.slice(0, 45)}..."`);
    updatedCount++;
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} articles with Long-Tail Intent Keywords!`);
  await conn.end();
}

runUpdate().catch(err => {
  console.error('Error during SEO update:', err);
  process.exit(1);
});
