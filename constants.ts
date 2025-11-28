import { ToolId, ToolConfig } from './types';

export const TOOLS: ToolConfig[] = [
  {
    id: ToolId.MERGE,
    title: 'Merge',
    description: 'Fuse documents.',
    icon: 'Combine',
    gradient: 'from-blue-400 to-indigo-500',
    isClientSide: true
  },
  {
    id: ToolId.SPLIT,
    title: 'Split',
    description: 'Divide pages.',
    icon: 'Scissors',
    gradient: 'from-orange-400 to-pink-500',
    isClientSide: true
  },
  {
    id: ToolId.COMPRESS,
    title: 'Compress',
    description: 'Shrink size.',
    icon: 'Minimize2',
    gradient: 'from-green-400 to-emerald-600',
    isClientSide: true
  },
  {
    id: ToolId.PDF_TO_JPG,
    title: 'To JPG',
    description: 'Convert pages.',
    icon: 'Image',
    gradient: 'from-purple-400 to-violet-600',
    isClientSide: true
  },
  {
    id: ToolId.JPG_TO_PDF,
    title: 'From JPG',
    description: 'Create PDF.',
    icon: 'FileImage',
    gradient: 'from-cyan-400 to-blue-600',
    isClientSide: true
  },
  {
    id: ToolId.WORD_TO_PDF,
    title: 'Word',
    description: 'DOCX to PDF.',
    icon: 'FileText',
    gradient: 'from-blue-500 to-blue-700',
    isClientSide: false
  },
  {
    id: ToolId.PDF_TO_WORD,
    title: 'To Word',
    description: 'Editable doc.',
    icon: 'FileType2',
    gradient: 'from-indigo-400 to-purple-500',
    isClientSide: false
  },
  {
    id: ToolId.PDF_TO_PPT,
    title: 'To Slide',
    description: 'Presentation.',
    icon: 'Presentation',
    gradient: 'from-orange-500 to-red-500',
    isClientSide: false
  },
  {
    id: ToolId.PPT_TO_PDF,
    title: 'From Slide',
    description: 'Make PDF.',
    icon: 'MonitorPlay',
    gradient: 'from-red-400 to-rose-600',
    isClientSide: false
  },
  {
    id: ToolId.EXCEL_TO_PDF,
    title: 'Excel',
    description: 'Sheets to PDF.',
    icon: 'Table',
    gradient: 'from-emerald-500 to-teal-600',
    isClientSide: false
  },
  {
    id: ToolId.EXTRACT_TEXT,
    title: 'Extract',
    description: 'Get text.',
    icon: 'AlignLeft',
    gradient: 'from-gray-400 to-slate-500',
    isClientSide: true
  },
  {
    id: ToolId.REMOVE_PAGES,
    title: 'Remove',
    description: 'Delete pages.',
    icon: 'Trash2',
    gradient: 'from-red-500 to-red-700',
    isClientSide: true
  },
  {
    id: ToolId.REORDER_PAGES,
    title: 'Reorder',
    description: 'Organize.',
    icon: 'ArrowLeftRight',
    gradient: 'from-yellow-400 to-orange-500',
    isClientSide: true
  },
  {
    id: ToolId.WATERMARK,
    title: 'Mark',
    description: 'Stamp it.',
    icon: 'Stamp',
    gradient: 'from-teal-400 to-cyan-500',
    isClientSide: true
  },
  {
    id: ToolId.PROTECT,
    title: 'Secure',
    description: 'Encrypt.',
    icon: 'Lock',
    gradient: 'from-slate-600 to-black',
    isClientSide: false
  }
];

// High-res, iOS/macOS style abstract wallpapers
export const WALLPAPERS = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop', // Dark mesh gradient
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Liquid oil
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop', // Colorful gradient
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop', // Neon abstract
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2574&auto=format&fit=crop', // Neon lights
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', // Purple liquid
];

export const TESTIMONIALS = [
  { name: "Sarah J.", role: "Creative Director", text: "The most beautiful tool I've ever used. It feels like magic." },
  { name: "David K.", role: "Architect", text: "Workflow speed increased by 300%. The design is purely inspirational." },
  { name: "Elena R.", role: "Student", text: "Finally, a PDF editor that doesn't look like Windows 95." }
];

export const SOCIALS = [
  { name: "TechCrunch", color: "text-green-400" },
  { name: "TheVerge", color: "text-white dark:text-white light:text-black" },
  { name: "ProductHunt", color: "text-orange-400" },
  { name: "Wired", color: "text-white dark:text-white light:text-black" }
];