import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

const useWebSocket = (workspaceId, pageId) => {
  const { user } = useAuth();
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);
  const [cursors, setCursors] = useState([]);
  const [presence, setPresence] = useState([]);

  useEffect(() => {
    if (!user || !workspaceId || !pageId) return;

    // Connect to WebSocket
    ws.current = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws?workspaceId=${workspaceId}&pageId=${pageId}`
    );

    ws.current.onopen = () => {
      setConnected(true);
      // Send initial presence
      ws.current.send(JSON.stringify({
        type: 'presence',
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      }));
    };

    ws.current.onclose = () => {
      setConnected(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'cursor':
          setCursors(prev => {
            const filtered = prev.filter(c => c.userId !== data.userId);
            return [...filtered, data];
          });
          break;

        case 'presence':
          setPresence(data.users);
          break;

        case 'content':
          // Handle content updates
          break;

        default:
          console.warn('Unknown message type:', data.type);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user, workspaceId, pageId]);

  const sendCursorPosition = (position) => {
    if (!ws.current || !connected) return;

    ws.current.send(JSON.stringify({
      type: 'cursor',
      userId: user.id,
      position,
      name: user.name
    }));
  };

  const sendContentUpdate = (content) => {
    if (!ws.current || !connected) return;

    ws.current.send(JSON.stringify({
      type: 'content',
      userId: user.id,
      content
    }));
  };

  return {
    connected,
    cursors,
    presence,
    sendCursorPosition,
    sendContentUpdate
  };
};

export default useWebSocket; 