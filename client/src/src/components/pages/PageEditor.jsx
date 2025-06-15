import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { usePages } from '../../../contexts/PageContext';

export default function PageEditor() {
  const { id } = useParams();
  const { currentPage, fetchPage, updatePage } = usePages();
  const [title, setTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      updatePage(id, { content: editor.getHTML() });
    }
  });

  useEffect(() => {
    if (id) {
      fetchPage(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentPage) {
      setTitle(currentPage.title);
      editor?.commands.setContent(currentPage.content);
    }
  }, [currentPage, editor]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    await updatePage(id, { title: newTitle });
  };

  if (!currentPage) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex-grow p-4">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="w-full text-2xl font-bold mb-4 p-2 border-b focus:outline-none focus:border-indigo-500"
        placeholder="Untitled"
      />
      <div className="prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
} 