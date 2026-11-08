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

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const thumbnailConfigs = [
  {
    id: 4,
    badge: 'PARADIGM SHIFT · AI CODING',
    titleLines: ['PANDUAN LENGKAP', 'VIBE CODING'],
    subtitle: 'Seni Membangun Software Cepat Bersama AI',
    primaryColor: '#D946EF', // Fuchsia
    secondaryColor: '#8B5CF6', // Purple
    tags: ['Vibe Coding', 'AI Engineer', 'Modern Workflow', 'Next-Gen Dev'],
    techIcons: [
      { name: 'AI Core', path: si.siOpenai.path, color: '#D946EF' },
      { name: 'React', path: si.siReact.path, color: '#61DAFB' },
      { name: 'TypeScript', path: si.siTypescript.path, color: '#3178C6' }
    ]
  },
  {
    id: 5,
    badge: 'GOOGLE DEEPMIND · 2M TOKENS',
    titleLines: ['VIBE CODING DENGAN', 'GOOGLE GEMINI'],
    subtitle: 'Multimodal UI & Context Window Raksasa',
    primaryColor: '#38BDF8', // Sky Blue
    secondaryColor: '#6366F1', // Indigo
    tags: ['Google Gemini', 'Gemini 2.5 Flash', 'Multimodal', 'Large Context'],
    techIcons: [
      { name: 'Gemini 2.5', path: si.siGooglegemini.path, color: '#38BDF8' },
      { name: 'DeepMind', path: si.siGoogle.path, color: '#EA4335' }
    ]
  },
  {
    id: 6,
    badge: 'ANTHROPIC · HYBRID REASONING',
    titleLines: ['VIBE CODING DENGAN', 'CLAUDE 3.7 SONNET'],
    subtitle: 'Extended Thinking & Autonomous Claude Code CLI',
    primaryColor: '#D97757', // Claude Terracotta
    secondaryColor: '#A855F7', // Violet
    tags: ['Claude 3.7', 'Extended Thinking', 'Claude Code CLI', 'Hybrid AI'],
    techIcons: [
      { name: 'Claude 3.7', path: si.siClaude.path, color: '#D97757' },
      { name: 'Anthropic', path: si.siAnthropic.path, color: '#F59E0B' }
    ]
  },
  {
    id: 7,
    badge: 'OPENAI · AUTONOMOUS AGENT',
    titleLines: ['OPENAI CODEX &', 'GITHUB COPILOT'],
    subtitle: 'Dari Micro-Autocomplete Menuju Full Repo Agent',
    primaryColor: '#10B981', // Emerald
    secondaryColor: '#3B82F6', // Blue
    tags: ['OpenAI Codex', 'GitHub Copilot', 'Agent Mode', 'o-Series'],
    techIcons: [
      { name: 'OpenAI', path: si.siOpenai.path, color: '#10B981' },
      { name: 'Copilot', path: si.siGithubcopilot.path, color: '#60A5FA' }
    ]
  },
  {
    id: 8,
    badge: 'MODERN WEB ECOSYSTEM',
    titleLines: ['TEKNOLOGI & FRAMEWORK', 'POPULER DI ERA AI'],
    subtitle: 'Astro 5, Drizzle ORM, TypeScript & Bun Runtime',
    primaryColor: '#BC52EE', // Astro Purple
    secondaryColor: '#38BDF8', // Cyan
    tags: ['Astro 5', 'Drizzle ORM', 'Bun Runtime', 'TypeScript'],
    techIcons: [
      { name: 'Astro 5', path: si.siAstro.path, color: '#BC52EE' },
      { name: 'Drizzle', path: si.siDrizzle.path, color: '#C5F74F' },
      { name: 'TypeScript', path: si.siTypescript.path, color: '#3178C6' },
      { name: 'React', path: si.siReact.path, color: '#61DAFB' }
    ]
  },
  {
    id: 9,
    badge: 'DEVELOPER MASTERY · ZERO BUG',
    titleLines: ['SENI PROMPT ENGINEERING', 'UNTUK DEVELOPER'],
    subtitle: 'Formula P-C-R-O untuk Menghasilkan Kode Produksi',
    primaryColor: '#EC4899', // Pink
    secondaryColor: '#8B5CF6', // Purple
    tags: ['Prompt Eng', 'P-C-R-O Pattern', 'Context Precision', 'Zero Bug'],
    techIcons: [
      { name: 'Prompting', path: si.siOpenai.path, color: '#EC4899' },
      { name: 'Claude', path: si.siClaude.path, color: '#D97757' }
    ]
  },
  {
    id: 10,
    badge: 'CAREER EVOLUTION · 2026+',
    titleLines: ['MASA DEPAN ENGINEER', 'DI ERA AI AGENT'],
    subtitle: 'Dari Pembuat Sintaks Menuju Manajer Sistem Otonom',
    primaryColor: '#8B5CF6', // Purple
    secondaryColor: '#06B6D4', // Cyan
    tags: ['Career Growth', 'Autonomous Agents', 'System Architect', 'AI Synergy'],
    techIcons: [
      { name: 'Kubernetes', path: si.siKubernetes.path, color: '#326CE5' },
      { name: 'Docker', path: si.siDocker.path, color: '#2496ED' }
    ]
  },
  {
    id: 11,
    badge: 'BENCHMARK COMPREHENSIVE',
    titleLines: ['KOMPARASI AI CODER:', 'GEMINI VS CLAUDE VS CODEX'],
    subtitle: 'Kelebihan, Kekurangan & Rekomendasi Setup Terbaik',
    primaryColor: '#F59E0B', // Amber
    secondaryColor: '#8B5CF6', // Violet
    tags: ['Gemini 2.5', 'Claude 3.7', 'OpenAI Codex', 'Matrix 2026'],
    techIcons: [
      { name: 'Claude 3.7', path: si.siClaude.path, color: '#D97757' },
      { name: 'Gemini 2.5', path: si.siGooglegemini.path, color: '#38BDF8' },
      { name: 'Codex / o3', path: si.siOpenai.path, color: '#10B981' }
    ]
  },
  {
    id: 12,
    badge: 'DEVSECOPS · THREAT SHIELD',
    titleLines: ['KEAMANAN KODE DI ERA AI:', 'BEST PRACTICES DEVSECOPS'],
    subtitle: 'Hindari Package Palsu, Bocor Secret Key & Bug AI',
    primaryColor: '#EF4444', // Red
    secondaryColor: '#F97316', // Orange
    tags: ['Security Audit', 'DevSecOps', 'Credential Guard', 'Code Scanner'],
    techIcons: [
      { name: 'Snyk Audit', path: si.siSnyk.path, color: '#4C54FD' },
      { name: 'Cloudflare', path: si.siCloudflare.path, color: '#F38020' }
    ]
  },
  {
    id: 13,
    badge: 'REAL CASE STUDY · 24-HOUR SAAS',
    titleLines: ['BIKIN APLIKASI FULLSTACK', 'DALAM 1 HARI DENGAN AI'],
    subtitle: 'Roadmap Eksekusi Database, REST API, UI & Deployment',
    primaryColor: '#10B981', // Emerald
    secondaryColor: '#D946EF', // Fuchsia
    tags: ['24h Challenge', 'Fullstack SaaS', 'Astro 5', 'Drizzle ORM'],
    techIcons: [
      { name: 'React', path: si.siReact.path, color: '#61DAFB' },
      { name: 'Drizzle', path: si.siDrizzle.path, color: '#C5F74F' },
      { name: 'MySQL', path: si.siMysql.path, color: '#38BDF8' }
    ]
  }
];

