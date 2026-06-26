import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';
import type { TextContent } from '../../types';

interface TextBlockProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  isEditing: boolean;
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={label}
      aria-pressed={active}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-blue-100 text-blue-800'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

export function TextBlock({ content, onChange, isEditing }: TextBlockProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your content...' }),
    ],
    content: content.html,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      onChange({ html: editor.getHTML() });
    },
  });

  React.useEffect(() => {
    if (editor && !isEditing) {
      editor.setEditable(false);
    } else if (editor && isEditing) {
      editor.setEditable(true);
    }
  }, [editor, isEditing]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!isEditing) {
    return (
      <div
        className="prose prose-sm max-w-none text-slate-700"
        dangerouslySetInnerHTML={{ __html: content.html }}
        aria-label="Text content"
      />
    );
  }

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex flex-wrap gap-0.5 p-2 bg-slate-50 border-b border-slate-200"
        role="toolbar"
        aria-label="Text formatting"
      >
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor?.isActive('heading', { level: 1 })}
          label="Heading 1"
        >
          <Heading1 size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive('heading', { level: 2 })}
          label="Heading 2"
        >
          <Heading2 size={16} aria-hidden="true" />
        </ToolbarButton>
        <div className="w-px bg-slate-300 mx-1" aria-hidden="true" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive('bold')}
          label="Bold"
        >
          <Bold size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive('italic')}
          label="Italic"
        >
          <Italic size={16} aria-hidden="true" />
        </ToolbarButton>
        <div className="w-px bg-slate-300 mx-1" aria-hidden="true" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive('bulletList')}
          label="Bullet list"
        >
          <List size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive('orderedList')}
          label="Ordered list"
        >
          <ListOrdered size={16} aria-hidden="true" />
        </ToolbarButton>
        <div className="w-px bg-slate-300 mx-1" aria-hidden="true" />
        <ToolbarButton
          onClick={setLink}
          active={editor?.isActive('link')}
          label="Add link"
        >
          <LinkIcon size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().unsetLink().run()}
          active={false}
          label="Remove link"
        >
          <Unlink size={16} aria-hidden="true" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-[120px] prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
}
