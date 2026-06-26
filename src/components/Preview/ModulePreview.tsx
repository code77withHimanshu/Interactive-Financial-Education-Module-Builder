import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Edit3,
  Clock,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { useActiveModule } from '../../hooks/useModules';
import { ProgressBar } from './ProgressBar';
import { TextBlock } from '../Blocks/TextBlock';
import { QuizBlock } from '../Blocks/QuizBlock';
import { VideoBlock } from '../Blocks/VideoBlock';
import { CalculatorBlock } from '../Blocks/CalculatorBlock';
import { InfoCardBlock } from '../Blocks/InfoCardBlock';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import type { Block, BlockContent } from '../../types';

export function ModulePreview() {
  const module = useActiveModule();
  const setActiveView = useModuleStore((s) => s.setActiveView);
  const setActiveModule = useModuleStore((s) => s.setActiveModule);
  const updateBlock = useModuleStore((s) => s.updateBlock);

  const [currentBlockIdx, setCurrentBlockIdx] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!module) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <p>
          Module not found.{' '}
          <button
            className="text-blue-800 underline hover:text-blue-900"
            onClick={() => setActiveView('dashboard')}
          >
            Go back to dashboard
          </button>
        </p>
      </div>
    );
  }

  const sortedBlocks = [...module.blocks].sort((a, b) => a.order - b.order);
  const totalBlocks = sortedBlocks.length;
  const currentBlock = sortedBlocks[currentBlockIdx];

  const handlePrev = () => {
    if (currentBlockIdx > 0) setCurrentBlockIdx(currentBlockIdx - 1);
  };

  const handleNext = () => {
    if (currentBlockIdx < totalBlocks - 1) {
      setCurrentBlockIdx(currentBlockIdx + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBlockUpdate = (content: BlockContent) => {
    if (module && currentBlock) {
      updateBlock(module.id, currentBlock.id, content);
    }
  };

  const renderBlock = (block: Block) => {
    const props = {
      isEditing: false,
      onChange: handleBlockUpdate,
    };

    switch (block.type) {
      case 'text':
        return (
          <TextBlock
            content={block.content as import('../../types').TextContent}
            onChange={props.onChange}
            isEditing={false}
          />
        );
      case 'quiz':
        return (
          <QuizBlock
            content={block.content as import('../../types').QuizContent}
            onChange={props.onChange}
            isEditing={false}
          />
        );
      case 'video':
        return (
          <VideoBlock
            content={block.content as import('../../types').VideoContent}
            onChange={props.onChange}
            isEditing={false}
          />
        );
      case 'calculator':
        return (
          <CalculatorBlock
            content={block.content as import('../../types').CalculatorContent}
            onChange={props.onChange}
            isEditing={false}
          />
        );
      case 'infoCard':
        return (
          <InfoCardBlock
            content={block.content as import('../../types').InfoCardContent}
            onChange={props.onChange}
            isEditing={false}
          />
        );
      default:
        return null;
    }
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Module Complete!</h1>
        <p className="text-slate-500 mb-2">
          You've completed <strong>{module.title}</strong>.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          You reviewed {totalBlocks} block{totalBlocks !== 1 ? 's' : ''} in approximately {module.estimatedMinutes} minutes.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} aria-hidden="true" />}
            onClick={() => { setCurrentBlockIdx(0); setCompleted(false); }}
          >
            Start Over
          </Button>
          <Button
            variant="primary"
            icon={<Edit3 size={16} aria-hidden="true" />}
            onClick={() => setActiveView('editor')}
          >
            Edit Module
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setActiveView('dashboard'); setActiveModule(null); }}
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { setActiveView('dashboard'); setActiveModule(null); }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('editor')}
          className="flex items-center gap-1.5 text-sm text-blue-800 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded"
          aria-label="Edit module"
        >
          <Edit3 size={14} aria-hidden="true" />
          Edit
        </button>
      </div>

      {/* Module header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="category" category={module.category}>{module.category}</Badge>
          <Badge variant="difficulty" difficulty={module.difficulty}>{module.difficulty}</Badge>
          {module.published && <Badge variant="published">Published</Badge>}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{module.title}</h1>
        {module.description && (
          <p className="text-slate-500 text-sm mb-3">{module.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {module.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 size={12} aria-hidden="true" />
            {totalBlocks} block{totalBlocks !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {totalBlocks > 0 && (
        <div className="mb-6">
          <ProgressBar
            current={currentBlockIdx + 1}
            total={totalBlocks}
            label="Module progress"
          />
        </div>
      )}

      {/* Current block */}
      {totalBlocks === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>This module has no content blocks yet.</p>
          <button
            onClick={() => setActiveView('editor')}
            className="mt-3 text-blue-800 underline hover:text-blue-900"
          >
            Add blocks in the editor
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBlock?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
          >
            {currentBlock && renderBlock(currentBlock)}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation */}
      {totalBlocks > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            icon={<ChevronLeft size={16} aria-hidden="true" />}
            onClick={handlePrev}
            disabled={currentBlockIdx === 0}
            aria-label="Previous block"
          >
            Previous
          </Button>

          <span className="text-sm text-slate-400">
            {currentBlockIdx + 1} / {totalBlocks}
          </span>

          <Button
            variant="primary"
            size="sm"
            icon={<ChevronRight size={16} aria-hidden="true" />}
            iconPosition="right"
            onClick={handleNext}
            aria-label={currentBlockIdx === totalBlocks - 1 ? 'Complete module' : 'Next block'}
          >
            {currentBlockIdx === totalBlocks - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
