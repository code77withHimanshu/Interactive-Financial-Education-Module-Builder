import { describe, it, expect } from 'vitest';
import {
  exportModules,
  exportSingleModule,
  importModules,
} from '../utils/exportImport';
import type { Module } from '../types';

const sampleModule: Module = {
  id: 'test-mod-001',
  title: 'Test Module',
  description: 'A description',
  category: 'investing',
  difficulty: 'beginner',
  estimatedMinutes: 10,
  blocks: [
    {
      id: 'block-001',
      type: 'text',
      order: 0,
      content: { html: '<p>Hello</p>' },
    },
    {
      id: 'block-002',
      type: 'quiz',
      order: 1,
      content: {
        question: 'Test question?',
        options: [
          { id: 'o1', text: 'Option 1' },
          { id: 'o2', text: 'Option 2' },
        ],
        correctOptionId: 'o1',
        explanation: 'Because option 1.',
      },
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  published: false,
};

const secondModule: Module = {
  id: 'test-mod-002',
  title: 'Second Module',
  description: 'Another description',
  category: 'budgeting',
  difficulty: 'advanced',
  estimatedMinutes: 20,
  blocks: [],
  createdAt: '2024-01-02T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  published: true,
};

describe('Export / Import Roundtrip', () => {
  describe('exportModules', () => {
    it('produces valid JSON', () => {
      const json = exportModules([sampleModule]);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('includes version field', () => {
      const json = exportModules([sampleModule]);
      const parsed = JSON.parse(json);
      expect(parsed.version).toBe('1.0.0');
    });

    it('includes exportedAt field', () => {
      const json = exportModules([sampleModule]);
      const parsed = JSON.parse(json);
      expect(parsed.exportedAt).toBeTruthy();
      expect(new Date(parsed.exportedAt).getTime()).not.toBeNaN();
    });

    it('includes all modules', () => {
      const json = exportModules([sampleModule, secondModule]);
      const parsed = JSON.parse(json);
      expect(parsed.modules).toHaveLength(2);
    });

    it('preserves module fields correctly', () => {
      const json = exportModules([sampleModule]);
      const parsed = JSON.parse(json);
      const mod = parsed.modules[0];
      expect(mod.id).toBe('test-mod-001');
      expect(mod.title).toBe('Test Module');
      expect(mod.category).toBe('investing');
      expect(mod.difficulty).toBe('beginner');
      expect(mod.published).toBe(false);
    });

    it('preserves blocks', () => {
      const json = exportModules([sampleModule]);
      const parsed = JSON.parse(json);
      expect(parsed.modules[0].blocks).toHaveLength(2);
      expect(parsed.modules[0].blocks[0].type).toBe('text');
      expect(parsed.modules[0].blocks[1].type).toBe('quiz');
    });

    it('exports empty modules array', () => {
      const json = exportModules([]);
      const parsed = JSON.parse(json);
      expect(parsed.modules).toHaveLength(0);
    });
  });

  describe('exportSingleModule', () => {
    it('exports only the specified module', () => {
      const json = exportSingleModule(sampleModule);
      const parsed = JSON.parse(json);
      expect(parsed.modules).toHaveLength(1);
      expect(parsed.modules[0].id).toBe('test-mod-001');
    });
  });

  describe('importModules', () => {
    it('successfully imports exported modules', () => {
      const json = exportModules([sampleModule]);
      const result = importModules(json);
      expect(result.success).toBe(true);
      expect(result.modules).toHaveLength(1);
    });

    it('preserves all module data on import', () => {
      const json = exportModules([sampleModule]);
      const result = importModules(json);
      expect(result.success).toBe(true);
      const imported = result.modules![0];
      expect(imported.id).toBe(sampleModule.id);
      expect(imported.title).toBe(sampleModule.title);
      expect(imported.description).toBe(sampleModule.description);
      expect(imported.category).toBe(sampleModule.category);
      expect(imported.difficulty).toBe(sampleModule.difficulty);
      expect(imported.estimatedMinutes).toBe(sampleModule.estimatedMinutes);
      expect(imported.published).toBe(sampleModule.published);
    });

    it('preserves block data on import', () => {
      const json = exportModules([sampleModule]);
      const result = importModules(json);
      expect(result.success).toBe(true);
      const blocks = result.modules![0].blocks;
      expect(blocks).toHaveLength(2);
      expect(blocks[0].type).toBe('text');
      expect(blocks[1].type).toBe('quiz');
    });

    it('imports multiple modules', () => {
      const json = exportModules([sampleModule, secondModule]);
      const result = importModules(json);
      expect(result.success).toBe(true);
      expect(result.modules).toHaveLength(2);
    });

    it('fails on invalid JSON', () => {
      const result = importModules('not json {{{');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('fails on missing required module fields', () => {
      const json = JSON.stringify({
        modules: [{ id: 'x', title: 'Missing fields' }],
      });
      const result = importModules(json);
      expect(result.success).toBe(false);
    });

    it('fails on invalid category', () => {
      const json = JSON.stringify({
        modules: [{ ...sampleModule, category: 'invalid-category' }],
      });
      const result = importModules(json);
      expect(result.success).toBe(false);
    });

    it('fails on invalid difficulty', () => {
      const json = JSON.stringify({
        modules: [{ ...sampleModule, difficulty: 'expert' }],
      });
      const result = importModules(json);
      expect(result.success).toBe(false);
    });

    it('fails on invalid block type', () => {
      const json = JSON.stringify({
        modules: [
          {
            ...sampleModule,
            blocks: [{ id: 'b1', type: 'invalid', order: 0, content: {} }],
          },
        ],
      });
      const result = importModules(json);
      expect(result.success).toBe(false);
    });

    it('accepts array of modules directly', () => {
      const json = JSON.stringify([sampleModule]);
      const result = importModules(json);
      expect(result.success).toBe(true);
      expect(result.modules).toHaveLength(1);
    });

    it('accepts single module object directly', () => {
      const json = JSON.stringify(sampleModule);
      const result = importModules(json);
      expect(result.success).toBe(true);
      expect(result.modules).toHaveLength(1);
    });
  });

  describe('Full roundtrip', () => {
    it('exports then imports without data loss', () => {
      const exported = exportModules([sampleModule, secondModule]);
      const result = importModules(exported);

      expect(result.success).toBe(true);
      expect(result.modules).toHaveLength(2);

      const m1 = result.modules!.find((m) => m.id === sampleModule.id);
      const m2 = result.modules!.find((m) => m.id === secondModule.id);

      expect(m1).toBeTruthy();
      expect(m2).toBeTruthy();
      expect(m1!.title).toBe(sampleModule.title);
      expect(m2!.title).toBe(secondModule.title);
      expect(m1!.blocks).toHaveLength(2);
      expect(m2!.blocks).toHaveLength(0);
    });
  });
});
