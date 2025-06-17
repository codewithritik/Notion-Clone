require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');
const http = require('http');
const { initCollection } = require('./services/qdrant.service');

// Import routes (to be created)
const authRoutes = require('./api/routes/auth.routes');
const workspaceRoutes = require('./api/routes/workspace.routes');
const pageRoutes = require('./api/routes/page.routes');
const templateRoutes = require('./api/routes/template.routes');

const app = express();
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/templates', templateRoutes);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  // TODO: Implement WebSocket authentication and cursor sync
  console.log('New WebSocket connection');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {dbName: "notion"})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Qdrant collection
initCollection()
  .then(() => console.log('Qdrant collection initialized'))
  .catch(err => console.error('Qdrant initialization error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
}); 