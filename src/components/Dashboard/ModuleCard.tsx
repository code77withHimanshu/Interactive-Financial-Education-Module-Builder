import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Layers,
  Edit3,
  Eye,
  Trash2,
  Copy,
  MoreVertical,
} from 'lucide-react';
import type { Module } from '../../types';
import { useModuleStore } from '../../store/moduleStore';
import { Badge } from '../UI/Badge';
import { IconButton } from '../UI/IconButton';

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const setActiveModule = useModuleStore((s) => s.setActiveModule);
  const setActiveView = useModuleStore((s) => s.setActiveView);
  const deleteModule = useModuleStore((s) => s.deleteModule);
  const duplicateModule = useModuleStore((s) => s.duplicateModule);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = () => {
    setActiveModule(module.id);
    setActiveView('editor');
  };

  const handlePreview = () => {
    setActiveModule(module.id);
    setActiveView('preview');
  };

  const handleDuplicate = () => {
    duplicateModule(module.id);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteModule(module.id);
      setMenuOpen(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 flex flex-col"
      aria-label={`Module: ${module.title}`}
    >
      {/* Top: status stripe */}
      <div
        className={`h-1 rounded-t-xl ${module.published ? 'bg-emerald-500' : 'bg-slate-300'}`}
        aria-hidden="true"
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate text-base leading-tight">
              {module.title}
            </h3>
          </div>
          {/* Overflow menu */}
          <div className="relative shrink-0">
            <IconButton
              label={`More options for ${module.title}`}
              onClick={() => setMenuOpen(!menuOpen)}
              size="sm"
            >
              <MoreVertical size={16} aria-hidden="true" />
            </IconButton>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="menu"
                  className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-slate-200 py-1 w-44"
                >
                  <button
                    role="menuitem"
                    onClick={handleDuplicate}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Copy size={14} aria-hidden="true" />
                    Duplicate
                  </button>
                  <button
                    role="menuitem"
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={confirmDelete ? 'Click again to confirm deletion' : `Delete ${module.title}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    {confirmDelete ? 'Confirm Delete?' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {module.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {module.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="category" category={module.category}>
            {module.category}
          </Badge>
          <Badge variant="difficulty" difficulty={module.difficulty}>
            {module.difficulty}
          </Badge>
          {module.published ? (
            <Badge variant="published">Published</Badge>
          ) : (
            <Badge variant="draft">Draft</Badge>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto mb-4">
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {module.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Layers size={12} aria-hidden="true" />
            {module.blocks.length} block{module.blocks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-blue-800
              bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
            aria-label={`Edit ${module.title}`}
          >
            <Edit3 size={14} aria-hidden="true" />
            Edit
          </button>
          <button
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-slate-600
              bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label={`Preview ${module.title}`}
          >
            <Eye size={14} aria-hidden="true" />
            Preview
          </button>
        </div>
      </div>
    </motion.article>
  );
}
