import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { fadeInUp } from '../utils/animations';
import { playClickSound } from '../utils/sounds';

export const Hero: React.FC = () => {
  const containerRef = useRef(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setGreeting('Good Night');
    else if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative pt-48 pb-32 px-6 min-h-[95vh] flex flex-col items-center justify-center overflow-hidden perspective-1000">
      
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]) }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]) }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div style={{ y, opacity, scale }} className="max-w-6xl mx-auto text-center z-10 relative">
        
        <motion.div
           initial="hidden"
           animate="visible"
           variants={fadeInUp}
           className="inline-block px-6 py-2 mb-10 rounded-full liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <span className="text-sm font-bold text-dynamic tracking-widest uppercase opacity-80">{greeting}</span>
        </motion.div>

        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-7xl md:text-[10rem] font-black tracking-tighter mb-8 leading-[0.9] text-dynamic drop-shadow-2xl"
        >
          PURE <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">FLOW.</span>
        </motion.h1>

        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-2xl md:text-3xl text-dynamic/90 max-w-3xl mx-auto mb-16 font-medium leading-relaxed"
        >
          Intelligent document processing. <br className="hidden md:block"/>
          <span className="opacity-60">Engineered for the speed of thought.</span>
        </motion.p>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col md:flex-row gap-6 justify-center"
        >
          <button 
            onClick={() => {
              document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              playClickSound();
            }}
            className="px-10 py-5 bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">Start Editing <ArrowDown className="w-5 h-5" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};