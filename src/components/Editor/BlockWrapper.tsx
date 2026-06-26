import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Pencil,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Block, BlockContent } from '../../types';
import { TextBlock } from '../Blocks/TextBlock';
import { QuizBlock } from '../Blocks/QuizBlock';
import { VideoBlock } from '../Blocks/VideoBlock';
import { CalculatorBlock } from '../Blocks/CalculatorBlock';
import { InfoCardBlock } from '../Blocks/InfoCardBlock';
import { IconButton } from '../UI/IconButton';
import { clsx } from 'clsx';

interface BlockWrapperProps {
  block: Block;
  moduleId: string;
  onUpdate: (blockId: string, content: BlockContent) => void;
  onDelete: (blockId: string) => void;
}

const blockTypeLabels: Record<string, string> = {
  text: 'Text Block',
  quiz: 'Quiz Block',
  video: 'Video Block',
  calculator: 'Calculator Block',
  infoCard: 'Info Card Block',
};

const blockTypeColors: Record<string, string> = {
  text: 'bg-slate-100 text-slate-700',
  quiz: 'bg-purple-100 text-purple-700',
  video: 'bg-red-100 text-red-700',
  calculator: 'bg-blue-100 text-blue-700',
  infoCard: 'bg-amber-100 text-amber-700',
};

export function BlockWrapper({ block, onUpdate, onDelete }: BlockWrapperProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(block.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const renderBlockContent = () => {
    const props = {
      isEditing,
      onChange: (content: BlockContent) => onUpdate(block.id, content),
    };

    switch (block.type) {
      case 'text':
        return (
          <TextBlock
            content={block.content as import('../../types').TextContent}
            onChange={props.onChange}
            isEditing={isEditing}
          />
        );
      case 'quiz':
        return (
          <QuizBlock
            content={block.content as import('../../types').QuizContent}
            onChange={props.onChange}
            isEditing={isEditing}
          />
        );
      case 'video':
        return (
          <VideoBlock
            content={block.content as import('../../types').VideoContent}
            onChange={props.onChange}
            isEditing={isEditing}
          />
        );
      case 'calculator':
        return (
          <CalculatorBlock
            content={block.content as import('../../types').CalculatorContent}
            onChange={props.onChange}
            isEditing={isEditing}
          />
        );
      case 'infoCard':
        return (
          <InfoCardBlock
            content={block.content as import('../../types').InfoCardContent}
            onChange={props.onChange}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={clsx(
        'bg-white rounded-xl border transition-shadow',
        isDragging
          ? 'shadow-xl border-blue-300 ring-2 ring-blue-300'
          : 'shadow-sm border-slate-200 hover:shadow-md'
      )}
      aria-label={`${blockTypeLabels[block.type]}, block ${block.order + 1}`}
    >
      {/* Block header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${blockTypeLabels[block.type]}`}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded p-0.5 touch-none"
        >
          <GripVertical size={18} aria-hidden="true" />
        </button>

        {/* Block type badge */}
        <span
          className={clsx(
            'px-2 py-0.5 rounded-full text-xs font-medium',
            blockTypeColors[block.type]
          )}
        >
          {blockTypeLabels[block.type]}
        </span>

        {/* Block order */}
        <span className="text-xs text-slate-400 ml-1">#{block.order + 1}</span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <IconButton
            label={isEditing ? 'Preview block' : 'Edit block'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? 'Switch to preview' : 'Switch to edit'}
          >
            {isEditing ? (
              <Eye size={15} aria-hidden="true" />
            ) : (
              <Pencil size={15} aria-hidden="true" />
            )}
          </IconButton>

          <IconButton
            label={collapsed ? 'Expand block' : 'Collapse block'}
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronDown size={15} aria-hidden="true" />
            ) : (
              <ChevronUp size={15} aria-hidden="true" />
            )}
          </IconButton>

          <IconButton
            label={confirmDelete ? 'Confirm delete block' : 'Delete block'}
            variant={confirmDelete ? 'danger' : 'danger'}
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 size={15} aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      {/* Block content */}
      {!collapsed && (
        <div className="p-4">{renderBlockContent()}</div>
      )}

      {/* Edit mode indicator */}
      <div
        className={clsx(
          'h-0.5 rounded-b-xl',
          isEditing ? 'bg-blue-800' : 'bg-emerald-500'
        )}
        aria-hidden="true"
      />
    </motion.div>
  );
}
