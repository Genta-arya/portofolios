require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const fixes = [
    {
      title: "Membangun Web Portofolio Interaktif 3D Berkecepatan Tinggi dengan Astro 5 dan React Three Fiber",
      newImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=675&q=80"
    },
    {
      title: "Mengapa Drizzle ORM Menjadi Pilihan Utama untuk MySQL di Ekosistem Node.js Modern",
      newImageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c8709d?auto=format&fit=crop&w=1200&h=675&q=80"
    },
    {
      title: "Mendesain Aplikasi Mobile Real-Time BMKG Menggunakan React Native & Expo",
      newImageUrl: "https://images.unsplash.com/photo-1581276821106-f7166591fbde?auto=format&fit=crop&w=1200&h=675&q=80"
    }
  ];

  for (const fix of fixes) {
    try {
      await conn.query(
        "UPDATE blog_posts SET cover_image_url = ? WHERE title = ? AND cover_image_url LIKE '/%'",
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