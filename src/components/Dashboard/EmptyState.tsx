import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '../UI/Button';
import { useModuleStore } from '../../store/moduleStore';

interface EmptyStateProps {
  isFiltered?: boolean;
}

export function EmptyState({ isFiltered = false }: EmptyStateProps) {
  const createModule = useModuleStore((s) => s.createModule);
  const setActiveModule = useModuleStore((s) => s.setActiveModule);
  const setActiveView = useModuleStore((s) => s.setActiveView);
  const setSearchQuery = useModuleStore((s) => s.setSearchQuery);
  const setFilterCategory = useModuleStore((s) => s.setFilterCategory);
  const setFilterDifficulty = useModuleStore((s) => s.setFilterDifficulty);

  const handleCreate = () => {
    const id = createModule();
    setActiveModule(id);
    setActiveView('editor');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterDifficulty('');
  };

  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
          <BookOpen size={36} className="text-slate-400" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No modules found</h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          No modules match your current search or filters. Try adjusting them or create a new module.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button variant="primary" icon={<Plus size={16} aria-hidden="true" />} onClick={handleCreate}>
            New Module
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {/* SVG illustration */}
      <svg
        width="160"
        height="140"
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        aria-hidden="true"
      >
        <rect x="20" y="20" width="120" height="90" rx="8" fill="#e2e8f0" />
        <rect x="30" y="35" width="60" height="8" rx="4" fill="#94a3b8" />
        <rect x="30" y="50" width="100" height="6" rx="3" fill="#cbd5e1" />
        <rect x="30" y="62" width="80" height="6" rx="3" fill="#cbd5e1" />
        <rect x="30" y="74" width="90" height="6" rx="3" fill="#cbd5e1" />
        <circle cx="120" cy="110" r="22" fill="#1e40af" />
        <path d="M112 110 L118 116 L128 105" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <h2 className="text-2xl font-bold text-slate-900 mb-3">Start Building!</h2>
      <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
        Create your first financial education module. Add rich text, quizzes, videos, calculators, and more to engage your learners.
      </p>
      <Button
        variant="primary"
        size="lg"
        icon={<Plus size={20} aria-hidden="true" />}
        onClick={handleCreate}
        aria-label="Create your first module"
      >
        Create Your First Module
      </Button>
    </div>
  );
}
