import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Bookmark, 
  Type, 
  Volume2, 
  VolumeX, 
  Share2, 
  Check, 
  Copy, 
  ArrowUp, 
  ThumbsUp,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ArticleInteractiveBarProps {
  slug: string;
  title: string;
  articleSelector?: string;
}

export default function ArticleInteractiveBar({
  slug,
  title,
  articleSelector = '.prose'
}: ArticleInteractiveBarProps) {
  // 1. Reactions state (stored in localStorage per slug)
  const [reactions, setReactions] = useState<{ likes: number; claps: number; fires: number }>({
    likes: 12,
    claps: 8,
    fires: 5,
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: boolean }>({});

  // 2. Reading progress
  const [readProgress, setReadProgress] = useState(0);

  // 3. Bookmark
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 4. Font size adjustment (normal / large / extra large)
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // 5. Text to speech (TTS)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  // 6. Share link copied
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check speech synthesis support
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }

    // Load reactions & bookmarks from localStorage
    try {
      const savedReactions = localStorage.getItem(`blog_reactions_${slug}`);
      if (savedReactions) {
        setReactions(JSON.parse(savedReactions));
      } else {
        // Base seed from slug hash
        const seed = Math.abs(slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
        setReactions({
          likes: 8 + (seed % 17),
          claps: 5 + (seed % 12),
          fires: 4 + (seed % 9),
        });
      }

      const savedUserReacted = localStorage.getItem(`blog_user_reacted_${slug}`);
      if (savedUserReacted) {
        setUserReacted(JSON.parse(savedUserReacted));
      }

      const bookmarks = JSON.parse(localStorage.getItem('gentha_blog_bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((b: any) => b.slug === slug));

      const savedFont = localStorage.getItem('gentha_blog_font_size') as any;
      if (savedFont && ['normal', 'large', 'xlarge'].includes(savedFont)) {
        setFontSizeLevel(savedFont);
        applyFontSize(savedFont);
      }
    } catch (_e) {}

    // Track scroll reading progress
    const handleScroll = () => {
      const element = document.querySelector(articleSelector);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementHeight = element.scrollHeight;
      const windowHeight = window.innerHeight;
      
      const totalDist = elementHeight - windowHeight;
      if (totalDist <= 0) {
        setReadProgress(100);
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.min(100, Math.max(0, Math.round((scrolled / totalDist) * 100)));
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slug]);

  // Handle Reactions
  const handleReaction = (type: 'likes' | 'claps' | 'fires') => {
    const isAlready = userReacted[type];
    const newCount = isAlready ? reactions[type] - 1 : reactions[type] + 1;
    const nextReactions = { ...reactions, [type]: Math.max(0, newCount) };
    const nextUserReacted = { ...userReacted, [type]: !isAlready };

    setReactions(nextReactions);
    setUserReacted(nextUserReacted);

    try {
      localStorage.setItem(`blog_reactions_${slug}`, JSON.stringify(nextReactions));
      localStorage.setItem(`blog_user_reacted_${slug}`, JSON.stringify(nextUserReacted));
    } catch (_e) {}
  };

  // Handle Bookmark
  const toggleBookmark = () => {
    try {
      let bookmarks = JSON.parse(localStorage.getItem('gentha_blog_bookmarks') || '[]');
      if (isBookmarked) {
        bookmarks = bookmarks.filter((b: any) => b.slug !== slug);
        setIsBookmarked(false);
      } else {
        bookmarks.unshift({
          slug,
          title,
          url: window.location.pathname,
          savedAt: new Date().toISOString()
        });
        setIsBookmarked(true);
      }
      localStorage.setItem('gentha_blog_bookmarks', JSON.stringify(bookmarks));
    } catch (_e) {}
  };

  // Font size scaler
  const applyFontSize = (level: 'normal' | 'large' | 'xlarge') => {
    const el = document.querySelector(articleSelector) as HTMLElement;
    if (!el) return;
    el.classList.remove('text-base', 'text-lg', 'text-xl', 'leading-relaxed', 'leading-loose');
    if (level === 'normal') {
      el.classList.add('text-base', 'leading-relaxed');
    } else if (level === 'large') {
      el.classList.add('text-lg', 'leading-loose');
    } else if (level === 'xlarge') {
      el.classList.add('text-xl', 'leading-loose');
    }
  };

  const cycleFontSize = () => {
    const next = fontSizeLevel === 'normal' ? 'large' : fontSizeLevel === 'large' ? 'xlarge' : 'normal';
    setFontSizeLevel(next);
    applyFontSize(next);
    try {
      localStorage.setItem('gentha_blog_font_size', next);
    } catch (_e) {}
  };

  // Text-to-Speech (Dengarkan Artikel)
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const el = document.querySelector(articleSelector);
    if (!el) return;

    // Extract text without code blocks to make it sound pleasant
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('pre, code, script, style').forEach((node) => node.remove());
    const rawText = clone.innerText || clone.textContent || '';
    const cleanText = rawText.replace(/\s+/g, ' ').trim().slice(0, 4000); // limit reasonable length

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy Link
  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Top Reading Utility Bar: Floating Card below hero */}
      <div className="my-8 p-3.5 sm:p-4 rounded-2xl bg-[#0D0818]/90 border border-purple-500/25 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left: Reading controls (Audio & Font Size & Bookmark) */}
        <div className="flex flex-wrap items-center gap-2">
          {ttsSupported && (
            <button
              type="button"
              onClick={toggleSpeech}
              title="Dengarkan Artikel (Text to Speech)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/40 animate-pulse'
                  : 'bg-[#120B24] border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Hentikan Audio' : 'Dengarkan Artikel'}</span>
            </button>
          )}

          {/* Font Resizer */}
          <button
            type="button"
            onClick={cycleFontSize}
            title="Ubah Ukuran Teks (Normal / Besar / Ekstra)"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#120B24] border border-purple-500/30 text-zinc-300 hover:text-white hover:border-purple-400 transition-all cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-purple-400" />
            <span className="uppercase text-[11px] font-mono">
              Font: {fontSizeLevel === 'normal' ? 'A' : fontSizeLevel === 'large' ? 'A+' : 'A++'}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={toggleBookmark}
            title={isBookmarked ? 'Hapus dari daftar simpan' : 'Simpan artikel ini untuk dibaca nanti'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#120B24] border border-purple-500/30 text-zinc-300 hover:text-white hover:border-purple-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan Bacaan'}</span>
          </button>
        </div>

        {/* Right: Reading Progress Pill */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <div className="hidden sm:flex items-center gap-2">
            <span>Progress:</span>
            <div className="w-20 h-2 bg-[#120B24] border border-purple-500/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${readProgress}%` }}
              />
            </div>
          </div>
          <span className="font-semibold text-purple-300 font-mono text-[11px]">{readProgress}% dibaca</span>
        </div>
      </div>

      {/* Floating Bottom Quick-Action Dock (Mobile & Desktop) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
        {readProgress > 25 && (
          <button
            type="button"
            onClick={scrollToTop}
            title="Kembali ke atas"
            className="w-10 h-10 rounded-full bg-[#120B24]/90 border border-purple-500/40 text-purple-300 hover:text-white flex items-center justify-center shadow-xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Social Reaction Bar with Emojis & Counts */}
      <div className="my-10 p-5 rounded-3xl bg-gradient-to-br from-[#0F0820]/90 to-[#0A0515]/90 border border-purple-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Bagaimana pendapat Anda tentang artikel ini?</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Beri reaksi instan atau bagikan ilmu ini ke rekan sesama developer.
            </p>
          </div>

          {/* Reaction Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleReaction('likes')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                userReacted['likes']
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/20'
                  : 'bg-[#120B24] text-zinc-300 border-purple-500/30 hover:border-rose-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 text-rose-400 ${userReacted['likes'] ? 'fill-rose-400' : ''}`} />
              <span>{reactions.likes}</span>
            </button>

            <button
              type="button"
              onClick={() => handleReaction('claps')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                userReacted['claps']
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/20'
                  : 'bg-[#120B24] text-zinc-300 border-purple-500/30 hover:border-purple-400 hover:text-white'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 text-purple-400 ${userReacted['claps'] ? 'fill-purple-400' : ''}`} />
              <span>{reactions.claps}</span>
            </button>

            <button
              type="button"
              onClick={() => handleReaction('fires')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                userReacted['fires']
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20'
                  : 'bg-[#120B24] text-zinc-300 border-purple-500/30 hover:border-amber-400 hover:text-white'
              }`}
            >
              <Flame className={`w-4 h-4 text-amber-400 ${userReacted['fires'] ? 'fill-amber-400' : ''}`} />
              <span>{reactions.fires}</span>
            </button>

            {/* Quick Share Copy */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-[#120B24] border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 transition-all cursor-pointer active:scale-95"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
