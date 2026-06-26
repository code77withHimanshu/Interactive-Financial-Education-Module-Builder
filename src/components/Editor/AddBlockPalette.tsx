import React from 'react';
import { motion } from 'framer-motion';
import { Type, HelpCircle, Video, Calculator, Lightbulb } from 'lucide-react';
import type { BlockType } from '../../types';

interface BlockOption {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}

const BLOCK_OPTIONS: BlockOption[] = [
  {
    type: 'text',
    label: 'Text',
    description: 'Rich text with headings, lists, links',
    icon: <Type size={22} aria-hidden="true" />,
    color: 'hover:border-slate-400',
    iconBg: 'bg-slate-100 text-slate-700',
  },
  {
    type: 'quiz',
    label: 'Quiz',
    description: 'Multiple choice question',
    icon: <HelpCircle size={22} aria-hidden="true" />,
    color: 'hover:border-purple-400',
    iconBg: 'bg-purple-100 text-purple-700',
  },
  {
    type: 'video',
    label: 'Video',
    description: 'YouTube or Vimeo embed',
    icon: <Video size={22} aria-hidden="true" />,
    color: 'hover:border-red-400',
    iconBg: 'bg-red-100 text-red-700',
  },
  {
    type: 'calculator',
    label: 'Calculator',
    description: 'Compound interest calculator',
    icon: <Calculator size={22} aria-hidden="true" />,
    color: 'hover:border-blue-400',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    type: 'infoCard',
    label: 'Info Card',
    description: 'Tip, warning, or info card',
    icon: <Lightbulb size={22} aria-hidden="true" />,
    color: 'hover:border-amber-400',
    iconBg: 'bg-amber-100 text-amber-700',
  },
];

interface AddBlockPaletteProps {
  onAdd: (type: BlockType) => void;
}

export function AddBlockPalette({ onAdd }: AddBlockPaletteProps) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-4">
      <p className="text-sm font-medium text-slate-600 mb-3 text-center">
        Add a block
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" role="list">
        {BLOCK_OPTIONS.map((option) => (
          <motion.button
            key={option.type}
            role="listitem"
            onClick={() => onAdd(option.type)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Add ${option.label} block: ${option.description}`}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-slate-200 bg-white
              transition-colors cursor-pointer text-center
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800
              ${option.color}`}
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.iconBg}`}>
              {option.icon}
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">{option.label}</p>
              <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">
                {option.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
