import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, Globe, Star } from 'lucide-react';
import { TESTIMONIALS, SOCIALS } from '../constants';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const SocialSection: React.FC = () => {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-32">
      
      {/* Stats Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="liquid-glass rounded-[2.5rem] p-10 text-center hover:scale-[1.02] transition-transform duration-500">
           <div className="w-20 h-20 rounded-full bg-blue-500/10 mx-auto mb-6 flex items-center justify-center">
             <Activity className="w-10 h-10 text-blue-500" />
           </div>
           <h3 className="text-6xl font-black text-dynamic mb-2">2M+</h3>
           <p className="text-dynamic/50 font-bold uppercase tracking-widest text-sm">Files Processed</p>
        </div>
        
        <div className="liquid-glass rounded-[2.5rem] p-10 text-center hover:scale-[1.02] transition-transform duration-500">
           <div className="w-20 h-20 rounded-full bg-purple-500/10 mx-auto mb-6 flex items-center justify-center">
             <User className="w-10 h-10 text-purple-500" />
           </div>
           <h3 className="text-6xl font-black text-dynamic mb-2">850k</h3>
           <p className="text-dynamic/50 font-bold uppercase tracking-widest text-sm">Active Users</p>
        </div>
        
        <div className="liquid-glass rounded-[2.5rem] p-10 text-center hover:scale-[1.02] transition-transform duration-500">
           <div className="w-20 h-20 rounded-full bg-pink-500/10 mx-auto mb-6 flex items-center justify-center">
             <Globe className="w-10 h-10 text-pink-500" />
           </div>
           <h3 className="text-6xl font-black text-dynamic mb-2">140+</h3>
           <p className="text-dynamic/50 font-bold uppercase tracking-widest text-sm">Countries</p>
        </div>
      </motion.div>

      {/* Social Marquee */}
      <div className="relative overflow-hidden py-10 border-y border-white/5 dark:border-white/5 light:border-black/5">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
         <div className="flex space-x-24 animate-marquee whitespace-nowrap items-center">
            {[...SOCIALS, ...SOCIALS, ...SOCIALS].map((s, i) => (
              <span key={i} className={`text-5xl font-black tracking-tighter opacity-30 ${s.color} transition-opacity cursor-default`}>
                {s.name}
              </span>
            ))}
         </div>
      </div>

      {/* Testimonials */}
      <div>
        <h2 className="text-5xl font-black text-dynamic text-center mb-20 tracking-tighter">Loved by Creators.</h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div 
              key={i}
              variants={cardVariants}
              className="liquid-glass rounded-[2rem] p-8"
            >
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-xl text-dynamic font-medium mb-8 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                <div>
                  <p className="font-bold text-dynamic text-base">{t.name}</p>
                  <p className="text-dynamic/40 text-xs font-bold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
};