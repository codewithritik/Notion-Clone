import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const EditorCanvas = () => {
  const [cursorPosition, setCursorPosition] = useState(null);
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello, TipTap!</p>',
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws/cursors/1'); // Replace with your WebSocket URL

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCursorPosition(data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex-1 p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Editor Canvas</h1>
      <div className="border border-gray-300 p-4 rounded">
        <EditorContent editor={editor} />
        {cursorPosition && (
          <div
            className="absolute w-2 h-4 bg-blue-500"
            style={{ left: cursorPosition.x, top: cursorPosition.y }}
          />
        )}
      </div>
    </div>
  );
};

export default EditorCanvas; 