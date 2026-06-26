import type { Module } from '../types';
import { validateModule, validateModulesArray } from './validators';

export interface ExportData {
  version: string;
  exportedAt: string;
  modules: Module[];
}

export function exportModules(modules: Module[]): string {
  const exportData: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    modules,
  };
  return JSON.stringify(exportData, null, 2);
}

export function exportSingleModule(module: Module): string {
  const exportData: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    modules: [module],
  };
  return JSON.stringify(exportData, null, 2);
}

export interface ImportResult {
  success: boolean;
  modules?: Module[];
  error?: string;
}

export function importModules(json: string): ImportResult {
  try {
    const parsed = JSON.parse(json) as unknown;

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed) &&
      'modules' in parsed
    ) {
      const data = parsed as Record<string, unknown>;
      if (validateModulesArray(data.modules)) {
        return { success: true, modules: data.modules as Module[] };
      }
      return { success: false, error: 'Invalid module data format in export file.' };
    }

    if (Array.isArray(parsed)) {
      if (validateModulesArray(parsed)) {
        return { success: true, modules: parsed as Module[] };
      }
      return { success: false, error: 'Invalid module array format.' };
    }

    if (validateModule(parsed)) {
      return { success: true, modules: [parsed as Module] };
    }

    return { success: false, error: 'Unrecognized JSON format. Expected modules export data.' };
  } catch {
    return { success: false, error: 'Invalid JSON. Please check the file contents.' };
  }
}

export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
