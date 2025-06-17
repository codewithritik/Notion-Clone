import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Box, IconButton, TextField } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import { apiService } from '../lib/api'
import Editor from './editor/Editor'
import PageHistory from './PageHistory'

const PageEditor = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: ''
          }
        ]
      }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const navigate = useNavigate()
  const { workspaceId, pageId } = useParams()

  useEffect(() => {
    if (pageId) {
      loadPage()
    }
  }, [pageId])

  const loadPage = async () => {
    try {
      setLoading(true)
      const page = await apiService.getPage(pageId)
      if (page) {
        setTitle(page.title || '')
        if (page.content) {
          setContent(page.content)
        }
      }
    } catch (error) {
      console.error('Failed to load page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (pageId) {
        await apiService.updatePage(pageId, { title, content })
      } else {
        const newPage = await apiService.createPage({
          workspaceId,
          title,
          content
        })
        navigate(`/workspace/${workspaceId}/page/${newPage._id}`)
      }
    } catch (error) {
      console.error('Failed to save page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (newContent) => {
    setContent(newContent)
  }

  const handleVersionRestore = () => {
    loadPage()
    setShowHistory(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ position: 'relative', p: 3 }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        {pageId && (
          <IconButton 
            onClick={() => setShowHistory(!showHistory)}
            color={showHistory ? 'primary' : 'default'}
          >
            <HistoryIcon />
          </IconButton>
        )}
      </Box>
      
      {showHistory ? (
        <PageHistory 
          pageId={pageId} 
          onVersionRestore={handleVersionRestore}
        />
      ) : (
        <>
          <TextField
            fullWidth
            variant="standard"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            sx={{ mb: 3 }}
            InputProps={{
              style: { fontSize: '2rem', fontWeight: 'bold' }
            }}
          />
          <Editor
            content={content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        </>
      )}
    </Box>
  )
}

export default PageEditor 