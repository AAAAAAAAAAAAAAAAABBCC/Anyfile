export enum ToolId {
  MERGE = 'merge',
  SPLIT = 'split',
  COMPRESS = 'compress',
  PDF_TO_JPG = 'pdf-to-jpg',
  JPG_TO_PDF = 'jpg-to-pdf',
  WORD_TO_PDF = 'word-to-pdf',
  PDF_TO_WORD = 'pdf-to-word',
  PDF_TO_PPT = 'pdf-to-ppt',
  PPT_TO_PDF = 'ppt-to-pdf',
  EXCEL_TO_PDF = 'excel-to-pdf',
  EXTRACT_TEXT = 'extract-text',
  REMOVE_PAGES = 'remove-pages',
  REORDER_PAGES = 'reorder-pages',
  WATERMARK = 'watermark',
  PROTECT = 'protect',
  UNLOCK = 'unlock'
}

export interface ToolConfig {
  id: ToolId;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  isClientSide: boolean;
}

export interface ProcessedFile {
  name: string;
  data: Uint8Array | Blob | string;
  mimeType: string;
}

export interface UserXP {
  currentXP: number;
  level: number;
  badges: string[];
}
