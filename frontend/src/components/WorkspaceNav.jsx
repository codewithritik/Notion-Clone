import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { apiService } from '../lib/api'
import { Add as AddIcon } from '@mui/icons-material'

const WorkspaceNav = ({ onWorkspaceSelect }) => {
  const [workspaces, setWorkspaces] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  useEffect(() => {
    const fetchWorkspaceAndUpdateParams = async () => {
      try {
        const data = await apiService.getUserWorkspaces()
        setWorkspaces(data)
        
        // If no workspaceId in params and we have workspaces, use the first one
        if (!workspaceId && data.length > 0) {
          const firstWorkspaceId = data[0]._id
          navigate(`/workspace/${firstWorkspaceId}`)
        }
      } catch (error) {
        console.error('Failed to load workspaces:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaceAndUpdateParams()
  }, [workspaceId, navigate])

  useEffect(() => {
    if (workspaceId) {
      loadWorkspacePages()
    }
  }, [workspaceId])

  const loadWorkspacePages = async () => {
    try {
      const data = await apiService.getWorkspacePages(workspaceId)
      setPages(data)
    } catch (error) {
      console.error('Failed to load pages:', error)
    }
  }

  const handleCreateWorkspace = () => {
    navigate('/create-workspace')
  }

  const handleWorkspaceClick = async (workspaceId) => {
    try {
      // Create a new page in the workspace
      const newPage = await apiService.createPage({
        workspaceId: workspaceId,
        title: 'Untitled',
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
      });
      
      // Navigate to the new page
      navigate(`/workspace/${workspaceId}/page/${newPage._id}`);
      onWorkspaceSelect(workspaceId);
    } catch (error) {
      console.error('Failed to create new page:', error);
    }
  }

  const handlePageClick = (page) => {
    onWorkspaceSelect(workspaceId);
    navigate(`/workspace/${workspaceId}/page/${page._id}`)
  }

  if (loading) {
    return <div>Loading workspaces...</div>
  }

  return (
    <div className="w-64 border-r border-border-color h-screen p-4 flex flex-col">
      {/* <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Workspaces</h2>
      </div>
      <div className="flex-grow pt-5">
        {workspaces.map((workspace) => (
          <Button
            key={workspace._id}
            variant="ghost"
            className={`w-full justify-start ${
              workspaceId === workspace._id 
                ? 'border-2 border-blue-500 bg-blue-50' 
                : 'border border-transparent'
            }`}
            onClick={() => handleWorkspaceClick(workspace)}
          >
            {workspace.name}
          </Button>
        ))}
      </div> */}

      {workspaceId && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Pages</h2>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleWorkspaceClick(workspaceId)}
              size="small"
              className="text-gray-600 hover:bg-gray-50"
            >
              New Page
            </Button>
          </div>
          <div className="space-y-1">
            {pages.map((page) => (
              <Button
                key={page._id}
                variant="text"
                className="w-full justify-start text-left text-gray-600 hover:bg-gray-50 py-2 px-3 rounded-md transition-colors duration-150"
                onClick={() => handlePageClick(page)}
              >
                <div className="flex items-center">
                  <span className="text-sm">{page.title}</span>
                  {page.updatedBy && (
                    <span className="ml-2 text-xs text-gray-400">
                      • {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Button>
            ))}
            {pages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No pages yet. Create your first page!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkspaceNav 