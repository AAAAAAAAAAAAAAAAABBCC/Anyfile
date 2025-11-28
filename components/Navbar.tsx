import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound } from '../utils/sounds';

interface Props {
  onSearch: (query: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<Props> = ({ onSearch, isDark, toggleTheme }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside detection to retract search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isSearchOpen && searchQuery === '') {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    onSearch(q);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
    >
      <div className="flex gap-3 items-center pointer-events-auto">
        {/* Compact Centered Pill Container */}
        <motion.div 
          layout
          ref={containerRef}
          className="bg-white/[0.01] backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full px-2 py-1.5 flex items-center gap-0 relative z-50 shadow-2xl w-auto min-w-[260px]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          
          {/* Logo Area - Always visible icon to anchor layout */}
          <Link 
            to="/" 
            className="flex items-center gap-3 px-2 group shrink-0 mr-1"
            onClick={playClickSound}
          >
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              {/* Pulsing Glow Background */}
              <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
              />
              
              {/* Icon Container */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg relative z-10 overflow-hidden">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-3.5 h-3.5 text-white stroke-2 fill-none stroke-current"
                >
                  <motion.path 
                    d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
                <div className="absolute inset-0 bg-white/20 animate-glass-shine"></div>
              </div>
            </div>
            
            {/* Text - Animates out smoothly when search opens */}
            <motion.div
               animate={{ 
                  width: isSearchOpen ? 0 : 'auto', 
                  opacity: isSearchOpen ? 0 : 1 
               }}
               className="overflow-hidden hidden sm:block"
            >
                <span className="text-base font-black tracking-tight text-dynamic font-display whitespace-nowrap block">AnyFile</span>
            </motion.div>
          </Link>

          {/* Separator - Animates out smoothly */}
          <motion.div 
             animate={{ 
                width: isSearchOpen ? 0 : '1px', 
                opacity: isSearchOpen ? 0 : 1,
                marginRight: isSearchOpen ? 0 : '12px'
             }}
             className="h-5 bg-dynamic/10"
          ></motion.div>

          {/* Search Bar - Retracts to small button */}
          <div className="flex items-center justify-end relative flex-1">
            <motion.div 
              layout
              initial={false}
              animate={{ width: isSearchOpen ? '220px' : '36px' }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`flex items-center rounded-full relative group h-10`}
            >
                {/* GEMINI MOVING BORDER GLOW */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-[-2px] rounded-full overflow-hidden z-0"
                    >
                      <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_90deg,transparent_180deg,#8b5cf6_270deg,transparent_360deg)] animate-spin-slow opacity-80 blur-[2px]"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Inner Container */}
                <div className={`relative z-10 w-full h-full flex items-center bg-surface/80 backdrop-blur-md rounded-full border border-dynamic/5 overflow-hidden ${isSearchOpen ? 'bg-black/80 dark:bg-black/80 light:bg-white/90' : 'bg-transparent border-transparent'}`}>
                  
                  {/* Text Vanishing Animation */}
                  <AnimatePresence mode="popLayout">
                    {isSearchOpen && (
                      <motion.input
                        ref={searchInputRef}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                        transition={{ delay: 0.1 }}
                        type="text"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-1 bg-transparent border-none outline-none text-white dark:text-white light:text-black placeholder:text-gray-400 h-full text-sm font-medium pl-4 pr-10 min-w-0"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Search Icon / Toggle Button - Pinned Right */}
                  <button 
                    onClick={() => { setIsSearchOpen(!isSearchOpen); playClickSound(); }}
                    className={`w-10 h-10 rounded-full text-dynamic shrink-0 flex items-center justify-center hover:bg-dynamic/5 transition-colors absolute right-0 top-0 z-20 h-full`}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Theme Toggle Button - Ultra Transparent (1%) - MATCHED HEIGHT h-10 */}
        <motion.button
          onClick={() => { toggleTheme(); playClickSound(); }}
          className="bg-white/[0.01] backdrop-blur-xl border border-white/10 dark:border-white/5 w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden group shrink-0"
          whileTap={{ scale: 0.9 }}
        >
           <AnimatePresence mode="wait">
             <motion.div
               key={isDark ? 'dark' : 'light'}
               initial={{ rotate: -90, scale: 0 }}
               animate={{ rotate: 0, scale: 1 }}
               exit={{ rotate: 90, scale: 0 }}
               transition={{ duration: 0.2 }}
             >
               {isDark ? (
                 <Moon className="w-4 h-4 text-purple-400 fill-purple-400/20" />
               ) : (
                 <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
               )}
             </motion.div>
           </AnimatePresence>
        </motion.button>
      </div>
    </motion.nav>
  );
};