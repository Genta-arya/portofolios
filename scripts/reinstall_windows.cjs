const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection('mysql://mgentaar_portofolio:7KuUsZph9eYJ4TfsKt5F@151.243.222.66:3306/mgentaar_portofolio');

  const title = "Cara Install Ulang Windows 10/11 dengan Mudah dan Cepat";
  const slug = "cara-install-ulang-windows-10-11";
  const excerpt = "Tutorial lengkap cara menginstal ulang Windows 10 atau 11 dari awal hingga selesai, lengkap dengan persiapan bootable USB, pengaturan BIOS/UEFI, dan langkah-langkah instalasi";

  // Unsplash high-quality image for Windows reinstall
  const coverImageUrl = "https://images.unsplash.com/photo-1532668746407-5d601cfd7b2d?auto=format&fit=crop&w=1200&h=675&q=80";

  const content = `<h2>Persiapan sebelum Memulai</h2>
<p>Sebelum memulai proses instalasi, pastikan Anda telah mempersiapkan hal-hal berikut:</p>
<ul>
<li>Komputer atau laptop dengan kapasitas minimal 2GB RAM dan 20GB ruang storage</li>
<li>Flash drive/minimal 8GB (semua data akan terhapus, jadi backup terlebih dahulu)</li>
<li>Koneksi internet untuk mengunduh driver dan update</li>
<li>Sistem operasi Windows 10 atau 11 ISO file dari situs resmi Microsoft</li>
<li>Alat untuk membuat bootable USB (Rufus, Media Creation Tool, atau balenaEtcher)</li>
</ul>

<h2>Membuat Bootable USB Windows</h2>
<h3>Menggunakan Rufus:</h3>
<ol>
<li>Sematkan flash drive ke komputer (minimal 8GB)</li>
<li>Buka Rufus dan pilih device flash drive-nya</li>
<li>Pilih "SELECT" dan cari file ISO Windows yang sudah didownload</li>
<li>Partition scheme: GPT (untuk UEFI) atau MBR (untuk BIOS Legacy)</li>
<li>Target system: UEFI (disarankan untuk komputer modern)</li>
<li>Klik "START" dan tunggu proses pembuatan selesai</li>
</ol>

<h3>Menggunakan Microsoft Media Creation Tool:</h3>
<ol>
<li>Unduh Media Creation Tool dari situs Microsoft</li>
<li>Jalankan tool dan pilih "Create installation media for another PC"</li>
<li>Pilih bahasa, edisi Windows, dan arsitektur (32-bit atau 64-bit)</li>
<li>Pilih USB flash drive sebagai media</li>
<li>Tunggu hingga proses download dan penulisan selesai</li>
</ol>

<h2>Mengubah Setting BIOS/UEFI</h2>
<p>Setelah USB siap, matikan komputer dan lakukan settingan berikut:</p>
<ol>
<li>Sematkan flash drive USB Windows ke port USB</li>
<li>Nyalakan komputer dan masuk ke BIOS/UEFI (tekan F2, F12, Del, atau Esc saat boot - sesuaikan merk motherboard)</li>
<li>Pergi ke tab Boot atau Boot Priority</li>
<li>Pilih USB Drive sebagai boot pertama ( pertama kali muncul nama flash drive)</li>
<li>Simpan settingan (Save & Exit) dan keluar</li>
</ol>

<h2>Memulai Instalasi Windows</h2>
<p>Setelah komputer reboot dengan boot dari USB, Anda akan melihat:</p>
<ol>
<li>Pilih bahasa, waktu, dan format keyboard - klik "Next"</li>
<li>Klik "Install Now" untuk memulai instalasi</li>
<li>Masukkan product key Windows (atau pilih "I don't have a product key" jika ingin aktif nanti)</li>
<li>Pilih edisi Windows yang sesuai dengan product key Anda</li>
<li>Terima perjanjian lisensi dan klik "Next"</li>
</ol>

<h2>Jenis Instalasi: Upgrade atau Custom</h2>
<p>Di sini ada pilihan krusial:</p>
<ul>
<li><strong>Upgrade:</strong> Mempertahankan file, aplikasi, dan settingan lama (hanya untuk upgrade versi)</li>
<li><strong>Custom:</strong> Instal bersih (clean install) - semua data akan terhapus, pilih ini untuk instal ulang total</li>
</ul>

<h3>Untuk Instal Ulang Bersih (Custom Install):</h3>
<ol>
<li>Pilih "Custom: Install Windows only (advanced)"</li>
<li>Pilih partisi yang ingin diinstal (biasanya partition sistem C:)</li>
<li>Jika partisi sudah ada dan ingin dihapus, klik "Drive options" lalu "Delete"</li>
<li>Pilih partisi kosong dan klik "Next" - Windows akan membuat partisi baru secara otomatis</li>
</ol>

<h2>Langkah-langkah Selanjutnya</h2>
<ol>
<li>Windows akan mulai menyalin file, menginstall driver, dan restart beberapa kali</li>
<li>Ketika muncul tampilan "Windows Setup" lagi, jangan menekan tombol apa-apa</li>
<li>Setelah restart, masukkan product key jika belum dimasukkan</li>
<li>Pilih wilayah dan bahasa yang diinginkan</li>
<li>Setel opsi "Set up for personal use" atau "Set up for organization"</li>
<li>Masukkan akun Microsoft atau buat akun lokal (Offline account -> Limited experience -> Continue anyway)</li>
<li>Tunggu hingga Windows selesai konfigurasi langkah pertama</li>
</ol>

<h2>Pasang Driver dan Update</h2>
<p>Setelah Windows berhasil diinstal:</p>
<ol>
<li>Buka Settings > Update & Security > Check for updates - instal semua update yang tersedia</li>
<li>Pasang driver grafis (NVIDIA, AMD, atau Intel) dari situs resmi</li>
<li>Pasang driver chipset dari situs motherboard</li>
<li>Instal driver audio jika suara tidak berfungsi</li>
<li>Install antivirus dan aplikasi penting</li>
</ol>

<h2>Tips & Trik</h2>
<ul>
<li>Pastikan baterai laptop terisi penuh atau menyambungkan charger selama proses instalasi</li>
<li>Jangan memutuskan tegangan listrik selama proses instalasi berlangsung</li>
<li>Jika komputer boot terus ke BIOS, cek lagi settingan Boot Priority</li>
<li>Gunakan Windows Key + R lalu ketik "msconfig" untuk menonaktifkan program startup yang tidak perlu</li>
<li>Lakukan backup data penting setelah Windows stabil (minimal 1x dalam sebulan)</li>
</ul>`;

  // Check if article already exists
  const [existing] = await conn.query('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
  if (existing.length > 0) {
    console.log('Article already exists, updating...');
    await conn.query(`
      UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, cover_image_url = ?, reading_time_minutes = 8, category_id = 3, updated_at = NOW()
      WHERE slug = ?
    `, [title, excerpt, content, coverImageUrl, slug]);
  } else {
    console.log('Inserting new article...');
    await conn.query(`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, cover_image_url, reading_time_minutes, views_count, category_id, is_featured, status, published_at, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, 8, 0, 3, 0, 'published', NOW(), NOW(), NOW()
      )
    `, [title, slug, excerpt, content, coverImageUrl]);
  }

  console.log('SUCCESS! Published article with slug:', slug);
  await conn.end();
}

run().catch(console.error);