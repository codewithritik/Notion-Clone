import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from './components/ui/button'
import Editor from './components/editor/Editor'
import WorkspaceNav from './components/WorkspaceNav'
import CreateWorkspaceForm from './components/CreateWorkspaceForm'
import { socketService } from './lib/socket'
import { apiService } from './lib/api'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main app content
const AppContent = () => {
  const [content, setContent] = useState({
    title: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'page title'
            }
          ]
        }
      ]
    },
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Start writing here...'
            }
          ]
        }
      ]
    }
  })
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [pageId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    // Connect to WebSocket
    const token = localStorage.getItem('token')
    if (token) {
      const socket = socketService.connect(pageId, token)
      
      socket.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      // Load initial page content
      loadPageContent()

      return () => {
        socketService.disconnect()
      }
    }
  }, [pageId])

  const loadPageContent = async () => {
    try {
      const page = await apiService.getPage(pageId)
      if (page?.content) {
        setContent(page.content)
      }
    } catch (error) {
      console.error('Failed to load page:', error)
    }
  }

  const handleContentChange = async (newContent) => {
    setContent(newContent)
    try {
      await apiService.updatePage(pageId, { content: newContent })
    } catch (error) {
      console.error('Failed to update page:', error)
    }
  }

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace)
    // TODO: Load workspace pages and handle workspace switching
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary">
      <header className="border-b border-border-color p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Notion Clone</h1>
          <div className="flex items-center gap-4">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`} />
            <span className="text-sm text-gray-400">{user?.email}</span>
            <Button variant="secondary" onClick={logout}>Logout</Button>
            <Button variant="secondary">Share</Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <WorkspaceNav onWorkspaceSelect={handleWorkspaceSelect} />
        <main className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {selectedWorkspace ? (
              <Editor content={content} onChange={handleContentChange} />
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Select a workspace to start editing
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Root App component with routing
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/create-workspace"
            element={
              <ProtectedRoute>
                <CreateWorkspaceForm />
              </ProtectedRoute>
            }
          />
           <Route
            path="/workspace/:workspaceId"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:workspaceId/page/:pageId"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App 