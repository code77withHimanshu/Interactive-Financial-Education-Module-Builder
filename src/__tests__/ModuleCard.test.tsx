import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { ModuleCard } from '../components/Dashboard/ModuleCard';
import { useModuleStore } from '../store/moduleStore';
import type { Module } from '../types';

const mockModule: Module = {
  id: 'mod-001',
  title: 'Test Module',
  description: 'A test module description',
  category: 'investing',
  difficulty: 'beginner',
  estimatedMinutes: 10,
  blocks: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  published: true,
};

function resetStore() {
  useModuleStore.setState({
    modules: [mockModule],
    activeModuleId: null,
    searchQuery: '',
    filterCategory: '',
    filterDifficulty: '',
    sidebarOpen: true,
    activeView: 'dashboard',
  });
}

describe('ModuleCard', () => {
  beforeEach(() => {
    resetStore();
  });

  it('renders module title', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('Test Module')).toBeInTheDocument();
  });

  it('renders module description', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('A test module description')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('investing')).toBeInTheDocument();
  });

  it('renders difficulty badge', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('renders published badge for published module', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders draft badge for unpublished module', () => {
    const draftModule = { ...mockModule, published: false };
    useModuleStore.setState({ modules: [draftModule] });
    render(<ModuleCard module={draftModule} />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders estimated time', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('10 min')).toBeInTheDocument();
  });

  it('renders block count', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText('0 blocks')).toBeInTheDocument();
  });

  it('shows singular "block" for 1 block', () => {
    const module = {
      ...mockModule,
      blocks: [{ id: 'b1', type: 'text' as const, order: 0, content: { html: '' } }],
    };
    render(<ModuleCard module={module} />);
    expect(screen.getByText('1 block')).toBeInTheDocument();
  });

  it('navigates to editor on Edit click', () => {
    render(<ModuleCard module={mockModule} />);
    const editButton = screen.getByRole('button', { name: /edit test module/i });
    act(() => { fireEvent.click(editButton); });
    const { activeView, activeModuleId } = useModuleStore.getState();
    expect(activeView).toBe('editor');
    expect(activeModuleId).toBe('mod-001');
  });

  it('navigates to preview on Preview click', () => {
    render(<ModuleCard module={mockModule} />);
    const previewButton = screen.getByRole('button', { name: /preview test module/i });
    act(() => { fireEvent.click(previewButton); });
    const { activeView, activeModuleId } = useModuleStore.getState();
    expect(activeView).toBe('preview');
    expect(activeModuleId).toBe('mod-001');
  });

  it('opens more options menu on click', () => {
    render(<ModuleCard module={mockModule} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    act(() => { fireEvent.click(menuButton); });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /duplicate/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
  });

  it('duplicates module from menu', () => {
    render(<ModuleCard module={mockModule} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    act(() => { fireEvent.click(menuButton); });
    const duplicateBtn = screen.getByRole('menuitem', { name: /duplicate/i });
    act(() => { fireEvent.click(duplicateBtn); });
    expect(useModuleStore.getState().modules).toHaveLength(2);
  });

  it('requires confirmation for delete', () => {
    render(<ModuleCard module={mockModule} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    act(() => { fireEvent.click(menuButton); });
    const deleteBtn = screen.getByRole('menuitem', { name: /delete test module/i });
    act(() => { fireEvent.click(deleteBtn); });
    // First click should show confirmation
    expect(useModuleStore.getState().modules).toHaveLength(1); // Not deleted yet
  });

  it('has proper accessible article role', () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByRole('article', { name: /module: test module/i })).toBeInTheDocument();
  });
});
