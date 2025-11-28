import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WelcomeScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setTimeout(onComplete, 2200); // Faster duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }} // Snappier
        className="relative mb-8"
      >
        <div className="w-24 h-24 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-white stroke-[3] fill-none overflow-visible">
            <motion.path
              d="M20 30 L40 10 L80 10 L80 90 L20 90 Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <motion.path
              d="M30 30 L30 80 M45 30 L45 80 M60 30 L60 80"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }} // Faster
              className="stroke-white/30"
            />
          </svg>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" 
          />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 100 }}
        className="text-4xl md:text-6xl font-black text-white tracking-tighter"
      >
        {greeting}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-4 text-white/50 font-mono text-sm tracking-widest uppercase"
      >
        System Ready
      </motion.p>
    </motion.div>
  );
};