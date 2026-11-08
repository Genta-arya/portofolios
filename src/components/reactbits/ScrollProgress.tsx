import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 w-full max-w-full h-[3px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 origin-left z-[100] shadow-[0_0_12px_rgba(217,70,239,0.7)] pointer-events-none overflow-hidden"
    />
  );
}

