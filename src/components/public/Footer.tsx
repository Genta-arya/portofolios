import React from 'react';

export default function Footer() {
  return (
    <footer className="relative border-t border-purple-500/20 bg-[#05030A] pt-16 pb-12 overflow-hidden overflow-x-clip max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-purple-500/15">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-600/30">
                G
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Gentha Arya Pratama
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm">
              Fullstack Developer spesialis web enterprise &amp; mobile Android dengan arsitektur modern berkecepatan tinggi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-400">
            <a href="/#hero" className="hover:text-purple-300 transition-colors">Home</a>
            <a href="/#profile" className="hover:text-purple-300 transition-colors">Profile</a>
            <a href="/#services" className="hover:text-purple-300 transition-colors">Services</a>
            <a href="/#portfolio" className="hover:text-purple-300 transition-colors">Portfolio</a>
            <a href="/#tech-circular" className="hover:text-purple-300 transition-colors">Tech Stack</a>
            <a href="/article" className="hover:text-purple-300 transition-colors">Article</a>
            <a href="/#contact" className="hover:text-purple-300 transition-colors">Contact</a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 text-[11px] text-zinc-500 font-medium text-center">
          <div>
            © {new Date().getFullYear()} Gentha Arya Pratama. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
