require('dotenv').config();
const mysql = require('mysql2/promise');

const articleData = {
  title: "Panduan Deployment & Instalasi Microsoft Office via CLI: Menggunakan Office Deployment Tool (ODT) & OSPP Script",
  slug: "panduan-deployment-instalasi-office-via-cli-odt",
  excerpt: "Pelajari cara instalasi, kustomisasi paket aplikasi, dan manajemen aktivasi lisensi resmi Microsoft Office/365 secara bersih dan otomatis melalui Command Line Interface (CLI) menggunakan Office Deployment Tool dan ospp.vbs.",
  categoryId: 5,
  coverImageUrl: "/images/blog/office-cli-deployment.jpg",
  readingTimeMinutes: 6,
  viewsCount: 88,
  status: "published",
  isFeatured: 0,
  content: `
<h2>Mengapa Menggunakan CLI untuk Deployment Office?</h2>
<p>Bagi administrator sistem, developer, maupun power-user, menginstal paket aplikasi perkantoran seperti Microsoft Office atau Microsoft 365 melalui installer grafis web (Click-to-Run standar) sering kali terasa lambat, tidak fleksibel, dan memaksa seluruh paket aplikasi yang tidak dibutuhkan terinstal ke dalam disk penyimpanan.</p>

<p>Melalui pendekatan <strong>Command Line Interface (CLI)</strong> resmi yang disediakan oleh Microsoft via <strong>Office Deployment Tool (ODT)</strong>, kita dapat:</p>
<ul>
  <li>Memilih secara selektif aplikasi yang ingin diinstal (misalnya hanya Word, Excel, dan PowerPoint tanpa OneDrive atau Access).</li>
  <li>Menentukan arsitektur sistem (64-bit vs 32-bit) dan channel update (Current, Monthly Enterprise, atau Semi-Annual).</li>
  <li>Mengotomatisasi deployment massal tanpa dialog interaktif yang mengganggu (Silent Install).</li>
  <li>Memeriksa status aktivasi lisensi resmi organisasi atau akun Microsoft secara transparan melalui script utilitas <code>ospp.vbs</code>.</li>
</ul>

<h2>1. Menyiapkan Office Deployment Tool (ODT)</h2>
<p>Langkah pertama adalah mengunduh file biner resmi <code>setup.exe</code> dari Microsoft Download Center (ODT). Ekstrak file tersebut ke dalam direktori khusus di komputer Anda, misalnya <code>C:\\OfficeDeploy</code>.</p>

<p>Setelah diekstrak, buat file konfigurasi bernama <code>configuration.xml</code> di direktori yang sama. File XML ini berfungsi sebagai blueprint instalasi.</p>

<pre><code class="language-xml">&lt;Configuration&gt;
  &lt;Add OfficeClientEdition="64" Channel="Current"&gt;
    &lt;Product ID="O365ProPlusRetail"&gt;
      &lt;Language ID="en-us" /&gt;
      &lt;Language ID="id-id" /&gt;
      &lt;ExcludeApp ID="Access" /&gt;
      &lt;ExcludeApp ID="Groove" /&gt;
      &lt;ExcludeApp ID="Lync" /&gt;
      &lt;ExcludeApp ID="OneDrive" /&gt;
      &lt;ExcludeApp ID="OneNote" /&gt;
      &lt;ExcludeApp ID="Publisher" /&gt;
    &lt;/Product&gt;
  &lt;/Add&gt;
  &lt;Updates Enabled="TRUE" /&gt;
  &lt;Display Level="Full" AcceptEULA="TRUE" /&gt;
&lt;/Configuration&gt;</code></pre>

<blockquote>
  <strong>Tips Optimalisasi:</strong> Tag <code>&lt;ExcludeApp&gt;</code> di atas memastikan sistem Anda tetap ringan dan menghemat ruang penyimpanan SSD dengan hanya mengunduh inti aplikasi kerja yang esensial.
</blockquote>

<h2>2. Eksekusi Download &amp; Instalasi via Terminal / Command Prompt</h2>
<p>Buka <strong>Command Prompt (CMD)</strong> atau <strong>PowerShell</strong> dengan hak akses <em>Run as Administrator</em>, lalu arahkan ke direktori file ODT Anda:</p>

<pre><code class="language-bash"># Berpindah ke folder deployment
cd C:\\OfficeDeploy

# Opsional: Mengunduh installer offline terlebih dahulu (berguna untuk multi-PC)
setup.exe /download configuration.xml

# Menjalankan instalasi otomatis secara langsung
setup.exe /configure configuration.xml</code></pre>

<p>Proses instalasi akan berjalan dengan streaming paket resmi dari CDN Microsoft secara terverifikasi dan aman tanpa bloatware pihak ketiga.</p>

<h2>3. Manajemen Status Lisensi &amp; Aktivasi Resmi via OSPP Script</h2>
<p>Microsoft menyertakan script administrasi resmi bernama <strong>Office Software Protection Platform (OSPP)</strong> yang berlokasi di direktori instalasi Office. Melalui script ini, kita dapat mengecek status lisensi, mengaitkan Product Key resmi, atau mengarahkan ke KMS server resmi milik kampus/perusahaan.</p>

<p>Buka Command Prompt Administrator dan navigasikan ke direktori instalasi:</p>

<pre><code class="language-bash"># Untuk Office 64-bit standar:
cd "C:\\Program Files\\Microsoft Office\\Office16"

# Atau untuk Office 32-bit di Windows 64-bit:
cd "C:\\Program Files (x86)\\Microsoft Office\\Office16"</code></pre>

<h3>A. Memeriksa Status Lisensi Saat Ini</h3>
<p>Jalankan perintah berikut untuk melihat status aktivasi, 5 karakter terakhir lisensi resmi, dan masa berlaku lisensi institusi:</p>

<pre><code class="language-bash">cscript ospp.vbs /dstatus</code></pre>

<h3>B. Memasukkan Lisensi Resmi / Volume License Key</h3>
<p>Jika Anda memiliki lisensi resmi institusi atau retail key resmi yang dibeli:</p>

<pre><code class="language-bash"># Memasukkan 25-digit product key resmi
cscript ospp.vbs /inpkey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX

# Menjalankan validasi aktivasi online ke server resmi Microsoft
cscript ospp.vbs /act</code></pre>

<h3>C. Menghapus Lisensi Lama yang Kedaluwarsa / Konflik</h3>
<p>Sering kali saat berganti akun Microsoft 365, lisensi lama yang menempel menyebabkan konflik dialog peringatan. Anda dapat mencabut lisensi lama dengan melihat 5 karakter terakhir key dari hasil <code>/dstatus</code>:</p>

<pre><code class="language-bash"># Cabut lisensi lama dengan 5 digit terakhir
cscript ospp.vbs /unpkey:ABCDE</code></pre>

<h2>Kesimpulan</h2>
<p>Mengelola paket aplikasi perkantoran dengan CLI dan file konfigurasi XML adalah standar industri yang rapi, aman, dan dapat diulang (reproducible). Selain menghemat waktu dibanding klik manual berulang kali, pendekatan ini menjamin instalasi Anda bebas dari malware serta selalu terhubung secara sah ke server resmi Microsoft.</p>
`
};

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const sql = `
    INSERT INTO blog_posts (title, slug, excerpt, category_id, cover_image_url, reading_time_minutes, views_count, status, is_featured, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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

  console.log("Article inserted successfully! Affected rows:", res.affectedRows);
  const [count] = await conn.query("SELECT COUNT(*) as total FROM blog_posts;");
  console.log("Total articles now:", count[0].total);
  await conn.end();
}

run().catch(console.error);
