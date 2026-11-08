import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlingButton from '../reactbits/SlingButton';

export default function FloatingSling() {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {showFloating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="fixed bottom-6 right-6 z-50 drop-shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex flex-col items-center pointer-events-auto"
        >
          <SlingButton
            onLaunch={scrollToTop}
            label="Tarik & Lontarkan ke Atas"
            size={50}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
