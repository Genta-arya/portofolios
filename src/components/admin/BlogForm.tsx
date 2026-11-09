import React, { useState } from 'react';
import TipTapEditor from './TipTapEditor';
import { slugify, calculateReadingTime } from '../../lib/utils';
import { Upload, ArrowLeft, Loader2, Save, Send } from 'lucide-react';

interface BlogCategory {
  id: number;
  name: string;
}

interface BlogFormProps {
  initialData?: {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    coverImagePublicId?: string | null;
    categoryId?: number | null;
    status: 'draft' | 'published' | 'archived';
    seoTitle?: string | null;
    seoDescription?: string | null;
  };
  categories: BlogCategory[];
}

export default function BlogForm({ initialData, categories = [] }: BlogFormProps) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '<p>Tulis artikel teknis Anda di sini...</p>',
    coverImageUrl: initialData?.coverImageUrl || '/projects/elibrary-smk.png',
    coverImagePublicId: initialData?.coverImagePublicId || '',
    categoryId: initialData?.categoryId || (categories[0]?.id || 1),
    status: initialData?.status || 'draft',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({
      ...formData,
      title: val,
      slug: isEditing ? formData.slug : slugify(val),
      seoTitle: isEditing ? formData.seoTitle : val,
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);
    body.append('folder', 'gentha-portfolio/blog');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData({
          ...formData,
          coverImageUrl: data.secure_url,
          coverImagePublicId: data.public_id,
        });
      } else {
        alert(data.error || 'Gagal mengunggah cover ke Cloudinary');
      }
    } catch {
      alert('Koneksi upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    setLoading(true);

    const statusToSave = targetStatus || formData.status;
    const readingTime = calculateReadingTime(formData.content);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      coverImageUrl: formData.coverImageUrl,
      coverImagePublicId: formData.coverImagePublicId,
      categoryId: Number(formData.categoryId),
      status: statusToSave,
      readingTimeMinutes: readingTime,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription || formData.excerpt,
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? JSON.stringify({ id: initialData?.id, ...payload }) : JSON.stringify(payload);

      const res = await fetch('/api/admin/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (res.ok) {
        window.location.href = '/admin/blog';
      } else {
        alert('Gagal menyimpan artikel.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
        <a
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Artikel</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave('draft')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#120B24] border border-purple-500/30 text-zinc-300 hover:text-white"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publikasikan Sekarang</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Judul Artikel
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Contoh: Mengapa Drizzle ORM Menjadi Pilihan Terbaik untuk MySQL"
            className="w-full px-5 py-3 rounded-2xl bg-[#0D0818] border border-purple-500/30 text-white text-base font-bold focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Slug URL
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0818] border border-purple-500/30 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Kategori Artikel
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0818] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Ringkasan Singkat (Excerpt)
          </label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Ringkasan 1-2 kalimat tentang apa yang dipelajari pembaca dalam artikel ini..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#0D0818] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Cover Image (Cloudinary / Local URL)
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#180F30] border border-purple-500/30 shrink-0">
              <img src={formData.coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#0D0818] border border-purple-500/30 text-white text-xs focus:outline-none"
              />
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold cursor-pointer hover:bg-purple-600/50 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Mengunggah cover...' : 'Upload Cover Baru'}</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* TipTap Rich Text Editor */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Isi Konten Artikel (TipTap Rich Text Editor)
          </label>
          <TipTapEditor
            content={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
          />
        </div>

        {/* SEO Meta Box */}
        <div className="p-6 rounded-2xl bg-[#0D0818] border border-purple-500/20 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">SEO &amp; OpenGraph Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Meta Description</label>
              <input
                type="text"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

