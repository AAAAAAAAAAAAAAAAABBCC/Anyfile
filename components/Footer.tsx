import React from 'react';
import { Zap, Github, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black text-white pt-24 pb-12 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start relative z-10">
        <div className="mb-12 md:mb-0">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="text-white w-4 h-4 fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">ANYFILE</span>
          </div>
          <p className="text-neutral-400 max-w-xs text-sm leading-relaxed">
            Crafted for those who demand perfection in every pixel and byte. The ultimate flow state tool.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-16 font-medium text-sm">
          <div className="flex flex-col space-y-4">
            <span className="text-white/40 font-bold uppercase tracking-widest text-xs mb-2">Platform</span>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">All Tools</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Developer API</a>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="text-white/40 font-bold uppercase tracking-widest text-xs mb-2">Legal</span>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span>© 2024 AnyFile Inc.</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in the Cloud</span>
        </div>
        <div className="flex space-x-8 mt-4 md:mt-0 font-medium">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
        </div>
      </div>
    </footer>
  );
};