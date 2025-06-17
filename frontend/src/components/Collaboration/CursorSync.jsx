import React, { useEffect, useRef } from 'react';

const CursorSync = ({ cursors }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove old cursors
    const oldCursors = containerRef.current.querySelectorAll('.remote-cursor');
    oldCursors.forEach(cursor => cursor.remove());

    // Add new cursors
    cursors.forEach(cursor => {
      const cursorElement = document.createElement('div');
      cursorElement.className = 'remote-cursor';
      cursorElement.style.position = 'absolute';
      cursorElement.style.left = `${cursor.position.x}px`;
      cursorElement.style.top = `${cursor.position.y}px`;
      cursorElement.style.width = '2px';
      cursorElement.style.height = '20px';
      cursorElement.style.backgroundColor = cursor.color;
      cursorElement.style.pointerEvents = 'none';
      cursorElement.style.zIndex = '1000';

      const label = document.createElement('div');
      label.className = 'cursor-label';
      label.style.position = 'absolute';
      label.style.left = '4px';
      label.style.top = '-20px';
      label.style.backgroundColor = cursor.color;
      label.style.color = 'white';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '4px';
      label.style.fontSize = '12px';
      label.style.whiteSpace = 'nowrap';
      label.textContent = cursor.name;

      cursorElement.appendChild(label);
      containerRef.current.appendChild(cursorElement);
    });
  }, [cursors]);

  return <div ref={containerRef} className="relative" />;
};

export default CursorSync; 