import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, FileJson } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportModal({ open, onClose }: ImportModalProps) {
  const importJSON = useModuleStore((s) => s.importJSON);
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText(ev.target?.result as string ?? '');
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = importJSON(text);
      setResult(res);
      if (res.success) {
        setTimeout(() => {
          onClose();
          setText('');
          setResult(null);
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setText('');
    setResult(null);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Import Modules" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Import modules from a previously exported JSON file. Existing modules with duplicate IDs will be imported as copies.
        </p>

        {/* File upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="sr-only"
            id="import-file-input"
            aria-label="Select JSON file to import"
          />
          <label
            htmlFor="import-file-input"
            className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            aria-label="Upload JSON file"
          >
            <FileJson size={32} className="text-slate-400" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-600">
              Click to upload a JSON file
            </p>
            <p className="text-xs text-slate-400">or paste JSON below</p>
          </label>
        </div>

        {/* Text area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="import-json-text">
            Or paste JSON directly
          </label>
          <textarea
            id="import-json-text"
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            rows={6}
            placeholder='{"version": "1.0.0", "modules": [...]}'
            className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 resize-none"
            aria-label="JSON content to import"
          />
        </div>

        {/* Result */}
        {result && (
          <div
            role="alert"
            className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
              result.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {result.success ? (
              <>
                <CheckCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                Modules imported successfully!
              </>
            ) : (
              <>
                <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                {result.error ?? 'Import failed.'}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            loading={loading}
            disabled={!text.trim()}
            icon={<Upload size={14} aria-hidden="true" />}
            aria-label="Import JSON"
          >
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
