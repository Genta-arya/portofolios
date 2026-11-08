import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, Sparkles, X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { TiltCard, TiltItem } from '../ui/TiltCard';
import ShinyText from '../reactbits/ShinyText';
import DataFetchLoader from '../ui/DataFetchLoader';

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  category: 'web_app' | 'mobile_app' | 'landing_page';
  subcategoryBadge?: string | null;
  shortDescription: string;
  fullContent?: string | null;
  techStack: string[];
  thumbnailUrl: string;
  liveDemoUrl?: string | null;
  githubRepoUrl?: string | null;
  hireCtaUrl?: string | null;
  isFeatured?: boolean;
}

interface ProjectGridProps {
  initialProjects?: ProjectData[];
}

export default function ProjectGrid({ initialProjects = [] }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'web_app' | 'mobile_app' | 'landing_page'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategorySelect = (catId: 'all' | 'web_app' | 'mobile_app' | 'landing_page') => {
    if (catId === activeCategory) return;
    setIsFiltering(true);
    setActiveCategory(catId);
    setTimeout(() => {
      setIsFiltering(false);
    }, 380);
  };

  // Close modal on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web_app', label: '01 — Web Application' },
    { id: 'mobile_app', label: '02 — Mobile Application' },
    { id: 'landing_page', label: '03 — Landing Page' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filtered = activeCategory === 'all'
    ? initialProjects
    : initialProjects.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    const portfolioEl = document.getElementById('portfolio');
    if (portfolioEl) {
      portfolioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      {/* Ambient Aurora Glow behind Portfolio Section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-purple-600/30 via-fuchsia-600/25 to-cyan-500/20 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <ShinyText text="Selected Works" speed={1.6} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects &amp; Case Studies
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl">
              Portofolio aplikasi nyata yang telah dibangun, mencakup sistem web enterprise, aplikasi mobile Android, dan landing page performa tinggi.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0D0818]/90 p-1.5 rounded-2xl border border-purple-500/20 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project Cards Grid Area with Gradient Waves Data Fetch Loader */}
        <div className="relative min-h-[420px]">
          <DataFetchLoader
            mode="overlay"
            isLoading={isFiltering}
            message="Menyaring Portofolio..."
            subMessage={`Kategori: ${categories.find((c) => c.id === activeCategory)?.label || 'Semua Proyek'}`}
          />

          <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-page-${currentPage}`}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                className="h-full"
              >
              <TiltCard
                maxTilt={13}
                scale={1.025}
                glareColor="rgba(217, 70, 239, 0.28)"
                glareSize={65}
                perspective={1000}
                containerClassName="h-full"
                className="group h-full rounded-3xl bg-gradient-to-b from-[#150B28]/95 via-[#0E071D]/95 to-[#070310]/95 border border-purple-500/30 hover:border-purple-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.35)] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {/* Inset 3D Elevated Framed Thumbnail Container */}
                  <TiltItem translateZ={25} className="w-full mb-3.5">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#120B24] border border-purple-500/30 shadow-inner group-hover:border-purple-400/50 transition-colors">
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* 3D Floating Subcategory Pill */}
                      {project.subcategoryBadge && (
                        <div className="absolute top-2.5 left-2.5 z-10 [transform:translateZ(35px)] px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0D0818]/90 backdrop-blur-md text-purple-300 border border-purple-500/40 shadow-md">
                          {project.subcategoryBadge}
                        </div>
                      )}

                      {/* Quick Overlay Action on Hover with 3D Popout */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-500 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 [transform:translateZ(45px)] cursor-pointer"
                          title="Lihat Detail Proyek"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {project.githubRepoUrl && project.githubRepoUrl !== '#' && (
                          <a
                            href={project.githubRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-[#120B24] border border-purple-500/40 text-white hover:bg-purple-900 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 [transform:translateZ(45px)]"
                            title="Lihat Source Code GitHub"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltItem>

                  {/* Content Details with 3D Layering */}
                  <div className="px-1 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Floating Title */}
                      <TiltItem translateZ={32}>
                        <h3
                          onClick={() => setSelectedProject(project)}
                          className="text-lg font-bold text-white hover:text-purple-300 transition-colors cursor-pointer mb-2 line-clamp-1"
                        >
                          {project.title}
                        </h3>
                      </TiltItem>

                      {/* Floating Description */}
                      <TiltItem translateZ={18}>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                          {project.shortDescription}
                        </p>
                      </TiltItem>
                    </div>
                  </div>
                </div>

                <div className="px-1">
                  {/* Tech Stack Badges floating in 3D */}
                  <TiltItem translateZ={26} className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-950/60 text-purple-200 border border-purple-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] text-zinc-500 font-mono">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </TiltItem>

                  {/* Footer Action Links floating at high Z */}
                  <TiltItem translateZ={30}>
                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/20 text-xs font-semibold">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Detail Fitur</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                        <div className="flex items-center gap-3">
                          {project.githubRepoUrl && (
                            <a
                              href={project.githubRepoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white transition-colors"
                              title="GitHub Repository"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </TiltItem>
                  </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>

      {/* 3D Floating Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          {/* 3D Floating Glassmorphic Dock */}
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-[#0E071D]/90 backdrop-blur-xl border border-purple-500/30 shadow-[0_12px_35px_rgba(0,0,0,0.6)]">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman Sebelumnya"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10 hover:shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Numbered Page Buttons with 3D Elevation */}
            <div className="flex items-center gap-1.5 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Ke Halaman ${page}`}
                    className={`relative w-9 h-9 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.55)] scale-110 -translate-y-0.5 border border-fuchsia-400/50'
                        : 'text-zinc-400 hover:text-white bg-[#140C26]/80 hover:bg-purple-950/50 border border-purple-500/20 hover:border-purple-400/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman Selanjutnya"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10 hover:shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pagination Metadata Tracker */}
          <p className="text-xs text-zinc-400 font-medium">
            Halaman <span className="text-purple-300 font-bold">{currentPage}</span> dari{' '}
            <span className="text-purple-300 font-bold">{totalPages}</span> • Menampilkan {paginatedProjects.length} dari {filtered.length} proyek
          </p>
        </motion.div>
      )}

        {/* Project Detail Modal Dialog with createPortal to escape navbar stacking context */}
        {mounted && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                key="project-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md cursor-pointer overflow-y-auto overscroll-none"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  key="project-modal-card"
                  initial={{ opacity: 0, scale: 0.92, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 25 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-3xl rounded-3xl bg-[#0D0818] border border-purple-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-6 sm:p-8 max-h-[88vh] overflow-y-auto cursor-default my-auto"
                >
                  {/* Top Right Floating Close Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    aria-label="Tutup Modal"
                    className="absolute top-4 right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#120B24]/90 border border-purple-500/40 text-zinc-300 hover:text-white flex items-center justify-center hover:bg-purple-900/60 shadow-lg transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Modal Image */}
                  <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[16/9] bg-[#120B24] border border-purple-500/20">
                    <img
                      src={selectedProject.thumbnailUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Modal Details */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/40">
                      {selectedProject.subcategoryBadge || selectedProject.category}
                    </span>
                    {selectedProject.isFeatured && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/40">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 pr-10">
                    {selectedProject.title}
                  </h3>

                  <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed mb-6">
                    <p>{selectedProject.fullContent || selectedProject.shortDescription}</p>
                  </div>

                  {/* Tech Stack In Modal */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Teknologi &amp; Framework
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/60 text-purple-200 border border-purple-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-purple-500/20">
                    <div className="flex flex-wrap items-center gap-3">
                      {selectedProject.hireCtaUrl && (
                        <a
                          href={selectedProject.hireCtaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <span>Pesan Jasa di Fastwork</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {selectedProject.githubRepoUrl && selectedProject.githubRepoUrl !== '#' && (
                        <a
                          href={selectedProject.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#120B24] border border-purple-500/40 text-white hover:bg-purple-950/60 transition-all"
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Source Code GitHub</span>
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 border border-purple-500/30 hover:border-purple-500/50 transition-all ml-auto cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Tutup Modal (Esc)</span>
                    </button>
                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
}
