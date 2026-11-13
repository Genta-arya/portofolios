const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;
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
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

function generateWindowsThumbnailSvg(cfg) {
  const titleY = cfg.titleLines.length === 1 ? 280 : 240;
  const subtitleY = cfg.titleLines.length === 1 ? 70 : 110;

  const titleSvg = cfg.titleLines.map((line, idx) =>
    `<tspan x="0" dy="${idx === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`
  ).join('');

  const techSvg = `
    <g transform="translate(810, 210)">
      <g transform="translate(0, 0)">
        <circle cx="60" cy="60" r="58" fill="#100820" stroke="#0078D7" stroke-width="2.5" filter="url(#glow)"/>
        <g transform="translate(30, 30) scale(2.5)">
          <path d="M21 21H3V3.01L3 3.01V21H21ZM8.17 6L6.58 4.58 12 10.01l5.42-5.43L15.83 6 12 9.42z" fill="#0078D7"/>
        </g>
        <text x="60" y="120" fill="#CBD5E1" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">Windows</text>
      </g>
      <g transform="translate(160, 0)">
        <circle cx="60" cy="60" r="58" fill="#100820" stroke="#FFFFFF" stroke-width="2.5" filter="url(#glow)"/>
        <g transform="translate(30, 30) scale(2.5)">
          <path d="M14 2H26 C26 2 26 14 26 26V26C26 26 14 26 14 26H14ZM14 4C14 4 4 14 4 14V26C4 26 14 26 14 26H14Z" fill="#FFFFFF"/>
        </g>
        <text x="60" y="120" fill="#CBD5E1" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">Microsoft</text>
      </g>
    </g>
  `;

  const subtitleSvg = `<text x="0" y="${subtitleY}" fill="#94A3B8" font-size="19" font-family="Arial, sans-serif" font-weight="normal">${escapeXml(cfg.subtitle)}</text>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05030A"/>
      <stop offset="50%" stop-color="#090514"/>
      <stop offset="100%" stop-color="#0E0820"/>
    </linearGradient>

    <radialGradient id="glow1" cx="75%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#0078D7" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0078D7" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="glow2" cx="20%" cy="85%" r="50%">
      <stop offset="0%" stop-color="#00B294" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#00B294" stop-opacity="0"/>
    </radialGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="88%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#0078D7"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <path d="M40,70 L40,40 L70,40" fill="none" stroke="#0078D7" stroke-width="3" opacity="0.8"/>
  <path d="M1160,70 L1160,40 L1130,40" fill="none" stroke="#0078D7" stroke-width="3" opacity="0.8"/>
  <path d="M40,560 L40,590 L70,590" fill="none" stroke="#00B294" stroke-width="3" opacity="0.8"/>
  <path d="M1160,560 L1160,590 L1130,590" fill="none" stroke="#00B294" stroke-width="3" opacity="0.8"/>

  <g transform="translate(80, 75)">
    <rect width="310" height="34" rx="17" fill="#160C2C" stroke="#0078D7" stroke-width="1.5" opacity="0.95"/>
    <circle cx="18" cy="17" r="4.5" fill="#0078D7" filter="url(#glow)"/>
    <text x="32" y="22" fill="#0078D7" font-size="12" font-family="Arial, sans-serif" font-weight="bold">${escapeXml(cfg.badge)}</text>
  </g>

  <g transform="translate(1120, 80)">
    <text x="0" y="20" fill="#64748B" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">mgentaarya.my.id</text>
  </g>

  <g transform="translate(80, ${titleY})">
    <text fill="url(#titleGrad)" font-size="44" font-family="Arial, sans-serif" font-weight="900" letter-spacing="-0.5">
      ${titleSvg}
    </text>
    ${subtitleSvg}
  </g>

  <g transform="translate(80, 470)">
    <text x="0" y="20" fill="#F8F9FA" font-size="16" font-family="Arial, sans-serif" font-weight="600">Windows Reinstall Guide</text>
    <text x="0" y="48" fill="#8892B0" font-size="13" font-family="Arial, sans-serif">Clean install tutorial</text>
  </g>

  <g transform="translate(1120, 515)">
    <text x="0" y="12" fill="#E2E8F0" font-size="14" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">Gentha Arya Pratama</text>
    <text x="0" y="30" fill="#A855F7" font-size="12" font-family="Arial, sans-serif" font-weight="bold" text-anchor="end">Fullstack Software Engineer</text>
  </g>
</svg>
  `.trim();
}

async function runGenerateAndUpload() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Generating Windows Reinstall special thumbnail...');

  const cfg = {
    badge: 'WINDOWS REINSTALL · 2026+',
    titleLines: ['CARA INSTALL ULANG', 'WINDOWS 10/11'],
    subtitle: 'Panduan lengkap reboot bersih Windows - Persiapan bootable, setting BIOS, dan instalasi bersih',
    primaryColor: '#0078D7',
    secondaryColor: '#00B294',
    tags: ['Windows 10', 'Windows 11', 'Clean Install', 'Tech Support', 'IT Guide']
  };

  const svgContent = generateWindowsThumbnailSvg(cfg);
  const base64 = Buffer.from(svgContent).toString('base64');
  const dataUri = 'data:image/svg+xml;base64,' + base64;

  console.log('Uploading Windows Reinstall thumbnail...');
  const uploadRes = await cloudinary.uploader.upload(dataUri, {
    folder: 'gentha-portfolio/blog/branded-thumbs',
    resource_type: 'image',
    format: 'png',
    public_id: 'thumb_windows_reinstall',
    overwrite: true
  });

  console.log(`✓ Windows Reinstall thumbnail uploaded: ${uploadRes.secure_url}`);

  await conn.execute(`
    UPDATE blog_posts 
    SET cover_image_url = ?, cover_image_public_id = ?, updated_at = NOW()
    WHERE slug = 'cara-install-ulang-windows-10-11'
  `, [uploadRes.secure_url, uploadRes.public_id]);

  console.log(`✓ Database updated for Windows Reinstall article`);
  await conn.end();
}

runGenerateAndUpload().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});