import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Briefcase, Globe, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { FastworkIcon } from '../ui/Icons';
import DataFetchLoader from '../ui/DataFetchLoader';

interface ContactFormProps {
  emailContact?: string;
  fastworkUrl?: string;
}

export default function ContactForm({
  emailContact = 'mgentaarya@gmail.com',
  fastworkUrl = 'https://fastwork.id/user/babfpfzm',
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceInterest: 'Web Application',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: 'Pesan berhasil terkirim! Saya akan segera merespons ke email Anda.',
        });
        setFormData({
          name: '',
          email: '',
          serviceInterest: 'Web Application',
          message: '',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Gagal mengirim pesan. Silakan coba lagi.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Koneksi bermasalah, silakan hubungi langsung via Email atau Fastwork.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden overflow-x-clip max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Mulai Diskusi Proyek Anda Hari Ini
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            Punya ide aplikasi atau ingin membangun sistem web kustom? Kirim pesan melalui formulir di bawah ini atau hubungi langsung via email resmi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info with Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="p-8 rounded-3xl bg-[#0D0818]/80 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-2">Saluran Langsung</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Tersedia untuk konsultasi teknis, perancangan arsitektur, atau kebutuhan proyek freelance terpercaya.
              </p>

              <div className="space-y-4">
                {/* Direct Email */}
                <a
                  href={`mailto:${emailContact}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#120B24]/90 border border-purple-500/30 hover:border-purple-400 text-zinc-200 hover:text-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400">Direct Email</div>
                    <div className="text-sm font-semibold text-purple-300">{emailContact}</div>
                  </div>
                </a>

                {/* Fastwork Freelance */}
                <a
                  href={fastworkUrl}
                  target="_blank"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#120B24]/90 border border-fuchsia-500/30 hover:border-fuchsia-400 text-zinc-200 hover:text-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <FastworkIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400">Fastwork Order &amp; Chat</div>
                    <div className="text-sm font-semibold text-fuchsia-300">fastwork.id/user/babfpfzm</div>
                  </div>
                </a>

                {/* GitHub Tech Profile */}
                <a
                  href="https://github.com/Genta-arya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#120B24]/90 border border-cyan-500/30 hover:border-cyan-400 text-zinc-200 hover:text-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400">Tech Repository</div>
                    <div className="text-sm font-semibold text-cyan-300">github.com/Genta-arya</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Work Availability Note */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-fuchsia-950/30 border border-purple-500/25">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status Respons Cepat</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Rata-rata waktu respon pesan adalah 1 - 4 jam kerja. Seluruh diskusi kerahasiaan proyek terjamin.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form with Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 relative p-8 rounded-3xl bg-[#0D0818]/90 border border-purple-500/25 shadow-xl overflow-hidden"
          >
            {/* React Bits Gradient Waves Data Fetch Loader during submission */}
            <DataFetchLoader
              mode="overlay"
              isLoading={loading}
              message="Mengirim Pesan..."
              subMessage="Mengirim notifikasi & menyimpan pesan ke server..."
            />
            {status && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs flex items-center gap-2.5 ${
                  status.type === 'success'
                    ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/50 border border-rose-500/40 text-rose-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Budi Pratama"
                    className="w-full px-4 py-3 rounded-xl bg-[#120B24] border border-purple-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="budi@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#120B24] border border-purple-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Kebutuhan Layanan
                </label>
                <select
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                >
                  <option value="Web Application">Web Application (Dashboard / Sistem Informasi / POS)</option>
                  <option value="Mobile Application">Mobile Application (Android / React Native)</option>
                  <option value="Landing Page">Landing Page &amp; Company Profile</option>
                  <option value="Custom Project">Konsultasi / Arsitektur Khusus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Pesan &amp; Gambaran Proyek
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan gambaran singkat kebutuhan atau fitur aplikasi yang ingin Anda bangun..."
                  className="w-full px-4 py-3 rounded-xl bg-[#120B24] border border-purple-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirimkan Pesan...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Pesan Sekarang</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
