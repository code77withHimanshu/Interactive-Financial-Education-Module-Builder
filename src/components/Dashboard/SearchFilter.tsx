import React from 'react';
import { Search, X } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import type { Category, Difficulty } from '../../types';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'budgeting', label: 'Budgeting' },
  { value: 'investing', label: 'Investing' },
  { value: 'debt', label: 'Debt' },
  { value: 'savings', label: 'Savings' },
  { value: 'taxes', label: 'Taxes' },
  { value: 'retirement', label: 'Retirement' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function SearchFilter() {
  const searchQuery = useModuleStore((s) => s.searchQuery);
  const filterCategory = useModuleStore((s) => s.filterCategory);
  const filterDifficulty = useModuleStore((s) => s.filterDifficulty);
  const setSearchQuery = useModuleStore((s) => s.setSearchQuery);
  const setFilterCategory = useModuleStore((s) => s.setFilterCategory);
  const setFilterDifficulty = useModuleStore((s) => s.setFilterDifficulty);

  const hasFilters = searchQuery || filterCategory || filterDifficulty;

  const clearAll = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterDifficulty('');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3" role="search">
      {/* Search input */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search modules..."
          aria-label="Search modules"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 bg-white
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:border-blue-800
            placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        aria-label="Filter by category"
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800
          text-slate-700 min-w-[140px]"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      {/* Difficulty filter */}
      <select
        value={filterDifficulty}
        onChange={(e) => setFilterDifficulty(e.target.value)}
        aria-label="Filter by difficulty"
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800
          text-slate-700 min-w-[140px]"
      >
        <option value="">All Levels</option>
        {DIFFICULTIES.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900
            hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          aria-label="Clear all filters"
        >
          <X size={14} aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
}
