import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Wrench, Code } from 'lucide-react';

interface ServiceItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags?: string[] | null;
  ctaUrl?: string | null;
  displayOrder?: number | null;
}

interface TechItem {
  id: number;
  name: string;
  roleLabel?: string | null;
  category: string;
  glowColor?: string | null;
  displayOrder?: number | null;
}

interface ServicesManagerProps {
  initialServices: ServiceItem[];
  initialTechs: TechItem[];
}

export default function ServicesManager({ initialServices, initialTechs }: ServicesManagerProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'tech'>('services');
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [techs, setTechs] = useState<TechItem[]>(initialTechs);

  // New Service state
  const [newSvc, setNewSvc] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaUrl: '',
    displayOrder: 1,
  });

  // New Tech state
  const [newTech, setNewTech] = useState({
    name: '',
    roleLabel: '',
    category: 'frontend',
    glowColor: '#8B5CF6',
    displayOrder: 1,
  });

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'service', ...newSvc }),
    });
    if (res.ok) {
      window.location.reload();
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Hapus layanan ini?')) return;
    const res = await fetch(`/api/admin/services?type=service&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleAddTech = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'tech', ...newTech }),
    });
    if (res.ok) {
      window.location.reload();
    }
  };

  const handleDeleteTech = async (id: number) => {
    if (!confirm('Hapus tech stack ini?')) return;
    const res = await fetch(`/api/admin/services?type=tech&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTechs(techs.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Layanan &amp; Tech Stack</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola penawaran jasa profesional dan daftar keahlian teknologi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D0818] p-1 rounded-2xl border border-purple-500/20">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Layanan ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'tech'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tech Stacks ({techs.length})
          </button>
        </div>
      </div>

      {/* Services Tab Content */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Services List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Daftar Layanan Aktif</h2>
            {services.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-[#0D0818]/90 border border-purple-500/20 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <div className="text-xs text-purple-300 font-medium">{s.subtitle}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60"
                    title="Hapus Layanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>

          {/* Add Service Form */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D0818]/90 border border-purple-500/25">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tambah Layanan Baru</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Judul Layanan</label>
                <input
                  type="text"
                  required
                  value={newSvc.title}
                  onChange={(e) => setNewSvc({ ...newSvc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                  placeholder="Contoh: Cloud Architecture"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Subjudul</label>
                <input
                  type="text"
                  required
                  value={newSvc.subtitle}
                  onChange={(e) => setNewSvc({ ...newSvc, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                  placeholder="Contoh: Scalable AWS & Docker Infrastructure"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Deskripsi Layanan</label>
                <textarea
                  rows={3}
                  required
                  value={newSvc.description}
                  onChange={(e) => setNewSvc({ ...newSvc, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none resize-none"
                  placeholder="Jelaskan ruang lingkup pekerjaan..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
              >
                Simpan Layanan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tech Stacks Tab Content */}
      {activeTab === 'tech' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tech Stacks Grid */}
          <div className="lg:col-span-7">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Daftar Teknologi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {techs.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-[#0D0818]/90 border border-purple-500/20 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-purple-300">{t.category}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteTech(t.id)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-950/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Tech Form */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D0818]/90 border border-purple-500/25">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tambah Tech Stack</h2>
            <form onSubmit={handleAddTech} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Nama Teknologi</label>
                <input
                  type="text"
                  required
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                  placeholder="Contoh: Go, GraphQL, Redis"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Kategori</label>
                <select
                  value={newTech.category}
                  onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="mobile">Mobile</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps &amp; Tools</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Warna Glow Accent (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTech.glowColor}
                    onChange={(e) => setNewTech({ ...newTech, glowColor: e.target.value })}
                    className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newTech.glowColor}
                    onChange={(e) => setNewTech({ ...newTech, glowColor: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
              >
                Simpan Teknologi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

