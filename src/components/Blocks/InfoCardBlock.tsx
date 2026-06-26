import React from 'react';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import type { InfoCardContent, InfoCardVariant } from '../../types';
import { clsx } from 'clsx';

interface InfoCardBlockProps {
  content: InfoCardContent;
  onChange: (content: InfoCardContent) => void;
  isEditing: boolean;
}

const variantConfig: Record<
  InfoCardVariant,
  { icon: React.ReactNode; bg: string; border: string; title: string; iconColor: string }
> = {
  tip: {
    icon: <Lightbulb size={20} aria-hidden="true" />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'text-amber-800',
    iconColor: 'text-amber-600',
  },
  warning: {
    icon: <AlertTriangle size={20} aria-hidden="true" />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    title: 'text-red-800',
    iconColor: 'text-red-600',
  },
  info: {
    icon: <Info size={20} aria-hidden="true" />,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    title: 'text-blue-800',
    iconColor: 'text-blue-600',
  },
};

const VARIANTS: InfoCardVariant[] = ['tip', 'warning', 'info'];

export function InfoCardBlock({ content, onChange, isEditing }: InfoCardBlockProps) {
  const config = variantConfig[content.variant];

  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Variant selector */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Card Type</p>
          <div className="flex gap-2" role="radiogroup" aria-label="Card variant">
            {VARIANTS.map((v) => {
              const vc = variantConfig[v];
              return (
                <label
                  key={v}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium capitalize transition-all',
                    content.variant === v
                      ? `${vc.bg} ${vc.border} ${vc.title}`
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  )}
                >
                  <input
                    type="radio"
                    name="card-variant"
                    value={v}
                    checked={content.variant === v}
                    onChange={() => onChange({ ...content, variant: v })}
                    className="sr-only"
                  />
                  <span className={content.variant === v ? vc.iconColor : 'text-slate-400'}>
                    {vc.icon}
                  </span>
                  {v}
                </label>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="infocard-title">
            Title
          </label>
          <input
            id="infocard-title"
            type="text"
            value={content.title}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Card title..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="infocard-body">
            Body
          </label>
          <textarea
            id="infocard-body"
            value={content.body}
            onChange={(e) => onChange({ ...content, body: e.target.value })}
            rows={3}
            placeholder="Card content..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 resize-none"
          />
        </div>

        {/* Preview */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Preview</p>
          <InfoCardPreview content={content} />
        </div>
      </div>
    );
  }

  return <InfoCardPreview content={content} />;
}

function InfoCardPreview({ content }: { content: InfoCardContent }) {
  const config = variantConfig[content.variant];
  const variantLabel = content.variant.charAt(0).toUpperCase() + content.variant.slice(1);

  return (
    <div
      className={clsx('rounded-xl p-4 border', config.bg, config.border)}
      role="note"
      aria-label={`${variantLabel} card: ${content.title}`}
    >
      <div className="flex items-start gap-3">
        <span className={clsx('mt-0.5 shrink-0', config.iconColor)}>
          {config.icon}
        </span>
        <div className="min-w-0">
          {content.title && (
            <p className={clsx('font-semibold text-sm mb-1', config.title)}>
              {content.title}
            </p>
          )}
          {content.body && (
            <p className="text-sm text-slate-700 leading-relaxed">{content.body}</p>
          )}
        </div>
      </div>
    </div>
  );
}
