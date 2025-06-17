import { useState, useCallback, useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface LinkSuggestion {
  linkText: string;
  pageId: string;
  context: string;
}

export function useLinkSuggestions(workspaceId: string) {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const editor = useEditor();

  const fetchSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!text || text.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post(
          `/api/pages/workspaces/${workspaceId}/suggest-links`,
          { text }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching link suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [workspaceId]
  );

  const insertLink = useCallback(
    (suggestion: LinkSuggestion) => {
      if (!editor) return;

      const { linkText, pageId } = suggestion;
      const { from, to } = editor.state.selection;

      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: `/pages/${pageId}` })
        .run();

      setSuggestions([]);
    },
    [editor]
  );

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      fetchSuggestions(text);
    };

    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, fetchSuggestions]);

  return {
    suggestions,
    isLoading,
    insertLink,
    clearSuggestions: () => setSuggestions([]),
  };
} 