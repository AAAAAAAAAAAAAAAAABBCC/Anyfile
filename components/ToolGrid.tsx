import React, { useRef, useEffect, useMemo, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, Variants, useScroll } from 'framer-motion';
import { TOOLS } from '../constants';
import { ToolConfig, ToolId } from '../types';
import * as Icons from 'lucide-react';
import { playClickSound } from '../utils/sounds';

interface Props {
  onSelectTool: (tool: ToolConfig) => void;
  searchQuery: string;
}

const CATEGORIES = [
  {
    id: 'essentials',
    title: 'Core Essence',
    description: "Fundamental manipulation of digital documents. We don't just process files; we restructure their very DNA.",
    privacy: "Processed locally on your device via WebAssembly. Zero latency. Zero data egress.",
    highlight: "Merge up to 100 files instantly.",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-700 dark:text-blue-200", // Darker for light mode, light for dark mode
    tools: [ToolId.MERGE, ToolId.SPLIT, ToolId.COMPRESS]
  },
  {
    id: 'converters',
    title: 'Alchemy & Transform',
    description: "Transmute static documents into editable formats and back again. The ultimate fluidity between Word, Excel, PowerPoint, and PDF.",
    privacy: "High-fidelity conversion engines ensure formatting remains intact while respecting your privacy.",
    highlight: "Support for Office 365 formats.",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-700 dark:text-purple-200",
    tools: [
      ToolId.PDF_TO_JPG, ToolId.JPG_TO_PDF, 
      ToolId.WORD_TO_PDF, ToolId.PDF_TO_WORD,
      ToolId.PDF_TO_PPT, ToolId.PPT_TO_PDF, 
      ToolId.EXCEL_TO_PDF
    ]
  },
  {
    id: 'management',
    title: 'Total Dominion',
    description: "Exert absolute control over your information. Redact, reorder, secure, and watermark with military-grade precision.",
    privacy: "Client-side encryption available. Your secrets die with your session.",
    highlight: "Watermark stamping in < 50ms.",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-700 dark:text-orange-200",
    tools: [
      ToolId.EXTRACT_TEXT, ToolId.REMOVE_PAGES, 
      ToolId.REORDER_PAGES, ToolId.WATERMARK, 
      ToolId.PROTECT
    ]
  }
];

// Revised variants for Depth Effect
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(0px)" },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    zIndex: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, type: "spring", bounce: 0.2 }
  },
  // High Speed Race Up & Pickup
  pickup: {
    scale: 1.15,
    y: -30,
    zIndex: 50, // Significant z-index to float above dimmed items
    opacity: 1,
    filter: "blur(0px)",
    boxShadow: "0 30px 60px -10px rgba(0, 0, 0, 0.6)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  // Dimmed state for non-matches
  dimmed: {
    scale: 0.95,
    opacity: 0.1, // Strong fade
    filter: "blur(4px)", // Blur for depth of field
    y: 0,
    zIndex: 0,
    transition: { duration: 0.3 }
  }
};

