import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useModuleStore } from '../store/moduleStore';

// Helper to get a fresh store state for each test
function getStore() {
  return useModuleStore.getState();
}

function resetStore() {
  // Only reset data fields, not actions (Zustand persist stores actions in state)
  useModuleStore.setState({
    modules: [],
    activeModuleId: null,
    searchQuery: '',
    filterCategory: '',
    filterDifficulty: '',
    sidebarOpen: true,
    activeView: 'dashboard',
  });
}

describe('Module Store', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('createModule', () => {
    it('creates a new module and returns its id', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
      });
      const { modules } = getStore();
      expect(modules).toHaveLength(1);
      expect(modules[0].id).toBe(id!);
      expect(modules[0].title).toBe('Untitled Module');
      expect(modules[0].published).toBe(false);
      expect(modules[0].blocks).toHaveLength(0);
    });

    it('creates multiple modules', () => {
      act(() => {
        getStore().createModule();
        getStore().createModule();
        getStore().createModule();
      });
      expect(getStore().modules).toHaveLength(3);
    });
  });

  describe('updateModule', () => {
    it('updates module title and description', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().updateModule(id!, { title: 'Updated Title', description: 'New desc' });
      });
      const module = getStore().modules.find((m) => m.id === id!);
      expect(module?.title).toBe('Updated Title');
      expect(module?.description).toBe('New desc');
    });

    it('updates module published status', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().updateModule(id!, { published: true });
      });
      const module = getStore().modules.find((m) => m.id === id!);
      expect(module?.published).toBe(true);
    });

    it('does not affect other modules', () => {
      let id1: string;
      let id2: string;
      act(() => { id1 = getStore().createModule(); });
      act(() => { id2 = getStore().createModule(); });
      act(() => { getStore().updateModule(id1!, { title: 'Module One' }); });
      const m2 = getStore().modules.find((m) => m.id === id2!);
      expect(m2?.title).toBe('Untitled Module');
    });
  });

  describe('deleteModule', () => {
    it('removes the module', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().deleteModule(id!);
      });
      expect(getStore().modules).toHaveLength(0);
    });

    it('resets activeModuleId if deleted module was active', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().setActiveModule(id!);
        getStore().deleteModule(id!);
      });
      expect(getStore().activeModuleId).toBeNull();
    });

    it('does not affect other modules', () => {
      let id1: string;
      let id2: string;
      act(() => { id1 = getStore().createModule(); });
      act(() => { id2 = getStore().createModule(); });
      act(() => { getStore().deleteModule(id1!); });
      const { modules } = getStore();
      expect(modules).toHaveLength(1);
      expect(modules[0].id).toBe(id2!);
    });
  });

  describe('duplicateModule', () => {
    it('creates a copy with different id', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().updateModule(id!, { title: 'Original' });
      });
      let newId: string;
      act(() => {
        newId = getStore().duplicateModule(id!);
      });
      const { modules } = getStore();
      expect(modules).toHaveLength(2);
      expect(newId!).not.toBe(id!);
      const copy = modules.find((m) => m.id === newId!);
      expect(copy?.title).toContain('Original');
      expect(copy?.published).toBe(false);
    });
  });

  describe('addBlock', () => {
    it('adds a text block to module', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().addBlock(id!, 'text');
      });
      const module = getStore().modules.find((m) => m.id === id!);
      expect(module?.blocks).toHaveLength(1);
      expect(module?.blocks[0].type).toBe('text');
      expect(module?.blocks[0].order).toBe(0);
    });

    it('adds blocks with incrementing order', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().addBlock(id!, 'text');
        getStore().addBlock(id!, 'quiz');
        getStore().addBlock(id!, 'video');
      });
      const module = getStore().modules.find((m) => m.id === id!);
      expect(module?.blocks).toHaveLength(3);
      expect(module?.blocks[2].type).toBe('video');
    });

    it('creates correct default content for quiz block', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().addBlock(id!, 'quiz');
      });
      const module = getStore().modules.find((m) => m.id === id!);
      const block = module?.blocks[0];
      expect(block?.type).toBe('quiz');
      const content = block?.content as import('../types').QuizContent;
      expect(content.options).toHaveLength(4);
      expect(content.question).toBeTruthy();
    });

    it('creates correct default content for calculator block', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().addBlock(id!, 'calculator');
      });
      const module = getStore().modules.find((m) => m.id === id!);
      const content = module?.blocks[0].content as import('../types').CalculatorContent;
      expect(content.principal).toBeGreaterThan(0);
      expect(content.rate).toBeGreaterThan(0);
    });
  });

  describe('updateBlock', () => {
    it('updates block content', () => {
      let moduleId: string, blockId: string;
      act(() => {
        moduleId = getStore().createModule();
        getStore().addBlock(moduleId!, 'text');
        blockId = getStore().modules.find((m) => m.id === moduleId!)!.blocks[0].id;
        getStore().updateBlock(moduleId!, blockId!, { html: '<p>Updated</p>' });
      });
      const module = getStore().modules.find((m) => m.id === moduleId!);
      const block = module?.blocks.find((b) => b.id === blockId!);
      const content = block?.content as import('../types').TextContent;
      expect(content.html).toBe('<p>Updated</p>');
    });
  });

  describe('deleteBlock', () => {
    it('removes the block', () => {
      let moduleId: string, blockId: string;
      act(() => {
        moduleId = getStore().createModule();
        getStore().addBlock(moduleId!, 'text');
        blockId = getStore().modules.find((m) => m.id === moduleId!)!.blocks[0].id;
        getStore().deleteBlock(moduleId!, blockId!);
      });
      const module = getStore().modules.find((m) => m.id === moduleId!);
      expect(module?.blocks).toHaveLength(0);
    });

    it('reorders remaining blocks', () => {
      let moduleId: string;
      act(() => { moduleId = getStore().createModule(); });
      act(() => {
        getStore().addBlock(moduleId!, 'text');
        getStore().addBlock(moduleId!, 'quiz');
        getStore().addBlock(moduleId!, 'video');
      });
      const firstBlockId = getStore().modules.find((m) => m.id === moduleId!)!.blocks[0].id;
      act(() => { getStore().deleteBlock(moduleId!, firstBlockId); });
      const module = getStore().modules.find((m) => m.id === moduleId!);
      expect(module?.blocks).toHaveLength(2);
      expect(module?.blocks[0].order).toBe(0);
      expect(module?.blocks[1].order).toBe(1);
    });
  });

  describe('reorderBlocks', () => {
    it('reorders blocks by swapping positions', () => {
      let moduleId: string, block1Id: string, block2Id: string;
      act(() => {
        moduleId = getStore().createModule();
        getStore().addBlock(moduleId!, 'text');
        getStore().addBlock(moduleId!, 'quiz');
        const blocks = getStore().modules.find((m) => m.id === moduleId!)!.blocks;
        block1Id = blocks[0].id;
        block2Id = blocks[1].id;
        getStore().reorderBlocks(moduleId!, block1Id!, block2Id!);
      });
      const module = getStore().modules.find((m) => m.id === moduleId!);
      const sorted = [...(module?.blocks ?? [])].sort((a, b) => a.order - b.order);
      expect(sorted[0].id).toBe(block2Id!);
      expect(sorted[1].id).toBe(block1Id!);
    });
  });

  describe('search and filter', () => {
    it('sets search query', () => {
      act(() => getStore().setSearchQuery('budgeting'));
      expect(getStore().searchQuery).toBe('budgeting');
    });

    it('sets filter category', () => {
      act(() => getStore().setFilterCategory('investing'));
      expect(getStore().filterCategory).toBe('investing');
    });

    it('sets filter difficulty', () => {
      act(() => getStore().setFilterDifficulty('advanced'));
      expect(getStore().filterDifficulty).toBe('advanced');
    });
  });

  describe('setActiveModule / setActiveView', () => {
    it('sets active module id', () => {
      let id: string;
      act(() => {
        id = getStore().createModule();
        getStore().setActiveModule(id!);
      });
      expect(getStore().activeModuleId).toBe(id!);
    });

    it('sets active view', () => {
      act(() => getStore().setActiveView('editor'));
      expect(getStore().activeView).toBe('editor');
    });
  });

  describe('exportJSON', () => {
    it('exports all modules as JSON', () => {
      act(() => {
        const id = getStore().createModule();
        getStore().updateModule(id, { title: 'Export Test' });
      });
      const json = getStore().exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.modules).toHaveLength(1);
      expect(parsed.modules[0].title).toBe('Export Test');
      expect(parsed.version).toBe('1.0.0');
    });

    it('exports single module when id provided', () => {
      let id1: string;
      let id2: string;
      act(() => { id1 = getStore().createModule(); });
      act(() => { id2 = getStore().createModule(); });
      act(() => {
        getStore().updateModule(id1!, { title: 'Module A' });
        getStore().updateModule(id2!, { title: 'Module B' });
      });
      const json = getStore().exportJSON(id1!);
      const parsed = JSON.parse(json);
      expect(parsed.modules).toHaveLength(1);
      expect(parsed.modules[0].title).toBe('Module A');
    });
  });

  describe('importJSON', () => {
    it('imports valid module JSON', () => {
      const module = {
        id: 'imported-id-001',
        title: 'Imported Module',
        description: 'Test import',
        category: 'investing',
        difficulty: 'beginner',
        estimatedMinutes: 5,
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: false,
      };
      const json = JSON.stringify({ version: '1.0.0', modules: [module] });
      let result: { success: boolean; error?: string };
      act(() => {
        result = getStore().importJSON(json);
      });
      expect(result!.success).toBe(true);
      expect(getStore().modules.some((m) => m.title === 'Imported Module')).toBe(true);
    });

    it('returns error for invalid JSON', () => {
      let result: { success: boolean; error?: string };
      act(() => {
        result = getStore().importJSON('not-valid-json{{{');
      });
      expect(result!.success).toBe(false);
      expect(result!.error).toBeTruthy();
    });

    it('returns error for invalid module structure', () => {
      let result: { success: boolean; error?: string };
      act(() => {
        result = getStore().importJSON(JSON.stringify({ modules: [{ invalid: true }] }));
      });
      expect(result!.success).toBe(false);
    });
  });
});
