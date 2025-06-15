# Notion Clone

A modern document management system built with React, Node.js, and MongoDB.


## 🚀 Features

### 📝 Document Workspace
- Rich text editor with markdown shortcuts (TipTap/Slate)
- Hierarchical page structure (parent-child)
- Drag-and-drop organization
- Real-time collaboration (WebSockets)
- Page templates (meeting notes, project docs)
- Version history & restore

### 🤖 AI Enhancements
- **Auto-Linking**: Detects and suggests links to similar pages using embeddings
- **Auto Tag Generator**: Extracts semantic tags for content filtering
- **Semantic Q&A**: Ask natural language questions and get context-based answers
- **AI Chat Assistant**: Sidebar chatbot aware of the current page context
- **Knowledge Graph**: Interactive visualization of how all your pages are connected

---

## Tech Stack

- **Frontend**: React + Vite, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Rich Text Editor**: TipTap

## Project Structure

```
notion-clone/
├── client/             # Frontend React application
├── server/             # Backend Node.js application
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd notion-clone
```

2. Install dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables
```bash
# In the server directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notion-clone
JWT_SECRET=your_jwt_secret
```

## License

MIT "# Notion-Clone" 
