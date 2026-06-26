import React, { useState } from 'react';
import { BookOpen, Menu, Download, Upload, Plus } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { Button } from '../UI/Button';
import { IconButton } from '../UI/IconButton';
import { ExportModal } from '../ExportImport/ExportModal';
import { ImportModal } from '../ExportImport/ImportModal';

export function Navbar() {
  const toggleSidebar = useModuleStore((s) => s.toggleSidebar);
  const setActiveView = useModuleStore((s) => s.setActiveView);
  const setActiveModule = useModuleStore((s) => s.setActiveModule);
  const createModule = useModuleStore((s) => s.createModule);
  const activeView = useModuleStore((s) => s.activeView);

  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const handleNewModule = () => {
    const id = createModule();
    setActiveModule(id);
    setActiveView('editor');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <IconButton
              label="Toggle sidebar"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </IconButton>
            <button
              onClick={() => { setActiveView('dashboard'); setActiveModule(null); }}
              className="flex items-center gap-2 font-bold text-lg text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded-lg px-1"
              aria-label="Go to dashboard"
            >
              <BookOpen size={24} aria-hidden="true" />
              <span className="hidden sm:block">FinEd Builder</span>
            </button>
          </div>

          {/* Center: Breadcrumb */}
          {activeView !== 'dashboard' && (
            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <button
                onClick={() => { setActiveView('dashboard'); setActiveModule(null); }}
                className="hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded"
              >
                Dashboard
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900 capitalize">{activeView}</span>
            </nav>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <IconButton
              label="Import modules"
              onClick={() => setImportOpen(true)}
              title="Import JSON"
            >
              <Upload size={18} aria-hidden="true" />
            </IconButton>
            <IconButton
              label="Export modules"
              onClick={() => setExportOpen(true)}
              title="Export JSON"
            >
              <Download size={18} aria-hidden="true" />
            </IconButton>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} aria-hidden="true" />}
              onClick={handleNewModule}
              aria-label="Create new module"
            >
              <span className="hidden sm:inline">New Module</span>
            </Button>
          </div>
        </div>
      </header>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
