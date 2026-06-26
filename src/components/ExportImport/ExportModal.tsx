import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { downloadJSON } from '../../utils/exportImport';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  moduleId?: string;
}

export function ExportModal({ open, onClose, moduleId }: ExportModalProps) {
  const exportJSON = useModuleStore((s) => s.exportJSON);
  const modules = useModuleStore((s) => s.modules);
  const activeModuleId = useModuleStore((s) => s.activeModuleId);

  const [copied, setCopied] = useState(false);
  const [exportTarget, setExportTarget] = useState<'all' | 'single'>('all');
  const [selectedId, setSelectedId] = useState(moduleId ?? activeModuleId ?? '');

  const getJSON = () => {
    if (exportTarget === 'single' && selectedId) {
      return exportJSON(selectedId);
    }
    return exportJSON();
  };

  const handleDownload = () => {
    const json = getJSON();
    const filename =
      exportTarget === 'single' && selectedId
        ? `module-${selectedId.slice(0, 8)}.json`
        : 'all-modules.json';
    downloadJSON(json, filename);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getJSON());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Export Modules" size="lg">
      <div className="space-y-4">
        {/* Export target */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">What to export</p>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="export-target"
                value="all"
                checked={exportTarget === 'all'}
                onChange={() => setExportTarget('all')}
                className="text-blue-800 focus:ring-blue-800"
              />
              All modules ({modules.length})
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="export-target"
                value="single"
                checked={exportTarget === 'single'}
                onChange={() => setExportTarget('single')}
                className="text-blue-800 focus:ring-blue-800"
              />
              Single module
            </label>
          </div>
        </div>

        {/* Module selector */}
        {exportTarget === 'single' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="export-module-select">
              Select module
            </label>
            <select
              id="export-module-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              <option value="">-- Select a module --</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* JSON preview */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Preview</p>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 max-h-48 overflow-y-auto font-mono whitespace-pre-wrap break-all">
            {(exportTarget === 'all' || selectedId) ? getJSON().slice(0, 600) + '...' : '(select a module)'}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <Button variant="outline" onClick={handleCopy} icon={copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}>
            {copied ? 'Copied!' : 'Copy JSON'}
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            icon={<Download size={14} aria-hidden="true" />}
            disabled={exportTarget === 'single' && !selectedId}
            aria-label="Download JSON file"
          >
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
}
