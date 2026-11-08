require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const title = "Jebakan React 19 Server Actions & Mengapa Kami Melirik TanStack Start serta Islands Architecture";
  const slug = "jebakan-react-19-server-actions-tanstack-start-islands-architecture";
  const excerpt = "Bedah tuntas ilusi kemudahan React 19 Server Actions: celah deserialization Flight protocol, masalah memory payload bloat, dan komparasi arsitektur nyata dengan TanStack Start serta Islands Architecture.";
  
  // Cloudinary/Unsplash high-quality tech banner image
  const coverImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=675&q=80";

  const content = `## Mengapa Server Actions Terlihat Terlalu Indah di Awal?

Waktu pertama kali React 19 mengumumkan fitur *Server Actions* yang terintegrasi langsung dengan React Server Components (RSC), banyak dari kita merasa seperti menemukan cawan suci *fullstack development*. 

Bayangkan: kita bisa menulis fungsi asynchronous langsung di dalam file komponen, menempelkannya ke atribut \`action\` pada form HTML, lalu secara otomatis React menangani pengiriman data ke server tanpa perlu membuat endpoint \`fetch('/api/v1/...')\` manual. Tidak ada lagi kerumitan boilerplate route handler, tidak perlu parsing payload berulang kali, dan state mutation seolah-olah terjadi secara instan.

\`\`\`tsx
// Ilusi kemudahan: Server Action langsung di dalam komponen
export default function UserProfileForm() {
  async function updateUserAction(formData: FormData) {
    'use server';
    const name = formData.get('name');
    await db.users.update({ name });
  }

  return (
    <form action={updateUserAction}>
      <input name="name" defaultValue="Gentha" />
      <button type="submit">Simpan Perubahan</button>
    </form>
  );
}
\`\`\`

Namun setelah arsitektur ini masuk ke dapur *production* dengan beban traffic nyata dan audit keamanan ketat, ilusi magis tersebut mulai retak. Ada harga mahal yang harus dibayar: kompleksitas boundary yang kabur, ancaman deserialization data di Flight protocol, hingga jebakan memory payload bloat yang jarang dibahas di tutorial permukaan.

---

## 1. Celah Deserialization & Misteri Flight Protocol

Di balik layar, Server Actions tidak bekerja seperti REST API biasa yang mengirim JSON bersih. React menggunakan protokol internal bernama **Flight Protocol**. 

Ketika sebuah fungsi bertanda \`'use server'\` dipanggil dari browser, React mengemas argumen, closures, dan referensi komponen ke dalam format serialisasi khusus, lalu mengirimkannya lewat HTTP POST. Di sisi server, runtime akan melakukan *deserialization* terhadap payload tersebut untuk merekonstruksi pemanggilan fungsi.

> [!CAUTION]
> **Jebakan Deserialization (CVE-2025-55182 / Remote Code Execution):**
> Jika sebuah sistem melakukan deserialisasi objek kompleks tanpa skema validasi yang sangat ketat di level entry point, penyerang dapat memanipulasi Flight payload untuk menyuntikkan instruksi berbahaya ke dalam runtime Node.js server. 

Masalah paling umum yang sering kami temui di lapangan:
1. **Developer lupa memvalidasi ulang hak akses (Authorization)**. Karena Server Actions terlihat seperti fungsi lokal di komponen, banyak programmer pemula mengira tombol yang disembunyikan dengan \`isAdmin ? <button> : null\` sudah aman. Padahal, endpoint Server Action tetap terbuka secara publik di internet dan dapat di-hit langsung menggunakan curl atau Postman.
2. **Ketiadaan skema validasi tipe data (Zod)** di baris pertama fungsi server.

\`\`\`typescript
// Pola yang SALAH (Sangat Rawan Exploit)
async function deleteProjectAction(id: string) {
  'use server';
  // Bahaya: Langsung hapus tanpa cek auth sesi & sanitasi tipe
  await db.query(\`DELETE FROM projects WHERE id = '\${id}'\`);
}

// Pola yang BENAR & Bertahan di Production
import { z } from 'zod';

const DeleteSchema = z.object({
  projectId: z.number().int().positive()
});

async function safeDeleteProjectAction(rawData: unknown) {
  'use server';
  const session = await getVerifiedServerSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Akses ditolak: Sesi tidak sah.');
  }

  const parsed = DeleteSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error('Payload korup atau tidak valid.');
  }

  await db.projects.delete(parsed.data.projectId);
}
\`\`\`

---

## 2. Masalah Memory Bloat & Hidden State Retention

Salah satu kejutan terbesar saat memantau *APM memory profile* aplikasi berbasis Server Actions dengan render dinamis adalah **Payload Bloat**.

Ketika kita mengembalikan state dari Server Action ke client (misalnya menggunakan hook \`useActionState\`), seringkali developer secara tidak sengaja mengembalikan objek database yang terlalu gemuk:

\`\`\`typescript
// Return seluruh objek relasi database ke client
const [state, formAction] = useActionState(async (prevState, formData) => {
  const result = await db.orders.findUnique({
    where: { id: formData.get('orderId') },
    include: { customer: true, items: true, logs: true } // Terlalu banyak payload
  });
  return { success: true, data: result };
}, null);
\`\`\`

Di background, Flight protocol harus melakukan serialisasi seluruh pohon objek tersebut bolak-balik. Di lingkungan *serverless container* yang memiliki limit RAM ketat (seperti AWS Lambda 256MB atau Vercel Edge Function), konsumsi memori untuk serialisasi berulang ini menyebabkan latensi melonjak tajam (Cold Start + Garbage Collection spikes).

---

## 3. Komparasi Nyata: TanStack Start vs Islands Architecture (Astro 5)

Melihat trade-off di atas, komunitas engineer modern mulai mengevaluasi ulang arsitektur fullstack mereka ke dua kubu alternatif yang jauh lebih terprediksi:

\`\`\`mermaid
flowchart TD
    A["Kebutuhan Aplikasi Web"] --> B{"Tipe Karakteristik?"}
    B -->|"SaaS Dashboard / Full App Interaktif"| C["TanStack Start (Vite + Nitro + RPC explicit)"]
    B -->|"Content-Heavy / Portfolio / E-Commerce"| D["Astro 5 Islands (Zero JS by Default)"]
    C --> E["Kelebihan: 100% Type-Safe RPC, TanStack Query, No Hidden Magic"]
    D --> F["Kelebihan: 100 Lighthouse, Partial Hydration, Sangat Cepat"]
\`\`\`

### Alternatif 1: TanStack Start (Kubu Explicit RPC & Isomorphic Control)
TanStack Start dibangun di atas Vite, Nitro server engine, dan TanStack Router. Alih-alih membuat batasan server yang terselubung *magic*, TanStack Start menggunakan pendekatan **Explicit RPC** lewat \`createServerFn\`:

\`\`\`typescript
import { createServerFn } from '@tanstack/start';
import { z } from 'zod';

export const getProjectStats = createServerFn({ method: 'GET' })
  .validator((d: number) => z.number().parse(d))
  .handler(async ({ data: projectId }) => {
    // Berjalan eksklusif di server, aman, dan eksplisit
    return await fetchDatabaseStats(projectId);
  });
\`\`\`

Keunggulan pendekatan ini:
- **Type-safety menyeluruh (End-to-End)**: Parameter URL, search queries, loader data, dan mutation RPC semuanya terikat ke sistem TypeScript statis.
- **Transparan**: Kita tahu persis kapan data diambil dan kapan request jaringan dikirim, tanpa abstraksi tersembunyi yang berisiko memory leak.

### Alternatif 2: Islands Architecture Astro 5 (Kubu Zero-JS by Default)
Untuk situs berbasis konten, blog engineering, atau etalase produk, mengirim seluruh framework React ke browser hanya untuk merender artikel statis adalah pemborosan besar.

Di Astro 5:
- Secara default, halaman dikompilasi menjadi **100% pure HTML & CSS**.
- JavaScript hanya dikirimkan ke komponen yang benar-benar membutuhkan interaktivitas pengguna via direktif \`client:load\` atau \`client:idle\`.

\`\`\`astro
---
// Server component berjalan di server saat build/request
import PublicLayout from '../layouts/PublicLayout.astro';
import StaticArticleHeader from '../components/StaticArticleHeader.astro';
import InteractiveReactionWidget from '../components/InteractiveReactionWidget.tsx';
---

<PublicLayout title="Analisis Arsitektur">
  {/* Pure HTML - Ukuran JS: 0 KB */}
  <StaticArticleHeader />

  {/* Island terisolasi - Hanya komponen ini yang di-hydrate */}
  <InteractiveReactionWidget client:idle />
</PublicLayout>
\`\`\`

Hasilnya:
1. Skor Lighthouse Performance selalu berada di angka **98 - 100**.
2. First Contentful Paint (FCP) berada di bawah 0.4 detik bahkan pada koneksi mobile 4G lemot.
3. Kerentanan deserialization runtime berkurang drastis karena attack surface JavaScript di client sangat minim.

---

## Kesimpulan & Panduan Eksekusi

React 19 Server Actions bukan fitur yang buruk, namun ia menuntut kedewasaan arsitektur yang tinggi dari para engineer yang memakainya. Jangan gunakan Server Actions hanya karena "terlihat keren di demo 3 menit YouTube".

Pilihlah arsitektur dengan jujur sesuai kebutuhan:
1. **Gunakan React 19 Server Actions** jika tim Anda sudah terbiasa dengan ekosistem Next.js App Router, memiliki pipeline audit validasi Zod ketat di setiap action, dan membutuhkan integrasi mutasi form sederhana.
2. **Gunakan TanStack Start** jika Anda membangun SaaS Dashboard yang kaya fitur, membutuhkan kontrol penuh atas RPC server, dan mengutamakan stabilitas state management dengan TanStack Query.
3. **Gunakan Astro 5 Islands** jika kecepatan baca pengguna, skor SEO, efisiensi bandwidth mobile, dan integritas keamanan adalah prioritas nomor satu Anda.`;

  // Check if article already exists
  const [existing] = await conn.query('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
  if (existing.length > 0) {
    console.log('Article already exists, updating...');
    await conn.query(`
      UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, cover_image_url = ?, reading_time_minutes = 6, category_id = 1, updated_at = NOW()
      WHERE slug = ?
    `, [title, excerpt, content, coverImageUrl, slug]);
  } else {
    console.log('Inserting new article...');
    await conn.query(`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, cover_image_url, reading_time_minutes, views_count, category_id, is_featured, status, published_at, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, 6, 0, 1, 0, 'published', NOW(), NOW(), NOW()
      )
    `, [title, slug, excerpt, content, coverImageUrl]);
  }

  console.log('SUCCESS! Published article with slug:', slug);
  await conn.end();
}

run().catch(console.error);
