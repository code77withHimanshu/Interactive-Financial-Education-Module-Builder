import React from 'react';
import type { Module, Category, Difficulty } from '../../types';
import { useModuleStore } from '../../store/moduleStore';

interface MetadataFormProps {
  module: Module;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'budgeting', label: 'Budgeting' },
  { value: 'investing', label: 'Investing' },
  { value: 'debt', label: 'Debt Management' },
  { value: 'savings', label: 'Savings' },
  { value: 'taxes', label: 'Taxes' },
  { value: 'retirement', label: 'Retirement' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function MetadataForm({ module }: MetadataFormProps) {
  const updateModule = useModuleStore((s) => s.updateModule);

  const handleChange = <K extends keyof Omit<Module, 'id' | 'blocks' | 'createdAt'>>(
    key: K,
    value: Module[K]
  ) => {
    updateModule(module.id, { [key]: value } as Partial<Omit<Module, 'id' | 'blocks' | 'createdAt'>>);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        Module Details
      </h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="module-title">
            Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="module-title"
            type="text"
            value={module.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Module title..."
            aria-required="true"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="module-description">
            Description
          </label>
          <textarea
            id="module-description"
            value={module.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            placeholder="Brief description of this module..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 resize-none"
          />
        </div>

        {/* Row: Category + Difficulty */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="module-category">
              Category
            </label>
            <select
              id="module-category"
              value={module.category}
              onChange={(e) => handleChange('category', e.target.value as Category)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="module-difficulty">
              Difficulty
            </label>
            <select
              id="module-difficulty"
              value={module.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value as Difficulty)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estimated time */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="module-time">
            Estimated Time (minutes)
          </label>
          <input
            id="module-time"
            type="number"
            value={module.estimatedMinutes}
            onChange={(e) => handleChange('estimatedMinutes', Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={240}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          />
        </div>
      </div>
    </div>
  );
}
