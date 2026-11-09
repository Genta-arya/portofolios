import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  UploadCloud,
  Globe,
  X,
  Check,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  // Modal States
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'url'>('upload');
  const [isModalUploading, setIsModalUploading] = useState(false);
  const [modalUploadError, setModalUploadError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);

  // Link Modal States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Direct Drag-and-Drop / Paste state on Editor
  const [isDirectUploading, setIsDirectUploading] = useState(false);
  const [directFileName, setDirectFileName] = useState('');

  // Direct upload handler ref to prevent stale closures
  const directUploadRef = useRef<(file: File) => Promise<void>>(async () => {});

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl border border-purple-500/20 shadow-xl my-4 max-w-full mx-auto block',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline underline-offset-4 hover:text-purple-300 font-medium',
        },
      }),
    ],
    content: content || '<p>Tuliskan artikel atau dokumentasi teknis Anda di sini...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] p-5 text-sm text-zinc-200 focus:outline-none prose prose-invert prose-purple max-w-none space-y-3 [&_img]:rounded-2xl [&_img]:border [&_img]:border-purple-500/20 [&_img]:shadow-xl [&_img]:my-4 [&_img]:max-w-full',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            directUploadRef.current(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            directUploadRef.current(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Handle direct file upload (Paste / Drag-and-Drop into editor)
  const handleDirectUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsDirectUploading(true);
    setDirectFileName(file.name || 'Screenshot');

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'gentha-portfolio/blog/content');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.success && data.secure_url) {
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({
              src: data.secure_url,
              alt: file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Gambar Konten',
            })
            .run();
        }
      } else {
        alert(data.error || 'Gagal mengunggah gambar ke Cloudinary');
      }
    } catch {
      alert('Koneksi upload error saat mengunggah gambar.');
    } finally {
      setIsDirectUploading(false);
      setDirectFileName('');
    }
  };

  useEffect(() => {
    directUploadRef.current = handleDirectUpload;
  });

  // ESC key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isImageModalOpen) handleCloseImageModal();
        if (isLinkModalOpen) setIsLinkModalOpen(false);
      }
    };
    if (isImageModalOpen || isLinkModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageModalOpen, isLinkModalOpen]);

  if (!editor) return null;

  // Open Image Modal
  const handleOpenImageModal = () => {
    setActiveImageTab('upload');
    setImageUrl('');
    setImagePreview('');
    setAltText('');
    setCaption('');
    setModalUploadError('');
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setIsModalUploading(false);
    setModalUploadError('');
  };

  // Upload file inside modal
  const handleModalFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setModalUploadError('File harus berupa format gambar (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    setIsModalUploading(true);
    setModalUploadError('');

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'gentha-portfolio/blog/content');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.success && data.secure_url) {
        setImageUrl(data.secure_url);
        setImagePreview(data.secure_url);
        if (!altText && file.name) {
          setAltText(file.name.replace(/\.[^/.]+$/, ''));
        }
      } else {
        setModalUploadError(data.error || 'Gagal mengunggah gambar ke Cloudinary.');
      }
    } catch {
      setModalUploadError('Terjadi kesalahan jaringan saat mengunggah file.');
    } finally {
      setIsModalUploading(false);
    }
  };

  // Insert image into TipTap from modal
  const handleInsertImage = () => {
    const finalUrl = imageUrl || imagePreview;
    if (!finalUrl) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: finalUrl,
        alt: altText || undefined,
        title: caption || undefined,
      })
      .run();

    handleCloseImageModal();
  };

  // Link Modal Handlers
  const handleOpenLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setIsLinkModalOpen(true);
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let finalLink = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalLink) && !finalLink.startsWith('/') && !finalLink.startsWith('#')) {
        finalLink = 'https://' + finalLink;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalLink }).run();
    }
    setIsLinkModalOpen(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsLinkModalOpen(false);
  };

  return (
    <div className="relative rounded-2xl bg-[#120B24] border border-purple-500/30 overflow-hidden shadow-inner">
      {/* Floating Notification for Direct Drag-and-Drop / Paste upload */}
      {isDirectUploading && (
        <div className="absolute top-16 right-4 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-purple-900/95 border border-purple-400 text-white text-xs shadow-2xl backdrop-blur-md animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
          <span className="font-medium">
            Mengunggah {directFileName || 'gambar'} ke Cloudinary...
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0D0818] border-b border-purple-500/20 text-zinc-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('bold') ? 'bg-purple-600 text-white font-bold' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('italic') ? 'bg-purple-600 text-white' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-purple-500/20 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 text-white' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-purple-500/20 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('bulletList') ? 'bg-purple-600 text-white' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('orderedList') ? 'bg-purple-600 text-white' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-purple-500/20 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('blockquote') ? 'bg-purple-600 text-white' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-purple-600 text-white' : ''
          }`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-purple-500/20 mx-1" />

        {/* Sisipkan Gambar Modern Button */}
        <button
          type="button"
          onClick={handleOpenImageModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 hover:text-white transition-all text-xs font-semibold"
          title="Sisipkan Gambar (Unggah File / URL)"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Gambar</span>
        </button>

        {/* Sisipkan Link Button */}
        <button
          type="button"
          onClick={handleOpenLinkModal}
          className={`p-1.5 rounded-lg hover:bg-purple-950/60 transition-colors ${
            editor.isActive('link') ? 'bg-purple-600 text-white' : 'text-purple-300'
          }`}
          title="Sisipkan Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-purple-500/20 mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded-lg hover:bg-purple-950/60 text-zinc-400 hover:text-white transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded-lg hover:bg-purple-950/60 text-zinc-400 hover:text-white transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Footer Helper Note */}
      <div className="px-4 py-2 bg-[#0D0818]/60 border-t border-purple-500/10 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>
            Bisa langsung <strong>Drag & Drop</strong> atau <strong>Paste (Ctrl+V)</strong> gambar langsung ke dalam editor.
          </span>
        </div>
        <span className="font-mono text-zinc-400">
          {editor.storage.characterCount?.words?.() ? `${editor.storage.characterCount.words()} kata` : ''}
        </span>
      </div>

      {/* MODAL SISIPKAN GAMBAR (MODERN CYBERPUNK UI) */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            key="image-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseImageModal}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              key="image-modal-card"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-[#0D0818] border border-purple-500/30 p-6 text-white shadow-2xl shadow-purple-950/70 space-y-5 cursor-default"
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sisipkan Gambar</h3>
                  <p className="text-xs text-zinc-400">
                    Unggah langsung ke Cloudinary atau gunakan tautan URL
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseImageModal}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-[#120B24] p-1 border border-purple-500/20">
              <button
                type="button"
                onClick={() => setActiveImageTab('upload')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeImageTab === 'upload'
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Unggah File (Cloudinary)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveImageTab('url')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeImageTab === 'url'
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Tautan URL</span>
              </button>
            </div>

            {/* TAB 1: File Upload */}
            {activeImageTab === 'upload' && (
              <div className="space-y-4">
                {!imagePreview ? (
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOverDropzone(true);
                    }}
                    onDragLeave={() => setIsDraggingOverDropzone(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOverDropzone(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleModalFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      isDraggingOverDropzone
                        ? 'border-purple-400 bg-purple-600/20 scale-[1.01]'
                        : 'border-purple-500/30 hover:border-purple-400/80 bg-[#120B24]/70 hover:bg-[#120B24]'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleModalFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      disabled={isModalUploading}
                    />

                    {isModalUploading ? (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                        <span className="text-xs text-purple-300 font-medium">
                          Mengunggah ke Cloudinary...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3.5 rounded-full bg-purple-600/20 text-purple-300 mb-3 border border-purple-500/30">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-semibold text-white">
                          Pilih file gambar atau seret &amp; lepas ke sini
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-1">
                          PNG, JPG, WebP, GIF, SVG (Maks. 10MB)
                        </span>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="rounded-2xl overflow-hidden border border-purple-500/30 bg-[#120B24] p-3 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-purple-500/20 shrink-0 flex items-center justify-center">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Gambar Berhasil Diunggah!</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono truncate">{imagePreview}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageUrl('');
                        }}
                        className="mt-2 text-[11px] text-rose-400 hover:text-rose-300 underline font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Ganti dengan gambar lain</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: URL Input */}
            {activeImageTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    URL Gambar Eksternal
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... atau https://res.cloudinary.com/..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                {imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-purple-500/20 bg-[#120B24] p-2.5 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40 shrink-0">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        onError={() => {}}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      Preview gambar dari URL
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {modalUploadError && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {modalUploadError}
              </div>
            )}

            {/* Metadata Fields (Alt Text & Caption) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-500/15">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Alt Text (SEO &amp; Aksesibilitas)
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi gambar..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/25 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Keterangan (Caption / Title)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gambar 1. Arsitektur sistem"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#120B24] border border-purple-500/25 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-purple-500/20">
              <button
                type="button"
                onClick={handleCloseImageModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={(!imageUrl && !imagePreview) || isModalUploading}
                onClick={handleInsertImage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Sisipkan Gambar</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* MODAL SISIPKAN LINK */}
      <AnimatePresence>
        {isLinkModalOpen && (
          <motion.div
            key="link-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsLinkModalOpen(false)}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              key="link-modal-card"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-[#0D0818] border border-purple-500/30 p-6 text-white shadow-2xl shadow-purple-950/70 space-y-4 cursor-default"
            >
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sisipkan Link Tautan</h3>
                  <p className="text-[11px] text-zinc-400">Masukkan tautan untuk teks yang dipilih</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                URL Link
              </label>
              <input
                type="url"
                autoFocus
                placeholder="https://example.com atau /blog/slug"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyLink();
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#120B24] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
              {editor.isActive('link') ? (
                <button
                  type="button"
                  onClick={handleRemoveLink}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Hapus Link
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-purple-600/30 hover:shadow-purple-500/50"
                >
                  Terapkan Link
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