function generateThumbnailSvg(cfg) {
  const titleY = cfg.titleLines.length === 1 ? 280 : 240;
  const subtitleY = cfg.titleLines.length === 1 ? 70 : 110;

  const titleSvg = cfg.titleLines.map((line, idx) => 
    `<tspan x="0" dy="${idx === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`
  ).join('');

  // Icon Layout: Support 2 icons, 3 icons, and 4 icons
  let iconsSvg = '';
  const count = cfg.techIcons.length;

  if (count === 4) {
    // 2x2 grid
    // Row 1 (y=175), Row 2 (y=305)
    iconsSvg = `
      <g transform="translate(810, 165)">
        <!-- Top Left -->
        <g transform="translate(0, 0)">
          <circle cx="42" cy="42" r="40" fill="#100820" stroke="${cfg.techIcons[0].color}" stroke-width="2.5" filter="url(#glow)"/>
          <g transform="translate(21, 21) scale(1.75)">
            <path d="${cfg.techIcons[0].path}" fill="${cfg.techIcons[0].color}"/>
          </g>
          <text x="42" y="104" fill="#CBD5E1" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(cfg.techIcons[0].name)}</text>
        </g>
        <!-- Top Right -->
        <g transform="translate(130, 0)">
          <circle cx="42" cy="42" r="40" fill="#100820" stroke="${cfg.techIcons[1].color}" stroke-width="2.5" filter="url(#glow)"/>
          <g transform="translate(21, 21) scale(1.75)">
            <path d="${cfg.techIcons[1].path}" fill="${cfg.techIcons[1].color}"/>
          </g>
          <text x="42" y="104" fill="#CBD5E1" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(cfg.techIcons[1].name)}</text>
        </g>
        <!-- Bottom Left -->
        <g transform="translate(0, 130)">
          <circle cx="42" cy="42" r="40" fill="#100820" stroke="${cfg.techIcons[2].color}" stroke-width="2.5" filter="url(#glow)"/>
          <g transform="translate(21, 21) scale(1.75)">
            <path d="${cfg.techIcons[2].path}" fill="${cfg.techIcons[2].color}"/>
          </g>
          <text x="42" y="104" fill="#CBD5E1" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(cfg.techIcons[2].name)}</text>
        </g>
        <!-- Bottom Right -->
        <g transform="translate(130, 130)">
          <circle cx="42" cy="42" r="40" fill="#100820" stroke="${cfg.techIcons[3].color}" stroke-width="2.5" filter="url(#glow)"/>
          <g transform="translate(21, 21) scale(1.75)">
            <path d="${cfg.techIcons[3].path}" fill="${cfg.techIcons[3].color}"/>
          </g>
          <text x="42" y="104" fill="#CBD5E1" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(cfg.techIcons[3].name)}</text>
        </g>
      </g>
    `;
  } else if (count === 3) {
    // 3 icons horizontally: x = 740, 875, 1010
    iconsSvg = `
      <g transform="translate(735, 210)">
        ${cfg.techIcons.map((ic, idx) => `
          <g transform="translate(${idx * 135}, 0)">
            <circle cx="48" cy="48" r="46" fill="#100820" stroke="${ic.color}" stroke-width="2.5" filter="url(#glow)"/>
            <g transform="translate(24, 24) scale(2.0)">
              <path d="${ic.path}" fill="${ic.color}"/>
            </g>
            <text x="48" y="118" fill="#CBD5E1" font-size="13" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(ic.name)}</text>
          </g>
        `).join('')}
      </g>
    `;
  } else {
    // 2 icons horizontally: x = 810, 955
    iconsSvg = `
      <g transform="translate(810, 210)">
        ${cfg.techIcons.map((ic, idx) => `
          <g transform="translate(${idx * 145}, 0)">
            <circle cx="50" cy="50" r="48" fill="#100820" stroke="${ic.color}" stroke-width="2.5" filter="url(#glow)"/>
            <g transform="translate(25, 25) scale(2.08)">
              <path d="${ic.path}" fill="${ic.color}"/>
            </g>
            <text x="50" y="122" fill="#CBD5E1" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(ic.name)}</text>
          </g>
        `).join('')}
      </g>
    `;
  }

  // Tag pills di bagian bawah
  const tagsSvg = cfg.tags.map((t, idx) => {
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
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05030A"/>
      <stop offset="50%" stop-color="#090514"/>
      <stop offset="100%" stop-color="#0E0820"/>
    </linearGradient>

    <!-- Ambient Radial Glow Primary -->
    <radialGradient id="glow1" cx="75%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${cfg.primaryColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${cfg.primaryColor}" stop-opacity="0"/>
    </radialGradient>

    <!-- Ambient Radial Glow Secondary -->
    <radialGradient id="glow2" cx="20%" cy="85%" r="50%">
      <stop offset="0%" stop-color="${cfg.secondaryColor}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${cfg.secondaryColor}" stop-opacity="0"/>
    </radialGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="88%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="${cfg.primaryColor}"/>
    </linearGradient>
  </defs>

  <!-- 1. Background Fill -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 2. Ambient Glow Spheres -->
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- 3. High-Tech Grid Pattern -->
  <g opacity="0.07" stroke="#8B5CF6" stroke-width="1">
    <path d="M0,70 H1200 M0,140 H1200 M0,210 H1200 M0,280 H1200 M0,350 H1200 M0,420 H1200 M0,490 H1200 M0,560 H1200"/>
    <path d="M100,0 V630 M200,0 V630 M300,0 V630 M400,0 V630 M500,0 V630 M600,0 V630 M700,0 V630 M800,0 V630 M900,0 V630 M1000,0 V630 M1100,0 V630"/>
  </g>

  <!-- 4. Corner Framing Aesthetics -->
  <path d="M40,70 L40,40 L70,40" fill="none" stroke="${cfg.primaryColor}" stroke-width="3" opacity="0.8"/>
  <path d="M1160,70 L1160,40 L1130,40" fill="none" stroke="${cfg.primaryColor}" stroke-width="3" opacity="0.8"/>
  <path d="M40,560 L40,590 L70,590" fill="none" stroke="${cfg.secondaryColor}" stroke-width="3" opacity="0.8"/>
  <path d="M1160,560 L1160,590 L1130,590" fill="none" stroke="${cfg.secondaryColor}" stroke-width="3" opacity="0.8"/>

  <!-- 5. Top Bar: Category Pill & Brand Identity -->
  <g transform="translate(80, 75)">
    <rect width="310" height="34" rx="17" fill="#160C2C" stroke="${cfg.primaryColor}" stroke-width="1.5" opacity="0.95"/>
    <circle cx="18" cy="17" r="4.5" fill="${cfg.primaryColor}" filter="url(#glow)"/>
    <text x="32" y="22" fill="${cfg.primaryColor}" font-size="12" font-family="Arial, sans-serif" font-weight="bold">${escapeXml(cfg.badge)}</text>
  </g>

  <g transform="translate(1120, 80)">
    <text x="0" y="20" fill="#64748B" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">mgentaarya.my.id</text>
  </g>

  <!-- 6. Main Headline Title (Bold Typography) & Subtitle -->
  <g transform="translate(80, ${titleY})">
    <text fill="url(#titleGrad)" font-size="44" font-family="Arial, sans-serif" font-weight="900" letter-spacing="-0.5">
      ${titleSvg}
    </text>
    <text x="0" y="${subtitleY}" fill="#94A3B8" font-size="19" font-family="Arial, sans-serif" font-weight="normal">
      ${escapeXml(cfg.subtitle)}
    </text>
  </g>

  <!-- 7. Right-Hand Tech Logos with Glowing Halo -->
  ${iconsSvg}

  <!-- 8. Divider Line -->
  <line x1="80" y1="470" x2="1120" y2="470" stroke="rgba(168, 85, 247, 0.2)" stroke-width="1.5"/>

  <!-- 9. Tag Pills Bottom Bar -->
  ${tagsSvg}

  <!-- 10. Author Signature -->
  <g transform="translate(1120, 515)">
    <text x="0" y="12" fill="#E2E8F0" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">Gentha Arya Pratama</text>
    <text x="0" y="30" fill="#A855F7" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">Fullstack Software Engineer</text>
  </g>
</svg>
  `.trim();
}

async function runGenerateAndUpload() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Generating authentic branded SVG-to-PNG thumbnails for all 10 articles...');

  for (const cfg of thumbnailConfigs) {
    const svgContent = generateThumbnailSvg(cfg);
    const base64 = Buffer.from(svgContent).toString('base64');
    const dataUri = 'data:image/svg+xml;base64,' + base64;

    console.log(`Uploading thumbnail for article ${cfg.id}: ${cfg.titleLines.join(' ')}...`);
    const uploadRes = await cloudinary.uploader.upload(dataUri, {
      folder: 'gentha-portfolio/blog/branded-thumbs',
      resource_type: 'image',
      format: 'png',
      public_id: `thumb_article_${cfg.id}`,
      overwrite: true
    });

    console.log(`✓ Article ${cfg.id} uploaded: ${uploadRes.secure_url}`);

    // Update MySQL blog_posts record
    await conn.execute(`
      UPDATE blog_posts 
      SET cover_image_url = ?, cover_image_public_id = ?, updated_at = NOW()
      WHERE id = ?
    `, [uploadRes.secure_url, uploadRes.public_id, cfg.id]);

    console.log(`✓ Database updated for article ${cfg.id}`);
  }

  console.log('\nAll 10 authentic branded thumbnails successfully created, uploaded, and linked to database!');
  await conn.end();
}

runGenerateAndUpload().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
