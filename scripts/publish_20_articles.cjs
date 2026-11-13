require('dotenv').config();
const mysql = require('mysql2/promise');

async function generateArticleContent(title, slug) {
  const baseContent = `## Pengantar

Artikel ini membahas ${title.toLowerCase()} untuk pengembangan web modern dan teknologi.

## Mengapa Ini Penting

Dalam dunia teknologi yang berkembang pesat, ${title.toLowerCase()} telah menjadi aspek krusial dalam pengembangan aplikasi dan solusi digital.

## Implementasi Praktis

### Setup Dasar

Pertama, kita perlu menyiapkan lingkungan pengembangan:

\\\`\\\`\\\`bash
npm install package-example
\\\`\\\`\\\`

### Best Practices

#### 1. Keamanan

- Gunakan autentikasi yang kuat
- Implementasi enkripsi data
- Regular security audit

#### 2. Performans

- Optimalkan query database
- Implementasi caching
- Gunakan CDN untuk aset statis

### Contoh Penggunaan

Berikut adalah contoh implementasi:

\\\`\\\`\\\`javascript
const example = {
  id: 1,
  name: '${title}',
  description: 'Example ${title}',
  created_at: new Date().toISOString()
};

console.log(example);
\\\`\\\`\\\`

## Kesimpulan

${title} merupakan komponen penting dalam teknologi modern. Memahami konsep dasarnya dan mengimplementasikannya dengan benar akan membantu Anda membangun solusi yang robust dan skalabel.

## Referensi

- Documentasi resmi ${title.toLowerCase()}
- Praktik terbaik komunitas
- Sumber belajar tambahan

---

*Artikel ini merupakan contoh generik. Setiap artikel asli akan memiliki content HTML/Markdown yang spesifik dan berkualitas tinggi.*
`;
  return baseContent;
}

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('Inserting 20 new articles into database...\n');

  const articles = [
    {
      title: "Mendesain Arsitektur SaaS Full-Stack Modern dengan Edge Computing & AI Services",
      slug: "mendesain-arsitektur-saas-full-stack-modern-edge-computing-ai-services",
      excerpt: "Bagaimana merancang SaaS yang skalabel, cepat, dan hemat biaya dengan edge computing, AI services terdistribusi, dan pengembangan multi-cloud menggunakan micro-frontends dan server-side rendering.",
      coverImageUrl: "https://images.unsplash.com/photo-1581276821106-f7166591fbde?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 10,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Arsitektur SaaS Modern: Edge Computing & AI Services Guide",
      seoDescription: "Panduan lengkap merancang arsitektur SaaS modern menggunakan edge computing, micro-frontends, AI services terdistribusi untuk performa optimal dan biaya efisien."
    },
    {
      title: "Implementasi RAG LLM Hybrid Architecture untuk Chatbots Customer Service B2B",
      slug: "implementasi-rag-llm-hybrid-architecture-chatbots-customer-service-b2b",
      excerpt: "Implementasi Retrieval-Augmented Generation (RAG) dengan LLM hybrid untuk chatbots customer service B2B yang harus selalu benar, terintegrasi dengan knowledge base perusahaan, dan menjaga konteks percakapan selama berjam-jam.",
      coverImageUrl: "https://images.unsplash.com/photo-1677442136019-42c88815d424?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 8,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "RAG LLM Architecture untuk Chatbot B2B Customer Service",
      seoDescription: "Implementasi lengkap RAG dengan LLM hybrid, vector database, dan knowledge base management untuk chatbots customer service enterprise."
    },
    {
      title: "TypeScript First Backend: Building Scalable Monolith ke Microservices tanpa Rewrite",
      slug: "typescript-first-backend-building-scalable-monolith-ke-microservices-tanpa-rewrite",
      excerpt: "Strategi migrasi TypeScript-first monolith ke microservices tanpa downtime, menggunakan gradual service extraction, berbagi kode, dan tipe safety di seluruh arsitektur.",
      coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 7,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "TypeScript First Backend: Monolith to Microservices",
      seoDescription: "Panduan migrasi monolitik TypeScript ke microservices dengan micro frontends, shared kernel, dan domain-driven design."
    },
    {
      title: "Zero-Trust API Security: From Internal Network ke Zero Trust dengan mTLS & OAuth 2.0",
      slug: "zero-trust-api-security-internal-network-zero-trust-mtls-oauth-2-0",
      excerpt: "Migrasi dari keamanan perimeter-based ke zero-trust architecture dengan mTLS mutual authentication, OAuth 2.0/OpenID Connect, dan API gateway microsegmentasi.",
      coverImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 9,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Zero Trust API Security with mTLS & OAuth 2.0",
      seoDescription: "Implementasi zero-trust networking untuk API dengan mutual TLS, OAuth 2.0, API gateway security, dan microsegmentasi."
    },
    {
      title: "Progressive Web Apps (PWA) 2024: Migration Guide dari React Web ke SPA Modern",
      slug: "progressive-web-apps-pwa-2024-migration-guide-react-web-spa-modern",
      excerpt: "Strategi lengkap migrasi aplikasi web React ke Progressive Web App dengan service workers, push notifications, offline cache strategies, dan native-like experience.",
      coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd47621?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 6,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "PWA 2024: Migration Guide React Web ke SPA Modern",
      seoDescription: "Cara implementasi Progressive Web Apps dengan service worker, offline strategies, push notifications, dan manifest web untuk pengalaman mobile native."
    },
    {
      title: "Container-Native AI/ML Pipeline: Kubernetes GPU Orchestration untuk Model Training",
      slug: "container-native-ai-ml-pipeline-kubernetes-gpu-orchestration-model-training",
      excerpt: "Membangun pipeline ML lengkap di Kubernetes dengan GPU autoscaling, distributed training jobs, model serving, dan CI/CD pipeline untuk AI/ML ops produksi.",
      coverImageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c8709d?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 11,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Container-Native AI/ML Pipeline with Kubernetes GPU",
      seoDescription: "Panduan lengkap training model ML di Kubernetes, GPU orchestration, distributed training, dan AI/ML ops produksi."
    },
    {
      title: "GraphQL Federation 2.0: Menggabungkan Microservices GraphQL tanpa API Gateway",
      slug: "graphql-federation-2.0-menggabungkan-microservices-graphql-tanpa-api-gateway",
      excerpt: "Implementasi GraphQL Federation 2.0 dengan subgraphs yang didefinisikan, introspection discovery, dan schema stitching untuk tanpa API gateway pusat.",
      coverImageUrl: "https://images.unsplash.com/photo-1567259291459-6b2e3b7e3b7a?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 8,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "GraphQL Federation 2.0: Microservices without API Gateway",
      seoDescription: "Cara mengimplementasi GraphQL Federation 2.0 dengan subgraph definition, introspection discovery, dan schema stitching."
    },
    {
      title: "Serverless-First Architecture: Dari Monolith Serverless ke Step Functions & Event-Driven",
      slug: "serverless-first-architecture-monolith-serverless-step-functions-event-driven",
      excerpt: "Migrasi monolit ke serverless-first architecture menggunakan AWS Lambda, Step Functions, event-driven design, dan desain event bus untuk aplikasi cloud native.",
      coverImageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c8709d?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 7,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Serverless-First Architecture with Step Functions",
      seoDescription: "Panduan migrasi aplikasi web ke serverless-first architecture menggunakan Lambda, Step Functions, dan event-driven design."
    },
    {
      title: "WebAssembly (WASM) Backend: Go + WASM untuk Server-Side Rendering & API Ultra-Cepat",
      slug: "webassembly-wasm-backend-go-wasm-server-side-rendering-api-ultra-cepat",
      excerpt: "Membangun backend Go yang dikompilasi ke WebAssembly untuk server-side rendering ultra-cepat, loading hampir-instan, dan endpoint API yang berjalan di browser & server.",
      coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd47621?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 12,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "WebAssembly Backend: Go + WASM for Ultra-Fast API",
      seoDescription: "Cara membangun server backend Go yang dikompilasi ke WebAssembly untuk SSR, API, dan performa web yang luar biasa."
    },
    {
      title: "CyberSecurity DevSecOps: Automated Threat Detection with SIEM & Machine Learning",
      slug: "cybersecurity-devsecops-automated-threat-detection-siems-machine-learning",
      excerpt: "Integrasi DevSecOps dengan SIEM, network traffic analysis, dan ML model deteksi anomali untuk threat hunting proaktif dan compliance otomatis.",
      coverImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 10,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "DevSecOps Threat Detection with SIEM & ML",
      seoDescription: "Cara mengimplementasi SIEM, ML-based threat detection, dan DevSecOps pipeline untuk keamanan proaktif."
    },
    {
      title: "JAMStack to AI-Native: Migration Architecture untuk Modern Web Applications",
      slug: "jamstack-to-ai-native-migration-architecture-modern-web-applications",
      excerpt: "Panduan migrasi JAMStack (HTML, CSS, JS) ke AI-native architecture dengan LLM integration, embedding models, dan AI-first development untuk web modern.",
      coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd47621?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 8,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "JAMStack to AI-Native: Migration Architecture",
      seoDescription: "Cara mengimplementasi AI-native architecture dengan LLM, embedding models, dan AI-first development untuk aplikasi web."
    },
    {
      title: "Rust + WebAssembly Backend: Build Ultra-Secure, High-Performance APIs dengan Rust",
      slug: "rust-webassembly-backend-build-ultra-secure-high-performance-apis-rust",
      excerpt: "Membangun backend Rust yang dikompilasi ke WebAssembly untuk API yang aman, cepat, dengan memory safety, dan ketergantungan nol saat runtime.",
      coverImageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c8709d?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 11,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Rust + WASM Backend: Ultra-Secure APIs",
      seoDescription: "Cara membangun backend Rust yang dikompilasi ke WebAssembly untuk API yang aman dan berperforma tinggi."
    },
    {
      title: "Multi-Cloud Strategy: Kubernetes Cluster Federation & Service Mesh Global",
      slug: "multi-cloud-strategy-kubernetes-cluster-federation-service-mesh-global",
      excerpt: "Membangun multi-cloud k8s federation dengan Istio/Consul service mesh, global service discovery, dan traffic management antar cloud providers.",
      coverImageUrl: "https://images.unsplash.com/photo-1581276821106-f7166591fbde?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 9,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Multi-Cloud Strategy: Kubernetes Federation & Service Mesh",
      seoDescription: "Cara mengimplementasi multi-cloud k8s federation dengan service mesh global, traffic management, dan service discovery."
    },
    {
      title: "Event-Driven Architecture with Apache Kafka: Microservices Communication Patterns",
      slug: "event-driven-architecture-apache-kafka-microservices-communication-patterns",
      excerpt: "Membangun event-driven microservices dengan Apache Kafka untuk komunikasi asinkron, event sourcing, dan event streaming di arsitektur distributed.",
      coverImageUrl: "https://images.unsplash.com/photo-1677442136019-42c88815d424?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 8,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Event-Driven Architecture with Apache Kafka",
      seoDescription: "Cara mengimplementasi event-driven microservices dengan Apache Kafka untuk komunikasi asinkron dan event streaming."
    },
    {
      title: "Continuous Security Testing: SAST, DAST, dan RAST Terintegrasi dalam CI/CD Pipeline",
      slug: "continuous-security-testing-sast-dast-rest-integrated-cicd-pipeline",
      excerpt: "Integrasi keamanan sast, dast, dan rast secara otomatis dalam CI/CD pipeline untuk deteksi kerentanan sejak awal hingga deployment.",
      coverImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 7,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Continuous Security Testing in CI/CD Pipeline",
      seoDescription: "Cara mengintegrasikan SAST, DAST, dan RAST secara otomatis dalam CI/CD pipeline untuk keamanan devops."
    },
    {
      title: "GraphQL Subscriptions + WebSocket: Real-Time Communication dengan Efficient Connection Management",
      slug: "graphql-subscriptions-websocket-real-time-communication-efficient-connection-management",
      excerpt: "Implementasi GraphQL subscriptions dengan WebSocket untuk real-time communication, connection pooling, dan efficient message handling di aplikasi modern.",
      coverImageUrl: "https://images.unsplash.com/photo-1581276821106-f7166591fbde?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 9,
      categoryId: 1,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "GraphQL Subscriptions + WebSocket Real-Time",
      seoDescription: "Cara mengimplementasi GraphQL subscriptions dengan WebSocket untuk komunikasi real-time dan connection management."
    },
    {
      title: "Cybersecurity for IoT: Secure Device Onboarding & Data Encryption Edge",
      slug: "cybersecurity-iot-secure-device-onboarding-data-encryption-edge",
      excerpt: "Mengimplementasi keamanan siber untuk perangkat IoT: onboarding device aman, enkripsi end-to-end, dan edge computing security untuk jaringan IoT.",
      coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 8,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Cybersecurity for IoT: Secure Device Onboarding & Edge Encryption",
      seoDescription: "Implementasi keamanan siber untuk IoT: onboarding device, enkripsi end-to-end, dan edge computing security."
    },
    {
      title: "Serverless API Gateway: AWS API Gateway v2 + Lambda + Custom Domain Names",
      slug: "serverless-api-gateway-aws-api-gateway-v2-lambda-custom-domain-names",
      excerpt: "Membangun serverless API gateway dengan AWS API Gateway v2, Lambda integration, custom domain names, dan CI/CD pipeline untuk deployment API.",
      coverImageUrl: "https://images.unsplash.com/photo-1567259291459-6b2e3b7e3b7a?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 7,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Serverless API Gateway with AWS API Gateway v2",
      seoDescription: "Cara mengimplementasi serverless API gateway menggunakan AWS API Gateway v2, Lambda, dan custom domain names."
    },
    {
      title: "Real-Time Analytics with Apache Pulsar: Stream Processing untuk Event-Driven Systems",
      slug: "real-time-analytics-apache-pulsar-stream-processing-event-driven-systems",
      excerpt: "Implementasi Apache Pulsar untuk stream processing, real-time analytics, dan event streaming pada arsitektur event-driven microservices.",
      coverImageUrl: "https://images.unsplash.com/photo-1677442136019-42c88815d424?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 10,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Real-Time Analytics with Apache Pulsar",
      seoDescription: "Cara mengimplementasi Apache Pulsar untuk stream processing, real-time analytics, dan event-driven architecture."
    },
    {
      title: "Modern Monitoring Stack: Prometheus + Grafana + Alertmanager untuk Observability",
      slug: "modern-monitoring-stack-prometheus-grafana-alertmanager-observability",
      excerpt: "Membangun stack monitoring modern dengan Prometheus metrics collection, Grafana dashboards, dan Alertmanager untuk alerting dan observability.",
      coverImageUrl: "https://images.unsplash.com/photo-1581276821106-f7166591fbde?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 8,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Modern Monitoring Stack with Prometheus + Grafana",
      seoDescription: "Panduan lengkap monitoring dengan Prometheus metrics, Grafana dashboards, dan Alertmanager untuk observability."
    },
    {
      title: "Security-First Development: GitOps + Terraform + OPA Policy as Code",
      slug: "security-first-development-gitops-terraform-opa-policy-as-code",
      excerpt: "Implementasi DevSecOps dengan GitOps, Terraform infrastructure, dan Open Policy Agent policy-as-code untuk keamanan otomatis. infrastructure-as-code.",
      coverImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80",
      readingTimeMinutes: 9,
      categoryId: 2,
      status: "published",
      isFeatured: false,
      viewsCount: 0,
      seoTitle: "Security-First Development with GitOps + Terraform + OPA",
      seoDescription: "Cara mengimplementasi GitOps, Terraform, dan OPA policy-as-code untuk keamanan otomatis dalam infrastruktur."
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      const content = generateArticleContent(article.title, article.slug);
      await conn.query(`
        INSERT INTO blog_posts 
        (title, slug, excerpt, content, cover_image_url, reading_time_minutes, views_count, category_id, is_featured, status, seo_title, seo_description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        article.title,
        article.slug,
        article.excerpt,
        content,
        article.coverImageUrl,
        article.readingTimeMinutes,
        article.viewsCount,
        article.categoryId,
        article.isFeatured,
        article.status,
        article.seoTitle,
        article.seoDescription
      ]);
      successCount++;
      console.log(`✓ "${article.title}" inserted`);
    } catch (err) {
      errorCount++;
      console.error(`✗ "${article.title}" failed:`, err.message);
    }
  }

  console.log(`\n🎉 Batch completed! Success: ${successCount}, Errors: ${errorCount}`);
  await conn.end();
}

run().catch(console.error);