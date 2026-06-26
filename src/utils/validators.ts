import type { Module, Block, BlockContent, TextContent, QuizContent, VideoContent, CalculatorContent, InfoCardContent } from '../types';

export function isValidCategory(value: unknown): boolean {
  return ['budgeting', 'investing', 'debt', 'savings', 'taxes', 'retirement'].includes(value as string);
}

export function isValidDifficulty(value: unknown): boolean {
  return ['beginner', 'intermediate', 'advanced'].includes(value as string);
}

export function isValidBlockType(value: unknown): boolean {
  return ['text', 'quiz', 'video', 'calculator', 'infoCard'].includes(value as string);
}

export function isValidInfoCardVariant(value: unknown): boolean {
  return ['tip', 'warning', 'info'].includes(value as string);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateTextContent(content: unknown): content is TextContent {
  if (!isObject(content)) return false;
  return typeof content.html === 'string';
}

export function validateQuizContent(content: unknown): content is QuizContent {
  if (!isObject(content)) return false;
  if (typeof content.question !== 'string') return false;
  if (typeof content.correctOptionId !== 'string') return false;
  if (typeof content.explanation !== 'string') return false;
  if (!Array.isArray(content.options)) return false;
  if (content.options.length < 2 || content.options.length > 4) return false;
  return content.options.every(
    (opt: unknown) =>
      isObject(opt) &&
      typeof opt.id === 'string' &&
      typeof opt.text === 'string'
  );
}

export function validateVideoContent(content: unknown): content is VideoContent {
  if (!isObject(content)) return false;
  return (
    typeof content.url === 'string' &&
    typeof content.title === 'string' &&
    typeof content.description === 'string'
  );
}

export function validateCalculatorContent(content: unknown): content is CalculatorContent {
  if (!isObject(content)) return false;
  return (
    typeof content.principal === 'number' &&
    typeof content.rate === 'number' &&
    typeof content.years === 'number' &&
    typeof content.compoundingFrequency === 'number'
  );
}

export function validateInfoCardContent(content: unknown): content is InfoCardContent {
  if (!isObject(content)) return false;
  return (
    isValidInfoCardVariant(content.variant) &&
    typeof content.icon === 'string' &&
    typeof content.title === 'string' &&
    typeof content.body === 'string'
  );
}

export function validateBlockContent(type: string, content: unknown): content is BlockContent {
  switch (type) {
    case 'text': return validateTextContent(content);
    case 'quiz': return validateQuizContent(content);
    case 'video': return validateVideoContent(content);
    case 'calculator': return validateCalculatorContent(content);
    case 'infoCard': return validateInfoCardContent(content);
    default: return false;
  }
}

export function validateBlock(block: unknown): block is Block {
  if (!isObject(block)) return false;
  if (typeof block.id !== 'string') return false;
  if (!isValidBlockType(block.type)) return false;
  if (typeof block.order !== 'number') return false;
  return validateBlockContent(block.type as string, block.content);
}

export function validateModule(module: unknown): module is Module {
  if (!isObject(module)) return false;
  if (typeof module.id !== 'string') return false;
  if (typeof module.title !== 'string') return false;
  if (typeof module.description !== 'string') return false;
  if (!isValidCategory(module.category)) return false;
  if (!isValidDifficulty(module.difficulty)) return false;
  if (typeof module.estimatedMinutes !== 'number') return false;
  if (typeof module.createdAt !== 'string') return false;
  if (typeof module.updatedAt !== 'string') return false;
  if (typeof module.published !== 'boolean') return false;
  if (!Array.isArray(module.blocks)) return false;
  return module.blocks.every(validateBlock);
}

export function validateModulesArray(data: unknown): data is Module[] {
  if (!Array.isArray(data)) return false;
  return data.every(validateModule);
}

export function convertYouTubeUrl(url: string): string {
  try {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  } catch {
    return url;
  }
}
