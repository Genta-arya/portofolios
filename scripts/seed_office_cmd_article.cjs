require('dotenv').config();
const mysql = require('mysql2/promise');

const articleData = {
  title: "Panduan Lengkap Manajemen & Konfigurasi Lisensi Office via Command Prompt (CMD)",
  slug: "panduan-manajemen-konfigurasi-lisensi-office-cmd",
  excerpt: "Kupas tuntas tata cara instalasi, konfigurasi parameter lisensi resmi, dan diagnostik aktivasi Microsoft Office 2016/2019/365 secara legal melalui Command Prompt (CMD) menggunakan skrip bawaan ospp.vbs.",
  categoryId: 5, // Productivity & Office Suite
  coverImageUrl: "/images/blog/office-cmd-management.jpg",
  readingTimeMinutes: 5,
  viewsCount: 112,
  status: "published",
  isFeatured: 0,
  content: `
<h2>Mengenal Mekanisme Manajemen Lisensi Office Berbasis Terminal</h2>
<p>Banyak pengguna dan praktisi TI mengira bahwa pengaturan lisensi pada Microsoft Office hanya dapat dilakukan melalui menu grafis aplikasi (<em>File &gt; Account</em>). Padahal, sistem operasi Windows telah menyediakan antarmuka baris perintah (CLI) yang jauh lebih tangguh untuk keperluan pemeliharaan, inspeksi status, dan pemecahan masalah (troubleshooting) lisensi resmi.</p>

<p>Melalui antarmuka <strong>Command Prompt (CMD)</strong> atau PowerShell, kita memanfaatkan skrip bawaan resmi bernama <code>ospp.vbs</code> (<em>Office Software Protection Platform</em>). Pendekatan ini memungkinkan administrator menangani masalah validasi tanpa perlu menginstal ulang seluruh paket aplikasi perkantoran.</p>

<h2>1. Menemukan Direktori Instalasi Skrip OSPP</h2>
<p>Sebelum mengeksekusi perintah diagnostik, kita perlu membuka Command Prompt dengan hak akses administrator (<strong>Run as administrator</strong>) dan berpindah ke folder tempat komponen pelindung perangkat lunak Office terpasang.</p>

<p>Jalur direktori bervariasi bergantung pada arsitektur sistem Windows dan edisi Office yang Anda pasang:</p>

<pre><code class="language-bash"># Opsi A: Office 64-bit pada Windows 64-bit (Standar Modern)
cd "C:\\Program Files\\Microsoft Office\\Office16"

# Opsi B: Office 32-bit pada Windows 64-bit
cd "C:\\Program Files (x86)\\Microsoft Office\\Office16"

# Catatan versi:
# Folder 'Office16' berlaku untuk Office 2016, 2019, 2021, dan Microsoft 365.
# Untuk edisi Office 2013, nama foldernya adalah 'Office15'.</code></pre>

<h2>2. Memeriksa Status Lisensi dan Riwayat Kunci Produk</h2>
<p>Saat Office memunculkan peringatan <em>Unlicensed Product</em> atau terjadi konflik multi-akun, langkah awal yang tepat adalah membaca log diagnostik langsung dari mesin lisensi Windows:</p>

<pre><code class="language-bash">cscript ospp.vbs /dstatus</code></pre>

<p>Perintah di atas akan menampilkan rincian esensial, antara lain:</p>
<ul>
  <li><strong>LICENSE STATUS:</strong> Status lisensi aktif (misal: <em>---LICENSED---</em> atau <em>---NOTIFICATIONS---</em>).</li>
  <li><strong>Last 5 characters of installed product key:</strong> Lima digit terakhir kunci produk yang sedang terpasang di sistem komputer Anda.</li>
  <li><strong>REMAINING GRACE:</strong> Sisa hari masa tenggang jika Anda menggunakan lisensi evaluasi institusi.</li>
</ul>

<h2>3. Menghapus Kunci Lisensi Lama yang Menimbulkan Konflik</h2>
<p>Masalah paling lazim yang membuat Office gagal mengenali lisensi baru adalah adanya jejak kunci produk lama (bekas langganan percobaan atau lisensi kedaluwarsa) yang masih tersimpan di registry. Untuk menghapusnya secara bersih:</p>

<pre><code class="language-bash"># Ganti 'XXXXX' dengan 5 digit terakhir yang Anda dapatkan dari perintah /dstatus sebelumnya
cscript ospp.vbs /unpkey:XXXXX</code></pre>

<p>Setelah perintah dieksekusi, sistem akan memberikan konfirmasi: <em>&lt;Product key uninstall successful&gt;</em>.</p>

<h2>4. Mendaftarkan Lisensi Baru dan Melakukan Sinkronisasi</h2>
<p>Setelah kunci lama dibersihkan, Anda dapat mendaftarkan lisensi resmi yang sah (Product Key 25 karakter) langsung melalui terminal:</p>

<pre><code class="language-bash"># Langkah 1: Memasang kunci lisensi resmi baru
cscript ospp.vbs /inpkey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX

# Langkah 2: Mengirim permintaan validasi online ke server resmi Microsoft
cscript ospp.vbs /act</code></pre>

<p>Jika koneksi internet stabil dan kunci Anda valid, terminal akan memberikan pesan konfirmasi: <strong>Product activation successful</strong>.</p>

<h2>5. Mengonfigurasi Host Server Lisensi Volume (KMS Resmi Kampus / Kantor)</h2>
<p>Untuk workstation milik instansi atau universitas yang mengandalkan infrastruktur KMS (<em>Key Management Service</em>) lokal terpusat, pengalihan alamat server aktivasi dapat disetel secara manual:</p>

<pre><code class="language-bash"># Mengatur nama host atau IP server KMS resmi instansi Anda
cscript ospp.vbs /sethst:kms.nama-instansi.ac.id

# Menentukan port jaringan (default: 1688)
cscript ospp.vbs /setprt:1688

# Memaksa aktivasi instan ke host yang telah ditentukan
cscript ospp.vbs /act</code></pre>

<h2>Ringkasan Praktis Perintah OSPP</h2>
<p>Berikut rangkuman pintasan perintah <code>ospp.vbs</code> untuk pemeliharaan rutin:</p>

<ul>
  <li><code>cscript ospp.vbs /dstatus</code> &mdash; Menampilkan detail status lisensi saat ini.</li>
  <li><code>cscript ospp.vbs /act</code> &mdash; Memulai proses aktivasi online.</li>
  <li><code>cscript ospp.vbs /inpkey:[Key]</code> &mdash; Memasang kunci produk baru.</li>
  <li><code>cscript ospp.vbs /unpkey:[5-Digit]</code> &mdash; Mencopot kunci produk tertentu.</li>
  <li><code>cscript ospp.vbs /remhst</code> &mdash; Menghapus konfigurasi custom host server lisensi dan kembali ke setelan default.</li>
</ul>

<h2>Kesimpulan</h2>
<p>Pengelolaan lisensi melalui terminal baris perintah memberikan transparansi penuh atas apa yang sebenarnya terjadi di balik layar aplikasi perkantoran Anda. Selain menghindari program pihak ketiga yang berisiko membawa ancaman siber, metode resmi berbasis skrip <code>ospp.vbs</code> memastikan workstation Anda tetap mematuhi standar keamanan enterprise dan integritas lisensi perangkat lunak.</p>
`
};

async function seed() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  const sql = `
    INSERT INTO blog_posts (
      title, slug, excerpt, category_id, cover_image_url, 
      reading_time_minutes, views_count, status, is_featured, content, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
      title = VALUES(title),
      excerpt = VALUES(excerpt),
      category_id = VALUES(category_id),
      cover_image_url = VALUES(cover_image_url),
      content = VALUES(content),
      views_count = VALUES(views_count),
      status = VALUES(status);
  `;

  const [res] = await conn.query(sql, [
    articleData.title,
    articleData.slug,
    articleData.excerpt,
    articleData.categoryId,
    articleData.coverImageUrl,
    articleData.readingTimeMinutes,
    articleData.viewsCount,
    articleData.status,
    articleData.isFeatured,
    articleData.content
  ]);

  console.log("Article inserted successfully! Result:", res.affectedRows);
  const [total] = await conn.query("SELECT COUNT(*) as cnt FROM blog_posts");
  console.log("Total articles in database:", total[0].cnt);
  await conn.end();
}

seed().catch(console.error);
