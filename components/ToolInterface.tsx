import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File as FileIcon, Loader2, Download, X, CheckCircle2, ChevronLeft, ArrowRight } from 'lucide-react';
import { ToolConfig } from '../types';
import { 
  mergePDFs, imagesToPDF, splitPDF, addWatermark, 
  removePages, reorderPages, compressPDF, mockServerProcess 
} from '../services/pdfService';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/sounds';

interface Props {
  tool: ToolConfig;
  onBack: () => void;
}

export const ToolInterface: React.FC<Props> = ({ tool, onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  // Store x,y coordinates for the ripple origin
  const [ripples, setRipples] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setResultUrl(null);
      playClickSound();
    }
  };

  const createRipple = (clientX: number, clientY: number) => {
    if (!dropZoneRef.current) return;
    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const baseId = Date.now();
    // Create multiple waves for a rich effect
    const newRipples = [
        { id: baseId, x, y, color: 'shadow-blue-500/40' },
        { id: baseId + 1, x, y, color: 'shadow-purple-500/40' },
        { id: baseId + 2, x, y, color: 'shadow-pink-500/40' },
    ];
    
    setRipples(prev => [...prev, ...newRipples]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id < baseId));
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    createRipple(e.clientX, e.clientY);
    playClickSound();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        const isMultiple = tool.id === 'merge' || tool.id === 'jpg-to-pdf';

        if (isMultiple) {
            setFiles(droppedFiles);
        } else {
            setFiles([droppedFiles[0]]);
        }
        setResultUrl(null);
    }
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    createRipple(e.clientX, e.clientY);
    fileInputRef.current?.click();
  };

  const processTool = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    playClickSound();
    
    try {
      let resultData: Uint8Array | Blob;
      await new Promise(r => setTimeout(r, 1500)); // Cinematic delay

      switch (tool.id) {
        case 'merge':
          resultData = await mergePDFs(files);
          break;
        case 'jpg-to-pdf':
          resultData = await imagesToPDF(files);
          break;
        case 'split':
          const parts = await splitPDF(files[0]);
          resultData = parts[0]; 
          break;
        case 'watermark':
          resultData = await addWatermark(files[0], watermarkText);
          break;
        case 'remove-pages':
          resultData = await removePages(files[0]);
          break;
        case 'reorder-pages':
          resultData = await reorderPages(files[0]);
          break;
        case 'compress':
          resultData = await compressPDF(files[0]);
          break;
        default:
          resultData = await mockServerProcess(files[0], tool.id);
          break;
      }

      const blob = new Blob([resultData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      playSuccessSound();
      
    } catch (error) {
      console.error("Processing failed", error);
      playErrorSound();
      alert("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-0 md:p-8 bg-black/60 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.2 }}
        className="w-full max-w-5xl h-full md:h-[90vh] liquid-glass md:rounded-[3rem] relative flex flex-col overflow-hidden shadow-2xl light:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        {/* Header - Increased top padding on mobile to clear navbar/notch */}
        <div className="px-8 pt-24 pb-6 md:py-6 border-b border-white/10 dark:border-white/10 light:border-black/5 flex items-center justify-between">
          <button 
            onClick={() => { playClickSound(); onBack(); }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/5 dark:bg-white/10 light:bg-black/5 hover:bg-black/10 dark:hover:bg-white/20 text-dynamic transition-all group font-bold relative z-50"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tool.gradient}`}></div>
             <h2 className="text-xl font-bold text-dynamic tracking-tight">{tool.title}</h2>
          </div>
          
          <div className="w-20"></div> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto custom-scrollbar">
           <AnimatePresence mode="wait">
            {!resultUrl ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-2xl flex flex-col items-center"
              >
                {files.length === 0 ? (
                  <div 
                    ref={dropZoneRef}
                    onClick={handleZoneClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full aspect-video border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${
                        isDragging 
                        ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
                        : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 light:bg-gradient-to-br light:from-blue-50/50 light:to-purple-50/50 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Multicolored Liquid Ripples */}
                    {ripples.map((r, i) => (
                        <div 
                            key={r.id}
                            className="absolute rounded-full animate-ripple pointer-events-none z-0"
                            style={{ 
                                left: r.x,
                                top: r.y,
                                width: '20px', 
                                height: '20px',
                                // Stagger animation delays for wave effect
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '2s',
                                // Smooth box-shadow ripple instead of border
                                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                                boxShadow: i === 0 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 
                                           i === 1 ? '0 0 10px rgba(168, 85, 247, 0.5)' : 
                                                     '0 0 10px rgba(236, 72, 153, 0.5)',
                            }}
                        ></div>
                    ))}

                    <motion.div 
                      className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl relative z-10"
                      animate={{ 
                        y: [0, -8, 0],
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                          "0 35px 60px -12px rgba(0, 0, 0, 0.3)",
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        ]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Upload className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <p className="text-4xl font-black text-dynamic mb-3 tracking-tight relative z-10">Drop files.</p>
                    <p className="text-dynamic/60 text-xl font-medium relative z-10">or tap to browse</p>
                    
                    <input 
                      type="file" 
                      multiple={tool.id === 'merge' || tool.id === 'jpg-to-pdf'}
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFiles}
                      accept={tool.id.includes('jpg') ? 'image/*' : '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx'}
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="grid grid-cols-1 gap-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {files.map((f, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={i} 
                          className="bg-dynamic/5 p-6 rounded-2xl flex items-center justify-between border border-dynamic/5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-dynamic/10 rounded-xl">
                              <FileIcon className="w-6 h-6 text-dynamic" />
                            </div>
                            <div>
                              <p className="font-bold text-dynamic truncate max-w-[250px]">{f.name}</p>
                              <p className="text-sm text-dynamic/50">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => {
                            const newFiles = files.filter((_, idx) => idx !== i);
                            setFiles(newFiles);
                            playClickSound();
                          }} className="p-2 hover:bg-dynamic/10 rounded-full text-dynamic/60 hover:text-dynamic transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {tool.id === 'watermark' && (
                      <div className="mb-8">
                        <label className="text-sm font-bold uppercase text-dynamic/60 mb-3 block tracking-wider">Watermark Text</label>
                        <input 
                          type="text" 
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full bg-dynamic/5 border border-dynamic/10 rounded-2xl px-6 py-4 text-dynamic text-lg focus:bg-dynamic/10 focus:border-dynamic/30 outline-none transition-all placeholder:text-dynamic/20"
                          placeholder="Enter text..."
                        />
                      </div>
                    )}

                    <div className="flex gap-4 mt-8">
                      <button 
                        onClick={() => { setFiles([]); playClickSound(); }}
                        className="px-10 py-5 rounded-full font-bold text-dynamic/60 hover:bg-dynamic/5 transition-colors"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={processTool}
                        disabled={isProcessing}
                        className="flex-1 py-5 bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white rounded-full font-bold text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-xl"
                      >
                        {isProcessing ? <Loader2 className="animate-spin mr-2 w-6 h-6" /> : (
                           <>Start Processing <ArrowRight className="w-6 h-6 ml-2" /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-16 h-16 text-green-400" />
                </div>
                <h3 className="text-5xl font-black text-dynamic mb-4">Complete.</h3>
                <p className="text-dynamic/60 mb-12 text-xl">Your files are ready.</p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a 
                    href={resultUrl} 
                    download={`anyfile-export.pdf`}
                    onClick={playClickSound}
                    className="px-12 py-5 bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white rounded-full font-bold text-xl hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-6 h-6 mr-2" /> Download
                  </a>
                  <button 
                    onClick={() => { setFiles([]); setResultUrl(null); playClickSound(); }}
                    className="px-12 py-5 bg-dynamic/10 text-dynamic rounded-full font-bold text-xl hover:bg-dynamic/20 transition-colors border border-dynamic/10"
                  >
                    New Task
                  </button>
                </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};