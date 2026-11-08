const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;
const si = require('simple-icons');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Helper Multi-Key Gemini
function getGeminiKey() {
  const keys = (process.env.GEMINI_API_KEYS || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
  if (!keys.length) {
    throw new Error('GEMINI_API_KEYS tidak ditemukan di file .env');
  }
  // Ambil key acak untuk load balancing
  return keys[Math.floor(Math.random() * keys.length)];
}

async function callGemini(prompt, systemInstruction = '') {
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const key = getGeminiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Gemini API Error: ${data.error.message}`);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// 1. TUKANG SCRAPER
async function scrapeUrlContent(targetUrl) {
  if (!targetUrl) return '';
  try {
    console.log(`[Scraper Agent] Mengambil data dari: ${targetUrl}...`);
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    // Bersihkan tag script, style, html tags
    const textOnly = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return textOnly.slice(0, 15000); // Batasi 15k karakter pertama
  } catch (err) {
    console.warn(`[Scraper Agent] Gagal scrape URL: ${err.message}`);
    return '';
  }
}

// 2. TUKANG TULIS (PERSONAL TECH BLOGGER - ANTI-AI STYLE)
const WRITER_SYSTEM_PROMPT = `
Kamu adalah "Gentha Arya Pratama", Fullstack Software Engineer & Personal Tech Blogger di mgentaarya.my.id.
Kamu menulis artikel teknik untuk sesama developer di Indonesia dengan gaya yang SANGAT NATURAL, BUKAN ROBOTIK AI.

ATURAN GAYA BAHASA (WAJIB):
1. DILARANG KERAS menggunakan frasa klise AI:
   - JANGAN gunakan: "Di era digital yang serba cepat ini..."
   - JANGAN gunakan: "Dalam lanskap teknologi yang terus berkembang..."
   - JANGAN gunakan: "Mari kita selami lebih dalam..."
   - JANGAN gunakan: "Secara keseluruhan dapat disimpulkan..."
   - JANGAN gunakan kata-kata berlebihan seperti "revolusioner", "mengubah permainan", "tak tertandingi".
2. GUNAKAN gaya bahasa Blogger Pribadi / Praktisi Engineer:
   - Awali langsung dengan masalah nyata di lapangan atau skenario dunia kerja (misal: "Pernah gak kamu ngalamin...", "Kemarin pas lagi refactor kode...", "Banyak yang salah kaprah mikir...").
   - Gunakan sudut pandang orang pertama (aku / gue / kita).
   - Jelaskan konsep sulit dengan analogi teknis yang masuk akal dan to the point.
   - Sertakan contoh kode nyata (production-ready), lengkap dengan komentar penjelas.
   - Berikan tips "gotchas" atau jebakan umum yang sering bikin bug di production.
3. Format Markdown Lengkap:
   - H2 (##) untuk topik utama, H3 (###) untuk sub-topik.
   - Blok kode dengan penanda bahasa spesifik (bash, typescript, tsx, astro, sql, dll.).
   - Blockquote (> [!NOTE] atau > [!TIP]) untuk catatan penting.
`;

// 3. TUKANG KOREKSI (EDITOR & METADATA EXTRACTOR)
const EDITOR_SYSTEM_PROMPT = `
Kamu adalah "Lead Technical Editor & Anti-AI Purifier".
Tugasmu:
1. Memeriksa draf artikel, pastikan tidak ada kalimat basi AI, hapus fluff/basa-basi berlebih.
2. Memastikan format Markdown, heading, dan blok kode rapi.
3. Mengekstrak metadata JSON terstruktur di bagian paling akhir dengan format:
\`\`\`json
{
  "title": "Judul Artikel Menarik & Tajam",
  "badge": "BADGE TEKNOLOGI SINGKAT",
  "subtitle": "Subtitle 1 Kalimat Menjelaskan Isi",
  "excerpt": "Ringkasan 1-2 kalimat (maksimal 160 karakter) untuk deskripsi artikel.",
  "readingTimeMinutes": 6,
  "categoryId": 4, 
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "primaryBrand": "Claude",
  "secondaryBrand": "Anthropic"
}
\`\`\`
Catatan categoryId:
1 = Web Architecture
2 = Fullstack & Database
3 = Mobile Development
4 = AI & Modern Engineering
`;

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveBrandIcon(brandName) {
  const b = (brandName || '').toLowerCase();
  if (b.includes('claude')) return { name: 'Claude 3.7', path: si.siClaude.path, color: '#D97757' };
  if (b.includes('anthropic')) return { name: 'Anthropic', path: si.siAnthropic.path, color: '#F59E0B' };
  if (b.includes('gemini')) return { name: 'Gemini 2.5', path: si.siGooglegemini.path, color: '#38BDF8' };
  if (b.includes('google')) return { name: 'DeepMind', path: si.siGoogle.path, color: '#EA4335' };
  if (b.includes('openai') || b.includes('gpt') || b.includes('codex')) return { name: 'OpenAI', path: si.siOpenai.path, color: '#10B981' };
  if (b.includes('copilot') || b.includes('github')) return { name: 'Copilot', path: si.siGithubcopilot.path, color: '#60A5FA' };
  if (b.includes('astro')) return { name: 'Astro 5', path: si.siAstro.path, color: '#BC52EE' };
  if (b.includes('drizzle')) return { name: 'Drizzle', path: si.siDrizzle.path, color: '#C5F74F' };
  if (b.includes('react')) return { name: 'React', path: si.siReact.path, color: '#61DAFB' };
  if (b.includes('typescript') || b.includes('ts')) return { name: 'TypeScript', path: si.siTypescript.path, color: '#3178C6' };
  if (b.includes('docker')) return { name: 'Docker', path: si.siDocker.path, color: '#2496ED' };
  if (b.includes('k8s') || b.includes('kubernetes')) return { name: 'Kubernetes', path: si.siKubernetes.path, color: '#326CE5' };
  if (b.includes('mysql')) return { name: 'MySQL', path: si.siMysql.path, color: '#38BDF8' };
  if (b.includes('snyk') || b.includes('security')) return { name: 'Snyk Audit', path: si.siSnyk.path, color: '#4C54FD' };
  if (b.includes('cloudflare')) return { name: 'Cloudflare', path: si.siCloudflare.path, color: '#F38020' };
  
  // Default fallback
  return { name: 'Code Core', path: si.siOpenai.path, color: '#8B5CF6' };
}

function generateSvgThumbnail(meta) {
  const icon1 = resolveBrandIcon(meta.primaryBrand);
  const icon2 = resolveBrandIcon(meta.secondaryBrand || 'React');

  // Wrap title lines cleanly into chunks of max ~24 chars so it never overlaps icons
  const titleWords = (meta.title || '').toUpperCase().split(' ');
  const lines = [];
  let cur = '';
  const maxLineChars = 24;
  for (const w of titleWords) {
    if ((cur + ' ' + w).trim().length <= maxLineChars) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);

  const fontSize = lines.length >= 3 ? 32 : (lines.length === 2 ? 38 : 44);
  const lineGap = fontSize + 12;
  const startY = lines.length >= 3 ? 205 : (lines.length === 2 ? 230 : 255);
  const subtitleY = lines.length * lineGap + 20;

  const titleSvg = lines.map((l, idx) => 
    `<tspan x="0" dy="${idx === 0 ? 0 : lineGap}">${escapeXml(l)}</tspan>`
  ).join('');

  let subText = meta.subtitle || meta.excerpt || '';
  if (subText.length > 70) subText = subText.slice(0, 67) + '...';

  const tagsSvg = (meta.tags || ['Tech', 'Engineering', 'Coding']).slice(0, 4).map((t, idx) => {
    const xPos = 80 + idx * 145;
    return `
      <g transform="translate(${xPos}, 505)">
        <rect width="135" height="32" rx="8" fill="#140A26" stroke="rgba(168, 85, 247, 0.35)" stroke-width="1.2"/>
        <text x="67" y="21" fill="#CBD5E1" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(t)}</text>
      </g>
    `;
  }).join('');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05030A"/>
      <stop offset="50%" stop-color="#090514"/>
      <stop offset="100%" stop-color="#0E0820"/>
    </linearGradient>
    <radialGradient id="glow1" cx="75%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${icon1.color}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${icon1.color}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="20%" cy="85%" r="50%">
      <stop offset="0%" stop-color="${icon2.color}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${icon2.color}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="88%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="${icon1.color}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- High-Tech Grid -->
  <g opacity="0.07" stroke="#8B5CF6" stroke-width="1">
    <path d="M0,70 H1200 M0,140 H1200 M0,210 H1200 M0,280 H1200 M0,350 H1200 M0,420 H1200 M0,490 H1200 M0,560 H1200"/>
    <path d="M100,0 V630 M200,0 V630 M300,0 V630 M400,0 V630 M500,0 V630 M600,0 V630 M700,0 V630 M800,0 V630 M900,0 V630 M1000,0 V630 M1100,0 V630"/>
  </g>

  <!-- Corner Brackets -->
  <path d="M40,70 L40,40 L70,40" fill="none" stroke="${icon1.color}" stroke-width="3" opacity="0.8"/>
  <path d="M1160,70 L1160,40 L1130,40" fill="none" stroke="${icon1.color}" stroke-width="3" opacity="0.8"/>
  <path d="M40,560 L40,590 L70,590" fill="none" stroke="${icon2.color}" stroke-width="3" opacity="0.8"/>
  <path d="M1160,560 L1160,590 L1130,590" fill="none" stroke="${icon2.color}" stroke-width="3" opacity="0.8"/>

  <!-- Top Pill Badge -->
  <g transform="translate(80, 75)">
    <rect width="320" height="34" rx="17" fill="#160C2C" stroke="${icon1.color}" stroke-width="1.5" opacity="0.95"/>
    <circle cx="18" cy="17" r="4.5" fill="${icon1.color}" filter="url(#glow)"/>
    <text x="32" y="22" fill="${icon1.color}" font-size="12" font-family="Arial, sans-serif" font-weight="bold">${escapeXml(meta.badge || 'ENGINEERING ARTICLE')}</text>
  </g>

  <g transform="translate(1120, 80)">
    <text x="0" y="20" fill="#64748B" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">mgentaarya.my.id</text>
  </g>

  <!-- Title & Subtitle -->
  <g transform="translate(80, ${startY})">
    <text fill="url(#titleGrad)" font-size="${fontSize}" font-family="Arial, sans-serif" font-weight="900" letter-spacing="-0.5">
      ${titleSvg}
    </text>
    <text x="0" y="${subtitleY}" fill="#94A3B8" font-size="18" font-family="Arial, sans-serif" font-weight="normal">
      ${escapeXml(subText)}
    </text>
  </g>

  <!-- Right Side Brand Icons -->
  <g transform="translate(810, 210)">
    <!-- Icon 1 -->
    <g transform="translate(0, 0)">
      <circle cx="50" cy="50" r="48" fill="#100820" stroke="${icon1.color}" stroke-width="2.5" filter="url(#glow)"/>
      <g transform="translate(25, 25) scale(2.08)">
        <path d="${icon1.path}" fill="${icon1.color}"/>
      </g>
      <text x="50" y="122" fill="#CBD5E1" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(icon1.name)}</text>
    </g>

    <!-- Icon 2 -->
    <g transform="translate(145, 0)">
      <circle cx="50" cy="50" r="48" fill="#100820" stroke="${icon2.color}" stroke-width="2.5" filter="url(#glow)"/>
      <g transform="translate(25, 25) scale(2.08)">
        <path d="${icon2.path}" fill="${icon2.color}"/>
      </g>
      <text x="50" y="122" fill="#CBD5E1" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(icon2.name)}</text>
    </g>
  </g>

  <!-- Divider Line -->
  <line x1="80" y1="470" x2="1120" y2="470" stroke="rgba(168, 85, 247, 0.2)" stroke-width="1.5"/>

  <!-- Tags -->
  ${tagsSvg}

  <!-- Author Signature -->
  <g transform="translate(1120, 515)">
    <text x="0" y="12" fill="#E2E8F0" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">Gentha Arya Pratama</text>
    <text x="0" y="30" fill="#A855F7" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">Fullstack Software Engineer</text>
  </g>
</svg>
  `.trim();
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 4. MAIN ORCHESTRATOR PIPELINE
async function runArticlePipeline({ topic, url = '', isFeatured = false }) {
  console.log('====================================================');
  console.log(`🚀 MEMULAI PIPELINE AI AGENT PUBLISHER`);
  console.log(`Topik: ${topic}`);
  if (url) console.log(`Sumber Scraper: ${url}`);
  console.log('====================================================\n');

  // STEP 1: SCRAPER AGENT
  let scrapedContext = '';
  if (url) {
    console.log('🔍 [1/4] Agen Scraper sedang mengumpulkan data web...');
    scrapedContext = await scrapeUrlContent(url);
    console.log(`✓ Data berhasil di-scrape (${scrapedContext.length} karakter).\n`);
  }

  // STEP 2: WRITER AGENT
  console.log('✍️  [2/4] Agen Penulis sedang merancang draft artikel (Gaya Blogger Pribadi)...');
  const writePrompt = `
Buatkan artikel blog lengkap tentang topik: "${topic}".
${scrapedContext ? `Gunakan dan parafrasekan referensi riset berikut secara natural:\n"""\n${scrapedContext.slice(0, 6000)}\n"""` : ''}

Tuliskan artikel blog yang mendalam, santai tapi sangat berbobot, mengalir, dengan contoh kode nyata dan studi kasus.
Pastikan tidak terdengar seperti AI generik.
`;

  const draftArticle = await callGemini(writePrompt, WRITER_SYSTEM_PROMPT);
  console.log(`✓ Draft artikel selesai disusun (${draftArticle.length} karakter).\n`);

  // STEP 3: EDITOR AGENT
  console.log('🔎 [3/4] Agen Pengoreksi sedang mereview bahasa, format, dan menyusun metadata...');
  const editPrompt = `
Berikut adalah draf artikel dari penulis:
"""
${draftArticle}
"""

Perbaiki jika masih ada kalimat klise AI, poles heading dan code blocks.
Di bagian paling bawah, sertakan blok JSON metadata seperti yang ditentukan.
`;

  const editedResponse = await callGemini(editPrompt, EDITOR_SYSTEM_PROMPT);

  // Pisahkan konten markdown dan JSON metadata
  const jsonMatch = editedResponse.match(/```json\s*([\s\S]*?)\s*```/);
  let metadata = {
    title: topic,
    badge: 'ENGINEERING BLOG',
    subtitle: topic,
    excerpt: 'Artikel teknis terbaru oleh Gentha Arya Pratama.',
    readingTimeMinutes: 5,
    categoryId: 4,
    tags: ['AI Coding', 'Modern Tech', 'Software Engineering'],
    primaryBrand: 'Claude',
    secondaryBrand: 'OpenAI'
  };

  let cleanContent = editedResponse;
  if (jsonMatch) {
    try {
      metadata = { ...metadata, ...JSON.parse(jsonMatch[1]) };
      cleanContent = editedResponse.replace(jsonMatch[0], '').trim();
    } catch (e) {
      console.warn('Gagal parse JSON metadata dari editor, menggunakan fallback.');
    }
  }

  // Bersihkan teks pengantar/basa-basi LLM sebelum heading pertama
  if (/#\s/.test(cleanContent)) {
    cleanContent = cleanContent.replace(/^[\s\S]*?(?=(#\s|\n#\s))/i, '').trim();
  }

  console.log(`✓ Review selesai:`);
  console.log(`  Judul: "${metadata.title}"`);
  console.log(`  Kategori ID: ${metadata.categoryId}`);
  console.log(`  Reading Time: ${metadata.readingTimeMinutes} menit`);
  console.log(`  Tags: ${metadata.tags.join(', ')}\n`);

  // STEP 4: PUBLISHER AGENT
  console.log('🎨 [4/4] Agen Publisher membuat thumbnail resmi & mengunggah...');
  const baseSlug = slugify(metadata.title);
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const svg = generateSvgThumbnail(metadata);
  const base64 = Buffer.from(svg).toString('base64');
  const dataUri = 'data:image/svg+xml;base64,' + base64;

  const uploadRes = await cloudinary.uploader.upload(dataUri, {
    folder: 'gentha-portfolio/blog/branded-thumbs',
    resource_type: 'image',
    format: 'png',
    public_id: `thumb_${slug}`,
    overwrite: true
  });

  console.log(`✓ Thumbnail Cloudinary: ${uploadRes.secure_url}`);

  // Simpan ke Remote MySQL Database
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    charset: 'utf8mb4'
  });

  const [insertResult] = await conn.execute(`
    INSERT INTO blog_posts (
      title, slug, excerpt, content, cover_image_url, cover_image_public_id,
      reading_time_minutes, views_count, status, is_featured,
      published_at, category_id, tags, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW()
    )
  `, [
    metadata.title,
    slug,
    metadata.excerpt,
    cleanContent,
    uploadRes.secure_url,
    uploadRes.public_id,
    metadata.readingTimeMinutes,
    0,
    'published',
    isFeatured ? 1 : 0,
    metadata.categoryId,
    JSON.stringify(metadata.tags)
  ]);

  await conn.end();

  const liveUrl = `https://mgentaarya.my.id/blog/${slug}`;
  console.log('\n====================================================');
  console.log(`🎉 ARTIKEL BERHASIL DITERBITKAN SECARA OTOMATIS!`);
  console.log(`ID Database : ${insertResult.insertId}`);
  console.log(`Judul       : ${metadata.title}`);
  console.log(`URL Live    : ${liveUrl}`);
  console.log('====================================================\n');

  return {
    id: insertResult.insertId,
    title: metadata.title,
    slug,
    liveUrl,
    thumbnailUrl: uploadRes.secure_url
  };
}

// CLI Execution Handler
if (require.main === module) {
  const args = process.argv.slice(2);
  let topic = '';
  let url = '';

  for (const arg of args) {
    if (arg.startsWith('--topic=')) topic = arg.replace('--topic=', '');
    else if (arg.startsWith('--url=')) url = arg.replace('--url=', '');
    else if (!topic) topic = arg;
  }

  if (!topic) {
    console.error('Penggunaan:');
    console.error('  node scripts/publish_article.cjs --topic="Topik Artikel" [--url="https://sumber-referensi.com"]');
    process.exit(1);
  }

  runArticlePipeline({ topic, url }).catch(err => {
    console.error('Pipeline Error:', err);
    process.exit(1);
  });
}

module.exports = { runArticlePipeline, generateSvgThumbnail };
