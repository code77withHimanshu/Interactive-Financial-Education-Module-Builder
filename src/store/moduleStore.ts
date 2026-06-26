import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Module,
  Block,
  BlockType,
  BlockContent,
  TextContent,
  QuizContent,
  VideoContent,
  CalculatorContent,
  InfoCardContent,
  ModuleStore,
} from '../types';
import { importModules, exportModules, exportSingleModule } from '../utils/exportImport';

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function createDefaultContent(type: BlockType): BlockContent {
  switch (type) {
    case 'text':
      return { html: '<p>Enter your content here...</p>' } as TextContent;
    case 'quiz':
      return {
        question: 'What is your question?',
        options: [
          { id: generateId(), text: 'Option A' },
          { id: generateId(), text: 'Option B' },
          { id: generateId(), text: 'Option C' },
          { id: generateId(), text: 'Option D' },
        ],
        correctOptionId: '',
        explanation: 'Explain why this answer is correct.',
      } as QuizContent;
    case 'video':
      return {
        url: '',
        title: 'Video Title',
        description: 'Describe what viewers will learn.',
      } as VideoContent;
    case 'calculator':
      return {
        principal: 1000,
        rate: 7,
        years: 10,
        compoundingFrequency: 1,
      } as CalculatorContent;
    case 'infoCard':
      return {
        variant: 'info',
        icon: 'info',
        title: 'Did You Know?',
        body: 'Enter your informational content here.',
      } as InfoCardContent;
  }
}

