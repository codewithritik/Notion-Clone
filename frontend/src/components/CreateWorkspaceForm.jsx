import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { apiService } from '../lib/api'

const CreateWorkspaceForm = () => {
  const [workspaceName, setWorkspaceName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiService.createWorkspace({ name: workspaceName })
      navigate(`/workspace/${response._id}`)
    } catch (err) {
      setError('Failed to create workspace. Please try again.')
      console.error('Workspace creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2F3136]">
      <div className="w-full max-w-md p-8 bg-[#1E1F22] rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-6">Create Your Workspace</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workspaceName" className="block text-sm font-medium text-[#A0A0A0] mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-4 py-2 bg-[#2F3136] border border-[#3A3B3E] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0056F2]"
              placeholder="Enter workspace name"
              required
            />
          </div>

          {error && (
            <div className="text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            className="w-full bg-[#0056F2] text-white py-2 rounded-xl hover:bg-[#0046D2] transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Workspace'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreateWorkspaceForm 