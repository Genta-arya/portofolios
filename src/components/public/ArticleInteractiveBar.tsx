import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bookmark, 
  Type, 
  Volume2, 
  VolumeX, 
  Share2, 
  Check, 
  Copy, 
  ThumbsUp,
  Flame,
  CheckCircle2,
  BookmarkCheck,
  X,
  ExternalLink,
  Trash2,
  BookOpen
} from 'lucide-react';

interface ArticleInteractiveBarProps {
  slug: string;
  title: string;
  articleSelector?: string;
  mode?: 'all' | 'top' | 'bottom';
}

interface SavedArticle {
  slug: string;
  title: string;
  url: string;
  savedAt: string;
}

export default function ArticleInteractiveBar({
  slug,
  title,
  articleSelector = '.article-prose',
  mode = 'all'
}: ArticleInteractiveBarProps) {
  // 1. Reactions state
  const [reactions, setReactions] = useState<{ likes: number; claps: number; fires: number }>({
    likes: 12,
    claps: 8,
    fires: 5,
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: boolean }>({});

  // 2. Bookmark state & Modal Drawer
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);

  // 4. Font size adjustment (normal / large / extra large)
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // 5. Text to speech (TTS)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  // 6. Share link copied
  const [copied, setCopied] = useState(false);

  const loadSavedArticles = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('gentha_blog_bookmarks') || '[]');
      setSavedArticles(bookmarks);
      setIsBookmarked(bookmarks.some((b: any) => b.slug === slug));
    } catch (_e) {}
  };

  useEffect(() => {
    // Check speech synthesis support
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }

    // Load reactions, bookmarks, font size
    try {
      const savedReactions = localStorage.getItem(`blog_reactions_${slug}`);
      if (savedReactions) {
        setReactions(JSON.parse(savedReactions));
      } else {
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

      loadSavedArticles();

      const savedFont = localStorage.getItem('gentha_blog_font_size') as any;
      if (savedFont && ['normal', 'large', 'xlarge'].includes(savedFont)) {
        setFontSizeLevel(savedFont);
        applyFontSize(savedFont);
      }
    } catch (_e) {}

    return () => {
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
      let bookmarks: SavedArticle[] = JSON.parse(localStorage.getItem('gentha_blog_bookmarks') || '[]');
      if (isBookmarked) {
        bookmarks = bookmarks.filter((b) => b.slug !== slug);
        setIsBookmarked(false);
      } else {
        bookmarks.unshift({
          slug,
          title,
          url: window.location.pathname,
          savedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        setIsBookmarked(true);
      }
      localStorage.setItem('gentha_blog_bookmarks', JSON.stringify(bookmarks));
      setSavedArticles(bookmarks);
    } catch (_e) {}
  };

  const removeBookmarkItem = (targetSlug: string) => {
    try {
      let bookmarks: SavedArticle[] = JSON.parse(localStorage.getItem('gentha_blog_bookmarks') || '[]');
      bookmarks = bookmarks.filter((b) => b.slug !== targetSlug);
      localStorage.setItem('gentha_blog_bookmarks', JSON.stringify(bookmarks));
      setSavedArticles(bookmarks);
      if (targetSlug === slug) {
        setIsBookmarked(false);
      }
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

    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('pre, code, script, style').forEach((node) => node.remove());
    const rawText = clone.innerText || clone.textContent || '';
    const cleanText = rawText.replace(/\s+/g, ' ').trim().slice(0, 4000);

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
      {(mode === 'all' || mode === 'top') && (
        <div className="my-8 p-3.5 sm:p-4 rounded-2xl bg-[#0D0818]/90 border border-purple-500/25 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          {/* Left: Reading controls (Audio, Font Size, Bookmark & Bookmark List) */}
          <div className="flex flex-wrap items-center gap-2">
            {ttsSupported && (
              <button
                type="button"
                onClick={toggleSpeech}
                title="Bacakan Artikel (Text to Speech)"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/40 animate-pulse'
                    : 'bg-[#120B24] border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
                <span>{isSpeaking ? 'Hentikan Audio' : 'Bacakan Artikel'}</span>
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
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-white' : 'text-purple-400'}`} />
              <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
            </button>

            {/* View Saved Articles Drawer Button */}
            <button
              type="button"
              onClick={() => {
                loadSavedArticles();
                setIsBookmarkModalOpen(true);
              }}
              title="Lihat daftar artikel yang telah disimpan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#120B24] border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 transition-all cursor-pointer"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Daftar Simpan ({savedArticles.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Social Reaction Bar with Emojis & Counts */}
      {(mode === 'all' || mode === 'bottom') && (
        <div className="my-10 p-5 rounded-3xl bg-gradient-to-br from-[#0F0820]/90 to-[#0A0515]/90 border border-purple-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
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
      )}

      {/* Bookmark Modal Drawer */}
      {isBookmarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0D071E] border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                <h3 className="text-base font-bold text-white">Artikel Tersimpan</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookmarkModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedArticles.length === 0 ? (
              <div className="py-12 text-center text-zinc-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-purple-400/40" />
                <p className="text-sm font-semibold text-white">Belum Ada Artikel Tersimpan</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Klik tombol &quot;Simpan&quot; di atas untuk menyimpan artikel dan membacanya kapan saja.
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {savedArticles.map((item) => (
                  <div
                    key={item.slug}
                    className="p-3.5 rounded-2xl bg-[#140A28] border border-purple-500/20 hover:border-purple-400/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <a
                      href={item.url}
                      className="flex-1 min-w-0"
                      onClick={() => setIsBookmarkModalOpen(false)}
                    >
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">
                        Disimpan: {item.savedAt}
                      </span>
                    </a>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={item.url}
                        title="Buka artikel"
                        className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/40 transition-all"
                        onClick={() => setIsBookmarkModalOpen(false)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => removeBookmarkItem(item.slug)}
                        title="Hapus dari daftar simpan"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-purple-500/20 text-center">
              <button
                type="button"
                onClick={() => setIsBookmarkModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#140A28] border border-purple-500/30 text-zinc-300 hover:text-white hover:border-purple-400 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
