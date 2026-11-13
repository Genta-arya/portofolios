require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Fix the 3 articles that use local image paths
  const fixes = [
    {
      title: "Panduan Lengkap Manajemen & Konfigurasi Lisensi Office via Command Prompt (CMD)",
      newImageUrl: "https://images.unsplash.com/photo-1581276821106-f7166591fbde?auto=format&fit=crop&w=1200&h=675&q=80"
    },
    {
      title: "Panduan Deployment & Instalasi Microsoft Office via CLI: Menggunakan Office Deployment Tool (ODT) & OSPP Script",
      newImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80"
    },
    {
      title: "Menguasai Regular Expressions (RegEx) Tanpa Sakit Kepala: Pola Penting untuk Developer",
      newImageUrl: "https://images.unsplash.com/photo-1546921650-5f1e3f0d6f7c?auto=format&fit=crop&w=1200&h=675&q=80"
    }
  ];

  for (const fix of fixes) {
    try {
      await conn.query(
        "UPDATE blog_posts SET cover_image_url = ? WHERE title = ? AND cover_image_url LIKE '/%images/blog%'",
        [fix.newImageUrl, fix.title]
      );
      console.log(`✓ Fixed image for: "${fix.title}""`);
    } catch (err) {
      console.error(`✗ Failed to fix image for "${fix.title}":`, err.message);
    }
  }

  console.log('\nImage fix completed!');
  await conn.end();
}

run().catch(console.error);