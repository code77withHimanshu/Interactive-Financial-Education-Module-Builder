import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Globe,
  EyeOff,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { useActiveModule } from '../../hooks/useModules';
import { MetadataForm } from './MetadataForm';
import { BlockList } from './BlockList';
import { AddBlockPalette } from './AddBlockPalette';
import { Button } from '../UI/Button';
import type { BlockContent, BlockType } from '../../types';

export function ModuleEditor() {
  const module = useActiveModule();
  const addBlock = useModuleStore((s) => s.addBlock);
  const updateBlock = useModuleStore((s) => s.updateBlock);
  const deleteBlock = useModuleStore((s) => s.deleteBlock);
  const reorderBlocks = useModuleStore((s) => s.reorderBlocks);
  const updateModule = useModuleStore((s) => s.updateModule);
  const deleteModule = useModuleStore((s) => s.deleteModule);
  const setActiveView = useModuleStore((s) => s.setActiveView);
  const setActiveModule = useModuleStore((s) => s.setActiveModule);

  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!module) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <p>Module not found. <button
          className="text-blue-800 underline hover:text-blue-900"
          onClick={() => setActiveView('dashboard')}
        >
          Go back to dashboard
        </button></p>
      </div>
    );
  }

  const handleSave = () => {
    updateModule(module.id, { updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTogglePublish = () => {
    updateModule(module.id, { published: !module.published });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteModule(module.id);
      setActiveModule(null);
      setActiveView('dashboard');
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleAddBlock = (type: BlockType) => {
    addBlock(module.id, type);
  };

  const handleUpdateBlock = (blockId: string, content: BlockContent) => {
    updateBlock(module.id, blockId, content);
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteBlock(module.id, blockId);
  };

  const handleReorderBlocks = (activeId: string, overId: string) => {
    reorderBlocks(module.id, activeId, overId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6"
    >
      {/* Top toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveView('dashboard'); setActiveModule(null); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Dashboard
          </button>
          <span className="text-slate-300 text-sm" aria-hidden="true">/</span>
          <h1 className="text-base font-semibold text-slate-900 truncate max-w-xs">
            {module.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} aria-hidden="true" />}
            onClick={handleDelete}
            aria-label={confirmDelete ? 'Click again to confirm delete' : 'Delete module'}
            className={confirmDelete ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}
          >
            {confirmDelete ? 'Confirm?' : 'Delete'}
          </Button>

          {/* Preview */}
          <Button
            variant="outline"
            size="sm"
            icon={<Eye size={14} aria-hidden="true" />}
            onClick={() => setActiveView('preview')}
            aria-label="Preview module"
          >
            Preview
          </Button>

          {/* Publish toggle */}
          <Button
            variant={module.published ? 'secondary' : 'outline'}
            size="sm"
            icon={
              module.published ? (
                <EyeOff size={14} aria-hidden="true" />
              ) : (
                <Globe size={14} aria-hidden="true" />
              )
            }
            onClick={handleTogglePublish}
            aria-label={module.published ? 'Unpublish module' : 'Publish module'}
          >
            {module.published ? 'Unpublish' : 'Publish'}
          </Button>

          {/* Save */}
          <Button
            variant="primary"
            size="sm"
            icon={<Save size={14} aria-hidden="true" />}
            onClick={handleSave}
            aria-label="Save module"
          >
            {saved ? 'Saved!' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {/* Metadata */}
        <MetadataForm module={module} />

        {/* Block list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Content Blocks ({module.blocks.length})
            </h2>
          </div>
          <BlockList
            moduleId={module.id}
            blocks={module.blocks}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onReorderBlocks={handleReorderBlocks}
          />
        </div>

        {/* Add block palette */}
        <AddBlockPalette onAdd={handleAddBlock} />
      </div>
    </motion.div>
  );
}
