import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Upload, X, Check, Loader2, Sparkles } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { slugify } from '../../lib/utils';

export interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  category: 'web_app' | 'mobile_app' | 'landing_page';
  subcategoryBadge?: string | null;
  shortDescription: string;
  fullContent?: string | null;
  techStack: string[];
  thumbnailUrl: string;
  thumbnailPublicId?: string | null;
  liveDemoUrl?: string | null;
  githubRepoUrl?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
}

interface ProjectManagerProps {
  initialProjects: ProjectItem[];
}

export default function ProjectManager({ initialProjects }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: 'web_app' | 'mobile_app' | 'landing_page';
    subcategoryBadge: string;
    shortDescription: string;
    fullContent: string;
    techStackInput: string;
    techStack: string[];
    thumbnailUrl: string;
    thumbnailPublicId: string;
    liveDemoUrl: string;
    githubRepoUrl: string;
    isFeatured: boolean;
    displayOrder: number;
  }>({
    title: '',
    slug: '',
    category: 'web_app',
    subcategoryBadge: '',
    shortDescription: '',
    fullContent: '',
    techStackInput: '',
    techStack: ['React JS', 'Tailwind CSS'],
    thumbnailUrl: '/projects/elibrary-smk.png',
    thumbnailPublicId: '',
    liveDemoUrl: '',
    githubRepoUrl: '',
    isFeatured: true,
    displayOrder: 0,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'web_app',
      subcategoryBadge: '',
      shortDescription: '',
      fullContent: '',
      techStackInput: '',
      techStack: ['React JS', 'Express JS', 'MySQL'],
      thumbnailUrl: '/projects/elibrary-smk.png',
      thumbnailPublicId: '',
      liveDemoUrl: '',
      githubRepoUrl: '',
      isFeatured: true,
      displayOrder: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectItem) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      subcategoryBadge: p.subcategoryBadge || '',
      shortDescription: p.shortDescription,
      fullContent: p.fullContent || '',
      techStackInput: '',
      techStack: p.techStack || [],
      thumbnailUrl: p.thumbnailUrl,
      thumbnailPublicId: p.thumbnailPublicId || '',
      liveDemoUrl: p.liveDemoUrl || '',
      githubRepoUrl: p.githubRepoUrl || '',
      isFeatured: p.isFeatured ?? true,
      displayOrder: p.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({
      ...formData,
      title: val,
      slug: editingId ? formData.slug : slugify(val),
    });
  };

  const handleAddTag = () => {
    if (formData.techStackInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, formData.techStackInput.trim()],
        techStackInput: '',
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tagToRemove),
    });
  };

  // Upload to Cloudinary API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);
    body.append('folder', 'gentha-portfolio/projects');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData({
          ...formData,
          thumbnailUrl: data.secure_url,
          thumbnailPublicId: data.public_id,
        });
      } else {
        alert(data.error || 'Upload gambar ke Cloudinary gagal');
      }
    } catch {
      alert('Koneksi upload error');
    } finally {
      setUploading(false);
    }
  };

  // Save Project
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      subcategoryBadge: formData.subcategoryBadge,
      shortDescription: formData.shortDescription,
      fullContent: formData.fullContent,
      techStack: formData.techStack,
      thumbnailUrl: formData.thumbnailUrl,
      thumbnailPublicId: formData.thumbnailPublicId,
      liveDemoUrl: formData.liveDemoUrl,
      githubRepoUrl: formData.githubRepoUrl,
      isFeatured: formData.isFeatured,
      displayOrder: Number(formData.displayOrder),
    };

    try {
      if (editingId) {
        // Update
        const res = await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (res.ok) {
          setProjects(projects.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
          setIsModalOpen(false);
        } else {
          alert('Gagal memperbarui proyek.');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert('Gagal menambahkan proyek.');
        }
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Project
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus proyek ini? Gambar di Cloudinary juga akan dihapus.')) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert('Gagal menghapus proyek.');
      }
    } catch {
      alert('Error saat menghapus proyek.');
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Manajemen Proyek Portofolio</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Total {projects.length} proyek tersimpan di database MySQL &amp; Cloudinary
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl bg-[#0D0818]/90 border border-purple-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#120B24] border-b border-purple-500/20 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="py-4 px-6">Thumbnail &amp; Judul</th>
                <th className="py-4 px-4">Kategori</th>
                <th className="py-4 px-4">Tech Stack</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#180F30] shrink-0 border border-purple-500/20">
                        <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-xs">
                        <div className="font-bold text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-zinc-400 font-mono truncate">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      {p.subcategoryBadge || p.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.techStack?.slice(0, 3).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-zinc-300">
                          {t}
                        </span>
                      ))}
                      {(p.techStack?.length || 0) > 3 && (
                        <span className="text-[10px] text-zinc-500">+{p.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {p.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        Ya
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 rounded-lg bg-[#120B24] border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900 transition-all"
                        title="Edit Proyek"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg bg-[#120B24] border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-950 transition-all"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Form with AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="project-admin-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer overflow-y-auto"
          >
            <motion.div
              key="project-admin-modal-card"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl bg-[#0D0818] border border-purple-500/40 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl cursor-default my-auto"
            >
            
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#120B24] text-zinc-400 hover:text-white hover:bg-rose-600 transition-colors z-20 cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Edit Proyek Portofolio' : 'Tambah Proyek Baru'}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Judul Proyek
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Kategori Utama
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="web_app">Web Application</option>
                    <option value="mobile_app">Mobile Application</option>
                    <option value="landing_page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Subkategori Badge (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.subcategoryBadge}
                    placeholder="Contoh: Education System, Commerce Admin"
                    onChange={(e) => setFormData({ ...formData, subcategoryBadge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              {/* Cloudinary Image Uploader */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Thumbnail Proyek (Cloudinary / Local URL)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-[#180F30] border border-purple-500/30 shrink-0">
                    <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/... atau /projects/..."
                      className="w-full px-4 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold cursor-pointer hover:bg-purple-600/50 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Mengunggah ke Cloudinary...' : 'Upload Gambar Baru'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Tech Stack
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.techStackInput}
                    onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Ketik teknologi lalu tekan Tambah (Contoh: React, MySQL)"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.techStack.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-950/60 text-purple-200 border border-purple-500/30"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubRepoUrl}
                    onChange={(e) => setFormData({ ...formData, githubRepoUrl: e.target.value })}
                    placeholder="https://github.com/Genta-arya/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Tampilkan sebagai Featured Project</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-zinc-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Proyek</span>
                </button>
              </div>
            </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
