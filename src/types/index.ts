export type Category = 'budgeting' | 'investing' | 'debt' | 'savings' | 'taxes' | 'retirement';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type BlockType = 'text' | 'quiz' | 'video' | 'calculator' | 'infoCard';
export type InfoCardVariant = 'tip' | 'warning' | 'info';

export interface TextContent {
  html: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizContent {
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface VideoContent {
  url: string;
  title: string;
  description: string;
}

export interface CalculatorContent {
  principal: number;
  rate: number;
  years: number;
  compoundingFrequency: number;
}

export interface InfoCardContent {
  variant: InfoCardVariant;
  icon: string;
  title: string;
  body: string;
}

export type BlockContent =
  | TextContent
  | QuizContent
  | VideoContent
  | CalculatorContent
  | InfoCardContent;

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  content: BlockContent;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  estimatedMinutes: number;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface ModuleStore {
  modules: Module[];
  activeModuleId: string | null;
  searchQuery: string;
  filterCategory: string;
  filterDifficulty: string;
  sidebarOpen: boolean;
  activeView: 'dashboard' | 'editor' | 'preview';

  // Module actions
  createModule: () => string;
  updateModule: (id: string, updates: Partial<Omit<Module, 'id' | 'blocks' | 'createdAt'>>) => void;
  deleteModule: (id: string) => void;
  duplicateModule: (id: string) => string;
  setActiveModule: (id: string | null) => void;
  setActiveView: (view: 'dashboard' | 'editor' | 'preview') => void;

  // Block actions
  addBlock: (moduleId: string, type: BlockType) => void;
  updateBlock: (moduleId: string, blockId: string, content: BlockContent) => void;
  deleteBlock: (moduleId: string, blockId: string) => void;
  reorderBlocks: (moduleId: string, activeId: string, overId: string) => void;

  // Filter/search actions
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterDifficulty: (difficulty: string) => void;
  toggleSidebar: () => void;

  // Export/Import
  exportJSON: (moduleId?: string) => string;
  importJSON: (json: string) => { success: boolean; error?: string };
}
