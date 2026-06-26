import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { useModules } from '../../hooks/useModules';
import { useModuleStore } from '../../store/moduleStore';
import { ModuleCard } from './ModuleCard';
import { SearchFilter } from './SearchFilter';
import { EmptyState } from './EmptyState';
import { Button } from '../UI/Button';

export function Dashboard() {
  const { modules, filteredModules } = useModules();
  const searchQuery = useModuleStore((s) => s.searchQuery);
  const filterCategory = useModuleStore((s) => s.filterCategory);
  const filterDifficulty = useModuleStore((s) => s.filterDifficulty);
  const createModule = useModuleStore((s) => s.createModule);
  const setActiveModule = useModuleStore((s) => s.setActiveModule);
  const setActiveView = useModuleStore((s) => s.setActiveView);

  const isFiltered = !!(searchQuery || filterCategory || filterDifficulty);
  const publishedCount = modules.filter((m) => m.published).length;

  const handleNewModule = () => {
    const id = createModule();
    setActiveModule(id);
    setActiveView('editor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={24} className="text-blue-800" aria-hidden="true" />
            Module Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {modules.length} module{modules.length !== 1 ? 's' : ''} &bull;{' '}
            {publishedCount} published
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={handleNewModule}
          aria-label="Create new module"
        >
          New Module
        </Button>
      </div>

      {/* Search & Filter */}
      {modules.length > 0 && (
        <div className="mb-6">
          <SearchFilter />
        </div>
      )}

      {/* Stats bar */}
      {isFiltered && (
        <div className="mb-4 text-sm text-slate-500">
          Showing <strong className="text-slate-700">{filteredModules.length}</strong> of{' '}
          <strong className="text-slate-700">{modules.length}</strong> modules
        </div>
      )}

      {/* Content */}
      {modules.length === 0 ? (
        <EmptyState isFiltered={false} />
      ) : filteredModules.length === 0 ? (
        <EmptyState isFiltered={true} />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
          aria-label="Modules list"
        >
          <AnimatePresence mode="popLayout">
            {filteredModules.map((module) => (
              <div key={module.id} role="listitem">
                <ModuleCard module={module} />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
