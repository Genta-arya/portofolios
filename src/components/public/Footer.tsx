import React from 'react';
import { FastworkIcon } from '../ui/Icons';

export default function Footer() {
  return (
    <footer className="relative border-t border-purple-500/20 bg-[#05030A] pt-16 pb-12 overflow-hidden overflow-x-clip max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-purple-500/15">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#160B33] to-[#0A0518] p-1 border border-purple-500/40 shadow-md shadow-purple-600/30 flex items-center justify-center">
                <img
                  src="/brand-logo.svg"
                  alt="Gentha Arya Brand Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(168,85,247,0.8)]"
                />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Gentha Arya Pratama
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm">
              Fullstack Developer spesialis web enterprise &amp; mobile Android dengan arsitektur modern berkecepatan tinggi.
            </p>
          </div>

          {/* Quick Links & Backlink Profiles */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-400">
            <a href="/#hero" className="hover:text-purple-300 transition-colors">Home</a>
            <a href="/#profile" className="hover:text-purple-300 transition-colors">Profile</a>
            <a href="/#services" className="hover:text-purple-300 transition-colors">Services</a>
            <a href="/#portfolio" className="hover:text-purple-300 transition-colors">Portfolio</a>
            <a href="/#tech-circular" className="hover:text-purple-300 transition-colors">Tech Stack</a>
            <a href="/article" className="hover:text-purple-300 transition-colors">Article</a>
            <a href="/#contact" className="hover:text-purple-300 transition-colors">Contact</a>
            <a
              href="https://fastwork.id/user/babfpfzm"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A0E2E] border border-purple-500/30 text-amber-300 hover:text-white hover:border-amber-400 transition-all font-semibold shadow-sm"
              title="Hire Gentha Arya on Fastwork"
            >
              <FastworkIcon className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Fastwork Profile</span>
            </a>
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
