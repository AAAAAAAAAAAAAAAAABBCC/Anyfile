import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export const unfold: Variants = {
  hidden: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  visible: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export const widthExpand: Variants = {
  collapsed: { width: 0, opacity: 0 },
  expanded: { width: 220, opacity: 1 }
};