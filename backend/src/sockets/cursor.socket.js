const jwt = require('jsonwebtoken');
const { WebSocketServer } = require('ws');

class CursorSocket {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map(); // Map of pageId -> Set of clients
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', async (ws, req) => {
      try {
        // Extract token from URL query
        const url = new URL(req.url, 'ws://localhost');
        const token = url.searchParams.get('token');
        const pageId = url.searchParams.get('pageId');

        if (!token || !pageId) {
          ws.close(1008, 'Missing token or pageId');
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ws.userId = decoded.id;
        ws.pageId = pageId;

        // Add client to page's client set
        if (!this.clients.has(pageId)) {
          this.clients.set(pageId, new Set());
        }
        this.clients.get(pageId).add(ws);

        // Send current cursors to new client
        this.broadcastCursors(pageId);

        // Handle cursor updates
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            if (data.type === 'cursor') {
              ws.cursor = data.cursor;
              this.broadcastCursors(pageId);
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        });

        // Handle disconnection
        ws.on('close', () => {
          const pageClients = this.clients.get(pageId);
          if (pageClients) {
            pageClients.delete(ws);
            if (pageClients.size === 0) {
              this.clients.delete(pageId);
            } else {
              this.broadcastCursors(pageId);
            }
          }
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1008, 'Authentication failed');
      }
    });
  }

  broadcastCursors(pageId) {
    const pageClients = this.clients.get(pageId);
    if (!pageClients) return;

    const cursors = Array.from(pageClients)
      .filter(client => client.cursor)
      .map(client => ({
        userId: client.userId,
        cursor: client.cursor
      }));

    const message = JSON.stringify({
      type: 'cursors',
      cursors
    });

    pageClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

module.exports = CursorSocket; 