const BentoCard = memo(({ 
  tool, 
  onSelect, 
  searchQuery, 
  isFiltering 
}: { 
  tool: ToolConfig, 
  onSelect: () => void, 
  searchQuery: string,
  isFiltering: boolean 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Reduced spring stiffness for tilt to be less aggressive during scroll
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]); // Subtle tilt
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0, 0.3]);

  // Determine state based on search
  const isMatch = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tool.title.toLowerCase().includes(q) || 
           tool.description.toLowerCase().includes(q);
  }, [searchQuery, tool.title, tool.description]);
  
  let animateState = "visible";
  if (isFiltering) {
    animateState = isMatch ? "pickup" : "dimmed";
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || (isFiltering && !isMatch)) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // @ts-ignore
  const IconComponent = Icons[tool.icon] || Icons.File;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      animate={animateState}
      // Updated Hover: Slight zoom (1.05), instant response, works well during scroll
      whileHover={isFiltering && !isMatch ? undefined : { 
        scale: 1.05, 
        y: -5,
        zIndex: 50,
        filter: "brightness(1.05)",
        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
        transition: { type: "spring", stiffness: 600, damping: 25, mass: 0.5 } 
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => { 
        if(isFiltering && !isMatch) return;
        playClickSound(); 
        onSelect(); 
      }}
      className={`
        relative w-full aspect-square perspective-1000 group 
        rounded-[2.2rem] 
        ${isFiltering && !isMatch ? 'cursor-default pointer-events-none' : 'cursor-pointer'}
      `}
    >
      <div className={`
        absolute inset-0 
        rounded-[2.2rem] overflow-hidden
        bg-gradient-to-br ${tool.gradient}
        ${!isFiltering && 'shadow-lg light:shadow-xl light:shadow-black/20'}
        transition-all duration-300 ease-out
        border border-white/20
      `}>
        <div className="absolute inset-0 colored-glass-overlay"></div>
        <motion.div 
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none z-10 mix-blend-soft-light"
        />
        <div className="relative z-20 h-full p-4 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <IconComponent className="w-5 h-5 md:w-7 md:h-7 text-white drop-shadow-md" />
            </div>
            <Icons.ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none mb-2 group-hover:translate-x-1 transition-transform drop-shadow-md">
              {tool.title}
            </h3>
            <p className="text-sm font-bold text-white/90 uppercase tracking-widest line-clamp-1 opacity-80">
              {tool.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const CategorySection = memo(({ 
  category, 
  tools, 
  onSelectTool, 
  searchQuery,
  isFiltering 
}: { 
  category: any, 
  tools: ToolConfig[], 
  onSelectTool: (t: ToolConfig) => void, 
  searchQuery: string,
  isFiltering: boolean 
}) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const mobileOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const mobileScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  
  const hasMatches = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tools.some(t => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q)
    );
  }, [tools, searchQuery]);

  if (isFiltering && !hasMatches) return null;

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row gap-8 lg:gap-24 relative group min-h-[50vh]">
      
      {/* Left Column */}
      <motion.div 
        className="lg:w-1/3 lg:space-y-8 lg:sticky lg:top-24 lg:self-start z-0"
      >
         <motion.div 
           className="lg:!opacity-100 lg:!scale-100 sticky top-24 lg:static"
           style={{ opacity: mobileOpacity, scale: mobileScale }}
         >
           <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${category.bgClass} ${category.textClass} backdrop-blur-md border border-black/5 dark:border-white/10 mb-4 shadow-sm`}>
             {category.id}
           </div>
           
           <h3 className="text-4xl md:text-6xl font-black text-dynamic tracking-tighter leading-[0.9] mb-4">
             {category.title}
           </h3>
           
           <div className="space-y-8">
             <p className="text-xl text-dynamic/80 font-medium leading-relaxed">
               {category.description}
             </p>

             <div className="hidden lg:block p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-lg">
                <h4 className="text-sm font-bold text-dynamic/50 uppercase tracking-wider mb-2">Privacy Promise</h4>
                <p className="text-dynamic/90 text-sm">{category.privacy}</p>
             </div>

             <div className="flex items-center gap-3 text-dynamic/60 text-sm font-mono">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               {category.highlight}
             </div>
           </div>
         </motion.div>
      </motion.div>

      {/* Right Column: The Grid */}
      <div className="lg:w-2/3 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
        >
          {tools.map((tool) => (
            <BentoCard 
                key={tool.id} 
                tool={tool} 
                onSelect={() => onSelectTool(tool)} 
                searchQuery={searchQuery}
                isFiltering={isFiltering}
            />
          ))}
        </motion.div>
      </div>

    </div>
  );
});

export const ToolGrid: React.FC<Props> = ({ onSelectTool, searchQuery }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  const isFiltering = searchQuery.length > 0;

  // Race up effect: Scroll to grid when search starts
  useEffect(() => {
    if (isFiltering && gridRef.current) {
        // Smooth race scroll
        const yOffset = -100; // Offset for navbar
        const element = gridRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isFiltering]);

  const noMatches = useMemo(() => {
    if (!isFiltering) return false;
    const q = searchQuery.toLowerCase();
    return TOOLS.every(t => !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q));
  }, [isFiltering, searchQuery]);

  return (
    <section className="py-20 px-4 md:px-6 max-w-[1600px] mx-auto min-h-[60vh] relative z-10" id="tools" ref={gridRef}>
      
      {!isFiltering && (
        <div className="flex flex-col items-center mb-16 md:mb-32 text-center">
            <h2 className="text-4xl md:text-7xl font-black text-dynamic tracking-tighter mb-6 drop-shadow-xl">
            The Suite.
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      )}

      <div className="space-y-24 md:space-y-40">
        {CATEGORIES.map((category) => {
          // We pass all tools in the category, filtering happens visually via dimming
          const categoryTools = TOOLS.filter(t => category.tools.includes(t.id));

          return (
            <CategorySection 
              key={category.id} 
              category={category} 
              tools={categoryTools} 
              onSelectTool={onSelectTool} 
              searchQuery={searchQuery}
              isFiltering={isFiltering}
            />
          );
        })}
      </div>
      
      {/* If all categories are hidden (no matches found globally) */}
      {noMatches && (
         <div className="text-center py-20 opacity-50 text-dynamic text-xl font-mono">
           No tools found matching "{searchQuery}"
         </div>
      )}
    </section>
  );
};