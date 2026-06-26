import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import type { Block, BlockContent } from '../../types';
import { BlockWrapper } from './BlockWrapper';
import { Layers } from 'lucide-react';
import { useState } from 'react';

interface BlockListProps {
  moduleId: string;
  blocks: Block[];
  onUpdateBlock: (blockId: string, content: BlockContent) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (activeId: string, overId: string) => void;
}

export function BlockList({
  moduleId,
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
}: BlockListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      onReorderBlocks(active.id as string, over.id as string);
    }
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  if (sortedBlocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
        <Layers size={40} aria-hidden="true" className="mb-3" />
        <p className="text-sm font-medium">No blocks yet</p>
        <p className="text-xs mt-1">Add a block from the palette below</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedBlocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3" role="list" aria-label="Module blocks">
          <AnimatePresence mode="popLayout">
            {sortedBlocks.map((block) => (
              <div key={block.id} role="listitem">
                <BlockWrapper
                  block={block}
                  moduleId={moduleId}
                  onUpdate={onUpdateBlock}
                  onDelete={onDeleteBlock}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-80 shadow-2xl rounded-xl bg-white border-2 border-blue-400 p-4">
            <p className="text-sm text-slate-600">Moving block...</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
