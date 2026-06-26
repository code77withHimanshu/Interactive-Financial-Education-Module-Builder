import { useMemo } from 'react';
import { useModuleStore } from '../store/moduleStore';
import type { Module } from '../types';

export function useModules() {
  const modules = useModuleStore((s) => s.modules);
  const searchQuery = useModuleStore((s) => s.searchQuery);
  const filterCategory = useModuleStore((s) => s.filterCategory);
  const filterDifficulty = useModuleStore((s) => s.filterDifficulty);

  const filteredModules = useMemo(() => {
    let result: Module[] = modules;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    if (filterCategory) {
      result = result.filter((m) => m.category === filterCategory);
    }

    if (filterDifficulty) {
      result = result.filter((m) => m.difficulty === filterDifficulty);
    }

    return result;
  }, [modules, searchQuery, filterCategory, filterDifficulty]);

  return {
    modules,
    filteredModules,
    totalCount: modules.length,
    filteredCount: filteredModules.length,
  };
}

export function useActiveModule() {
  const activeModuleId = useModuleStore((s) => s.activeModuleId);
  const modules = useModuleStore((s) => s.modules);
  return useMemo(
    () => modules.find((m) => m.id === activeModuleId) ?? null,
    [modules, activeModuleId]
  );
}
