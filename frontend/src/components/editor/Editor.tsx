import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useLinkSuggestions } from '../../hooks/useLinkSuggestions';
import { LinkSuggestions } from './LinkSuggestions';

interface EditorProps {
  content: any;
  onChange: (content: any) => void;
  workspaceId: string;
}

export function Editor({ content, onChange, workspaceId }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  const { suggestions, insertLink, clearSuggestions } = useLinkSuggestions(workspaceId);

  return (
    <div className="relative">
      <EditorContent editor={editor} className="prose max-w-none" />
      {suggestions.length > 0 && (
        <LinkSuggestions
          suggestions={suggestions}
          onSelect={insertLink}
          onClose={clearSuggestions}
        />
      )}
    </div>
  );
} 