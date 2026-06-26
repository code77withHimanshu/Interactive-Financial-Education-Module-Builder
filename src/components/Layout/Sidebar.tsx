import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Landmark,
  Receipt,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { clsx } from 'clsx';
import type { Category } from '../../types';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  active?: boolean;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  budgeting: <PiggyBank size={16} aria-hidden="true" />,
  investing: <TrendingUp size={16} aria-hidden="true" />,
  debt: <CreditCard size={16} aria-hidden="true" />,
  savings: <Landmark size={16} aria-hidden="true" />,
  taxes: <Receipt size={16} aria-hidden="true" />,
  retirement: <Briefcase size={16} aria-hidden="true" />,
};

const CATEGORIES: Category[] = ['budgeting', 'investing', 'debt', 'savings', 'taxes', 'retirement'];

export function Sidebar() {
  const sidebarOpen = useModuleStore((s) => s.sidebarOpen);
  const setActiveView = useModuleStore((s) => s.setActiveView);
  const setActiveModule = useModuleStore((s) => s.setActiveModule);
  const filterCategory = useModuleStore((s) => s.filterCategory);
  const setFilterCategory = useModuleStore((s) => s.setFilterCategory);
  const activeView = useModuleStore((s) => s.activeView);
  const modules = useModuleStore((s) => s.modules);
  const toggleSidebar = useModuleStore((s) => s.toggleSidebar);

  const handleDashboard = () => {
    setActiveView('dashboard');
    setActiveModule(null);
    setFilterCategory('');
  };

  const handleCategoryFilter = (cat: Category) => {
    setActiveView('dashboard');
    setActiveModule(null);
    setFilterCategory(filterCategory === cat ? '' : cat);
  };

  const getCategoryCount = (cat: Category) =>
    modules.filter((m) => m.category === cat).length;

  const sidebarContent = (
    <nav aria-label="Main navigation" className="flex flex-col h-full py-4 px-3 gap-1">
      {/* Dashboard */}
      <button
        onClick={handleDashboard}
        className={clsx(
          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800',
          activeView === 'dashboard' && !filterCategory
            ? 'bg-blue-50 text-blue-800'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )}
        aria-current={activeView === 'dashboard' && !filterCategory ? 'page' : undefined}
      >
        <LayoutDashboard size={18} aria-hidden="true" />
        All Modules
        <span className="ml-auto text-xs text-slate-400">{modules.length}</span>
      </button>

      {/* Category divider */}
      <div className="mt-4 mb-2 px-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</p>
      </div>

      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryFilter(cat)}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800',
            filterCategory === cat && activeView === 'dashboard'
              ? 'bg-blue-50 text-blue-800 font-medium'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
          aria-pressed={filterCategory === cat}
          aria-label={`Filter by ${cat} (${getCategoryCount(cat)} modules)`}
        >
          {categoryIcons[cat]}
          <span className="capitalize">{cat}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
            {getCategoryCount(cat)}
            {filterCategory === cat && <ChevronRight size={12} aria-hidden="true" />}
          </span>
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden lg:block shrink-0 bg-white border-r border-slate-200 overflow-hidden"
            aria-label="Sidebar"
          >
            <div className="w-[240px]">{sidebarContent}</div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={toggleSidebar}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-16 bottom-0 z-30 w-[240px] bg-white border-r border-slate-200 lg:hidden"
              aria-label="Sidebar"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
