import React from 'react';
import { Video, AlertCircle } from 'lucide-react';
import type { VideoContent } from '../../types';
import { convertYouTubeUrl } from '../../utils/validators';

interface VideoBlockProps {
  content: VideoContent;
  onChange: (content: VideoContent) => void;
  isEditing: boolean;
}

function getEmbedUrl(url: string): string | null {
  if (!url.trim()) return null;
  try {
    const converted = convertYouTubeUrl(url);
    // Validate it's an embed URL
    if (
      converted.includes('youtube.com/embed/') ||
      converted.includes('player.vimeo.com/video/')
    ) {
      return converted;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoBlock({ content, onChange, isEditing }: VideoBlockProps) {
  const embedUrl = getEmbedUrl(content.url);
  const hasValidUrl = !!embedUrl;

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="video-title">
            Video Title
          </label>
          <input
            id="video-title"
            type="text"
            value={content.title}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Enter video title..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="video-url">
            YouTube or Vimeo URL{' '}
            <span className="text-xs text-slate-400">(e.g. https://youtube.com/watch?v=...)</span>
          </label>
          <input
            id="video-url"
            type="url"
            value={content.url}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            aria-describedby="video-url-hint"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          />
          {content.url && !hasValidUrl && (
            <p id="video-url-hint" className="mt-1 text-xs text-amber-600 flex items-center gap-1" role="alert">
              <AlertCircle size={12} aria-hidden="true" />
              Please enter a valid YouTube or Vimeo URL
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="video-description">
            Description
          </label>
          <textarea
            id="video-description"
            value={content.description}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
            rows={2}
            placeholder="Describe what viewers will learn..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 resize-none"
          />
        </div>

        {/* Preview */}
        {hasValidUrl && embedUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <div className="bg-slate-50 px-3 py-1.5 text-xs text-slate-500 border-b border-slate-200">
              Preview
            </div>
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={content.title || 'Video preview'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Preview mode
  return (
    <div className="space-y-3">
      {content.title && (
        <h3 className="font-semibold text-slate-900">{content.title}</h3>
      )}

      {hasValidUrl && embedUrl ? (
        <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
          <iframe
            src={embedUrl}
            title={content.title || 'Video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        </div>
      ) : (
        <div className="aspect-video rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
          <Video size={40} aria-hidden="true" className="mb-2" />
          <p className="text-sm">
            {content.url ? 'Invalid video URL' : 'No video URL provided'}
          </p>
        </div>
      )}

      {content.description && (
        <p className="text-sm text-slate-600">{content.description}</p>
      )}
    </div>
  );
}
