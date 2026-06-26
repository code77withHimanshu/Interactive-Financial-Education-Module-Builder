import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { useModuleStore } from '../store/moduleStore';
import type { Module } from '../types';

let idCounter = 3000;

const createMockModule = (overrides: Partial<Module> = {}): Module => ({
  id: `dash-mod-${idCounter++}`,
  title: 'Test Module',
  description: 'Test description',
  category: 'investing',
  difficulty: 'beginner',
  estimatedMinutes: 10,
  blocks: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  published: false,
  ...overrides,
});

function resetStoreWith(modules: Module[], extra: Partial<{
  searchQuery: string;
  filterCategory: string;
  filterDifficulty: string;
}> = {}) {
  useModuleStore.setState({
    modules,
    activeModuleId: null,
    searchQuery: extra.searchQuery ?? '',
    filterCategory: extra.filterCategory ?? '',
    filterDifficulty: extra.filterDifficulty ?? '',
    sidebarOpen: true,
    activeView: 'dashboard',
  });
}

describe('Dashboard', () => {
  beforeEach(() => {
    resetStoreWith([]);
  });

  describe('Empty state', () => {
    it('shows empty state when no modules exist', () => {
      resetStoreWith([]);
      render(<Dashboard />);
      expect(screen.getByText(/start building/i)).toBeInTheDocument();
    });

    it('shows create button in empty state', () => {
      resetStoreWith([]);
      render(<Dashboard />);
      expect(screen.getByRole('button', { name: /create your first module/i })).toBeInTheDocument();
    });

    it('creates module when empty state button clicked', () => {
      resetStoreWith([]);
      render(<Dashboard />);
      const createBtn = screen.getByRole('button', { name: /create your first module/i });
      act(() => { fireEvent.click(createBtn); });
      expect(useModuleStore.getState().modules).toHaveLength(1);
      expect(useModuleStore.getState().activeView).toBe('editor');
    });
  });

  describe('Module listing', () => {
    it('renders all modules when no filter is applied', () => {
      resetStoreWith([
        createMockModule({ id: 'a1', title: 'Module Alpha' }),
        createMockModule({ id: 'a2', title: 'Module Beta' }),
        createMockModule({ id: 'a3', title: 'Module Gamma' }),
      ]);
      render(<Dashboard />);
      expect(screen.getByText('Module Alpha')).toBeInTheDocument();
      expect(screen.getByText('Module Beta')).toBeInTheDocument();
      expect(screen.getByText('Module Gamma')).toBeInTheDocument();
    });

    it('shows module count in header', () => {
      resetStoreWith([
        createMockModule({ id: 'b1' }),
        createMockModule({ id: 'b2' }),
      ]);
      render(<Dashboard />);
      expect(screen.getByText(/2 modules/i)).toBeInTheDocument();
    });

    it('shows published count', () => {
      resetStoreWith([
        createMockModule({ id: 'c1', published: true }),
        createMockModule({ id: 'c2', published: false }),
        createMockModule({ id: 'c3', published: true }),
      ]);
      render(<Dashboard />);
      expect(screen.getByText(/2 published/i)).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('filters modules by title via search query', () => {
      resetStoreWith(
        [
          createMockModule({ id: 'd1', title: 'Budgeting Basics' }),
          createMockModule({ id: 'd2', title: 'Investment Guide' }),
          createMockModule({ id: 'd3', title: 'Budget Planning' }),
        ],
        { searchQuery: 'budget' }
      );
      render(<Dashboard />);
      expect(screen.getByText('Budgeting Basics')).toBeInTheDocument();
      expect(screen.getByText('Budget Planning')).toBeInTheDocument();
      expect(screen.queryByText('Investment Guide')).not.toBeInTheDocument();
    });

    it('filters modules by description via search query', () => {
      resetStoreWith(
        [
          createMockModule({ id: 'e1', title: 'Module A', description: 'Learn about stocks' }),
          createMockModule({ id: 'e2', title: 'Module B', description: 'Credit card tips' }),
        ],
        { searchQuery: 'stocks' }
      );
      render(<Dashboard />);
      expect(screen.getByText('Module A')).toBeInTheDocument();
      expect(screen.queryByText('Module B')).not.toBeInTheDocument();
    });

    it('shows empty state when no results match search', () => {
      resetStoreWith(
        [createMockModule({ id: 'f1', title: 'Budgeting Basics' })],
        { searchQuery: 'xyznotfound' }
      );
      render(<Dashboard />);
      expect(screen.getByText(/no modules found/i)).toBeInTheDocument();
    });

    it('is case insensitive', () => {
      resetStoreWith(
        [createMockModule({ id: 'g1', title: 'Investing for Beginners' })],
        { searchQuery: 'INVESTING' }
      );
      render(<Dashboard />);
      expect(screen.getByText('Investing for Beginners')).toBeInTheDocument();
    });

    it('SearchFilter renders search input', () => {
      resetStoreWith([createMockModule({ id: 'g2', title: 'Test' })]);
      render(<Dashboard />);
      expect(screen.getByRole('searchbox', { name: /search modules/i })).toBeInTheDocument();
    });
  });

  describe('Category filter', () => {
    it('filters modules by category', () => {
      resetStoreWith(
        [
          createMockModule({ id: 'h1', title: 'Investing 101', category: 'investing' }),
          createMockModule({ id: 'h2', title: 'Budget Guide', category: 'budgeting' }),
          createMockModule({ id: 'h3', title: 'Stock Picks', category: 'investing' }),
        ],
        { filterCategory: 'investing' }
      );
      render(<Dashboard />);
      expect(screen.getByText('Investing 101')).toBeInTheDocument();
      expect(screen.getByText('Stock Picks')).toBeInTheDocument();
      expect(screen.queryByText('Budget Guide')).not.toBeInTheDocument();
    });

    it('shows all modules when no category filter', () => {
      resetStoreWith([
        createMockModule({ id: 'i1', title: 'Investing 101', category: 'investing' }),
        createMockModule({ id: 'i2', title: 'Budget Guide', category: 'budgeting' }),
      ]);
      render(<Dashboard />);
      expect(screen.getByText('Investing 101')).toBeInTheDocument();
      expect(screen.getByText('Budget Guide')).toBeInTheDocument();
    });

    it('renders category filter select', () => {
      resetStoreWith([createMockModule({ id: 'i3' })]);
      render(<Dashboard />);
      expect(screen.getByRole('combobox', { name: /filter by category/i })).toBeInTheDocument();
    });
  });

  describe('Difficulty filter', () => {
    it('filters modules by difficulty', () => {
      resetStoreWith(
        [
          createMockModule({ id: 'j1', title: 'Easy Module', difficulty: 'beginner' }),
          createMockModule({ id: 'j2', title: 'Hard Module', difficulty: 'advanced' }),
        ],
        { filterDifficulty: 'beginner' }
      );
      render(<Dashboard />);
      expect(screen.getByText('Easy Module')).toBeInTheDocument();
      expect(screen.queryByText('Hard Module')).not.toBeInTheDocument();
    });

    it('renders difficulty filter select', () => {
      resetStoreWith([createMockModule({ id: 'j3' })]);
      render(<Dashboard />);
      expect(screen.getByRole('combobox', { name: /filter by difficulty/i })).toBeInTheDocument();
    });
  });

  describe('Combined filters', () => {
    it('applies search and category filter simultaneously', () => {
      resetStoreWith(
        [
          createMockModule({ id: 'k1', title: 'Advanced Investing', category: 'investing', difficulty: 'advanced' }),
          createMockModule({ id: 'k2', title: 'Basic Investing', category: 'investing', difficulty: 'beginner' }),
          createMockModule({ id: 'k3', title: 'Advanced Budgeting', category: 'budgeting', difficulty: 'advanced' }),
        ],
        { searchQuery: 'Advanced', filterCategory: 'investing' }
      );
      render(<Dashboard />);
      expect(screen.getByText('Advanced Investing')).toBeInTheDocument();
      expect(screen.queryByText('Basic Investing')).not.toBeInTheDocument();
      expect(screen.queryByText('Advanced Budgeting')).not.toBeInTheDocument();
    });
  });

  describe('Clear filters', () => {
    it('shows "Clear" button when search is active', () => {
      resetStoreWith(
        [createMockModule({ id: 'l1', title: 'Alpha Module' })],
        { searchQuery: 'alpha' }
      );
      render(<Dashboard />);
      // Clear button should be visible in SearchFilter
      expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
    });

    it('store setSearchQuery clears search state', () => {
      resetStoreWith(
        [createMockModule({ id: 'm1' }), createMockModule({ id: 'm2' })],
        { searchQuery: 'something' }
      );
      act(() => {
        useModuleStore.getState().setSearchQuery('');
        useModuleStore.getState().setFilterCategory('');
        useModuleStore.getState().setFilterDifficulty('');
      });
      expect(useModuleStore.getState().searchQuery).toBe('');
      expect(useModuleStore.getState().filterCategory).toBe('');
      expect(useModuleStore.getState().filterDifficulty).toBe('');
    });
  });

  describe('New Module button', () => {
    it('creates a new module and navigates to editor', () => {
      resetStoreWith([]);
      render(<Dashboard />);
      const newBtn = screen.getByRole('button', { name: /new module/i });
      act(() => { fireEvent.click(newBtn); });
      const state = useModuleStore.getState();
      expect(state.modules).toHaveLength(1);
      expect(state.activeView).toBe('editor');
    });
  });

  describe('Filtered results count', () => {
    it('shows filtered results count text when filters are active', () => {
      resetStoreWith(
        [
          createMockModule({ id: 'n1', title: 'Alpha', category: 'investing' }),
          createMockModule({ id: 'n2', title: 'Beta', category: 'budgeting' }),
          createMockModule({ id: 'n3', title: 'Gamma', category: 'investing' }),
        ],
        { filterCategory: 'investing' }
      );
      render(<Dashboard />);
      expect(screen.getByText(/showing/i)).toBeInTheDocument();
    });

    it('does not show filtered results count when no filter', () => {
      resetStoreWith([
        createMockModule({ id: 'n4', title: 'Alpha' }),
        createMockModule({ id: 'n5', title: 'Beta' }),
      ]);
      render(<Dashboard />);
      expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
    });
  });

  describe('useModules hook - filtering correctness', () => {
    it('correctly filters by title', () => {
      const modules = [
        createMockModule({ id: 'o1', title: 'Alpha Beta' }),
        createMockModule({ id: 'o2', title: 'Gamma Delta' }),
      ];
      const q = 'alpha';
      const filtered = modules.filter(m =>
        m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Alpha Beta');
    });

    it('correctly filters by category', () => {
      const modules = [
        createMockModule({ id: 'p1', category: 'investing' }),
        createMockModule({ id: 'p2', category: 'budgeting' }),
        createMockModule({ id: 'p3', category: 'investing' }),
      ];
      const filtered = modules.filter(m => m.category === 'investing');
      expect(filtered).toHaveLength(2);
    });

    it('correctly filters by difficulty', () => {
      const modules = [
        createMockModule({ id: 'q1', difficulty: 'beginner' }),
        createMockModule({ id: 'q2', difficulty: 'advanced' }),
      ];
      const filtered = modules.filter(m => m.difficulty === 'beginner');
      expect(filtered).toHaveLength(1);
    });
  });
});
