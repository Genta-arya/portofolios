import React, { useState } from 'react';
import { Save, Check, Loader2, Mail } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: any;
}

export default function SettingsForm({ initialSettings = {} }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialSettings.fullName || 'Gentha Arya Pratama',
    roleTitle: initialSettings.roleTitle || 'Fullstack Developer · Web & Mobile',
    shortBio: initialSettings.shortBio || '',
    aboutDescription: initialSettings.aboutDescription || '',
    availableForHire: initialSettings.availableForHire ?? true,
    whatsappNumber: initialSettings.whatsappNumber || '',
    emailContact: initialSettings.emailContact || 'mgentaarya@gmail.com',
    githubUrl: initialSettings.githubUrl || 'https://github.com/Genta-arya',
    linkedinUrl: initialSettings.linkedinUrl || 'https://linkedin.com/in/mgentaarya',
    fastworkUrl: initialSettings.fastworkUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Gagal menyimpan profil.');
      }
    } catch {
      alert('Error saat menyimpan pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan profil berhasil diperbarui secara real-time!</span>
        </div>
      )}

      {/* Main Profile Box */}
      <div className="p-8 rounded-3xl bg-[#0D0818]/90 border border-purple-500/20 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Identitas &amp; Profil Utama</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Role / Headline</label>
            <input
              type="text"
              required
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Bio Singkat (Hero)</label>
          <textarea
            rows={3}
            value={formData.shortBio}
            onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Deskripsi Lengkap (About Me)</label>
          <textarea
            rows={4}
            value={formData.aboutDescription}
            onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
          />
        </div>

        {/* Available for Hire Switch */}
        <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Status Availability</div>
            <div className="text-[11px] text-zinc-400">Tampilkan badge &quot;Available for freelance opportunities&quot; di Hero Section</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.availableForHire}
              onChange={(e) => setFormData({ ...formData, availableForHire: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#120B24] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Socials & Contact Box */}
      <div className="p-8 rounded-3xl bg-[#0D0818]/90 border border-purple-500/20 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Kontak &amp; Tautan Sosial Media</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Nomor WhatsApp (Format: 628...)</label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Email Kontak Publik</label>
            <input
              type="email"
              value={formData.emailContact}
              onChange={(e) => setFormData({ ...formData, emailContact: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>Simpan Perubahan Pengaturan</span>
      </button>
    </form>
  );
}