const SAMPLE_MODULES: Module[] = [
  {
    id: generateId(),
    title: 'Introduction to Compound Interest',
    description: 'Learn how compound interest works and why it is the cornerstone of wealth building.',
    category: 'investing',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    blocks: [
      {
        id: generateId(),
        type: 'text',
        order: 0,
        content: {
          html: '<h2>What is Compound Interest?</h2><p>Compound interest is the interest on a loan or deposit that is calculated based on both the initial principal and the accumulated interest from previous periods.</p><p><strong>Albert Einstein</strong> reportedly called compound interest the "eighth wonder of the world."</p>',
        } as TextContent,
      },
      {
        id: generateId(),
        type: 'calculator',
        order: 1,
        content: {
          principal: 5000,
          rate: 8,
          years: 20,
          compoundingFrequency: 1,
        } as CalculatorContent,
      },
      {
        id: generateId(),
        type: 'quiz',
        order: 2,
        content: {
          question: 'If you invest $1,000 at 10% annual compound interest for 3 years, what is the approximate final amount?',
          options: [
            { id: 'a', text: '$1,300' },
            { id: 'b', text: '$1,331' },
            { id: 'c', text: '$1,100' },
            { id: 'd', text: '$1,210' },
          ],
          correctOptionId: 'b',
          explanation: 'After 3 years: $1,000 × (1.10)³ = $1,000 × 1.331 = $1,331. This demonstrates exponential growth over time.',
        } as QuizContent,
      },
    ],
    createdAt: now(),
    updatedAt: now(),
    published: true,
  },
  {
    id: generateId(),
    title: 'Budgeting Basics: The 50/30/20 Rule',
    description: 'Master the popular 50/30/20 budgeting framework to take control of your finances.',
    category: 'budgeting',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    blocks: [
      {
        id: generateId(),
        type: 'infoCard',
        order: 0,
        content: {
          variant: 'tip',
          icon: 'lightbulb',
          title: 'The Golden Rule of Budgeting',
          body: 'Spend less than you earn. The 50/30/20 rule gives you a simple framework to make this happen automatically.',
        } as InfoCardContent,
      },
      {
        id: generateId(),
        type: 'text',
        order: 1,
        content: {
          html: '<h2>The 50/30/20 Framework</h2><ul><li><strong>50% Needs:</strong> Housing, food, transportation, utilities</li><li><strong>30% Wants:</strong> Entertainment, dining out, hobbies</li><li><strong>20% Savings:</strong> Emergency fund, investments, debt repayment</li></ul>',
        } as TextContent,
      },
    ],
    createdAt: now(),
    updatedAt: now(),
    published: false,
  },
];

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      modules: SAMPLE_MODULES,
      activeModuleId: null,
      searchQuery: '',
      filterCategory: '',
      filterDifficulty: '',
      sidebarOpen: true,
      activeView: 'dashboard',

      createModule: () => {
        const id = generateId();
        const newModule: Module = {
          id,
          title: 'Untitled Module',
          description: '',
          category: 'budgeting',
          difficulty: 'beginner',
          estimatedMinutes: 5,
          blocks: [],
          createdAt: now(),
          updatedAt: now(),
          published: false,
        };
        set((state) => ({ modules: [...state.modules, newModule] }));
        return id;
      },

      updateModule: (id, updates) => {
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: now() } : m
          ),
        }));
      },

      deleteModule: (id) => {
        set((state) => ({
          modules: state.modules.filter((m) => m.id !== id),
          activeModuleId: state.activeModuleId === id ? null : state.activeModuleId,
          activeView: state.activeModuleId === id ? 'dashboard' : state.activeView,
        }));
      },

      duplicateModule: (id) => {
        const original = get().modules.find((m) => m.id === id);
        if (!original) return id;
        const newId = generateId();
        const duplicate: Module = {
          ...original,
          id: newId,
          title: `${original.title} (Copy)`,
          published: false,
          createdAt: now(),
          updatedAt: now(),
          blocks: original.blocks.map((b) => ({ ...b, id: generateId() })),
        };
        set((state) => ({ modules: [...state.modules, duplicate] }));
        return newId;
      },

      setActiveModule: (id) => {
        set({ activeModuleId: id });
      },

      setActiveView: (view) => {
        set({ activeView: view });
      },

      addBlock: (moduleId, type) => {
        const module = get().modules.find((m) => m.id === moduleId);
        if (!module) return;
        const newBlock: Block = {
          id: generateId(),
          type,
          order: module.blocks.length,
          content: createDefaultContent(type),
        };
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? { ...m, blocks: [...m.blocks, newBlock], updatedAt: now() }
              : m
          ),
        }));
      },

      updateBlock: (moduleId, blockId, content) => {
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  updatedAt: now(),
                  blocks: m.blocks.map((b) =>
                    b.id === blockId ? { ...b, content } : b
                  ),
                }
              : m
          ),
        }));
      },

      deleteBlock: (moduleId, blockId) => {
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  updatedAt: now(),
                  blocks: m.blocks
                    .filter((b) => b.id !== blockId)
                    .map((b, idx) => ({ ...b, order: idx })),
                }
              : m
          ),
        }));
      },

      reorderBlocks: (moduleId, activeId, overId) => {
        set((state) => {
          const module = state.modules.find((m) => m.id === moduleId);
          if (!module) return state;
          const blocks = [...module.blocks];
          const activeIdx = blocks.findIndex((b) => b.id === activeId);
          const overIdx = blocks.findIndex((b) => b.id === overId);
          if (activeIdx === -1 || overIdx === -1) return state;
          const [removed] = blocks.splice(activeIdx, 1);
          blocks.splice(overIdx, 0, removed);
          const reordered = blocks.map((b, idx) => ({ ...b, order: idx }));
          return {
            modules: state.modules.map((m) =>
              m.id === moduleId ? { ...m, blocks: reordered, updatedAt: now() } : m
            ),
          };
        });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setFilterDifficulty: (difficulty) => set({ filterDifficulty: difficulty }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      exportJSON: (moduleId) => {
        const { modules } = get();
        if (moduleId) {
          const module = modules.find((m) => m.id === moduleId);
          if (!module) return '{}';
          return exportSingleModule(module);
        }
        return exportModules(modules);
      },

      importJSON: (json) => {
        const result = importModules(json);
        if (!result.success || !result.modules) {
          return { success: false, error: result.error };
        }
        const imported = result.modules;
        set((state) => {
          const existingIds = new Set(state.modules.map((m) => m.id));
          const toAdd = imported.map((m) =>
            existingIds.has(m.id) ? { ...m, id: generateId(), title: `${m.title} (Imported)` } : m
          );
          return { modules: [...state.modules, ...toAdd] };
        });
        return { success: true };
      },
    }),
    {
      name: 'fined-module-store',
      version: 1,
    }
  )
);
