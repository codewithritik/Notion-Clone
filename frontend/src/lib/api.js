const API_URL = import.meta.env.VITE_API_URL

class ApiService {
  constructor() {
    this.baseUrl = API_URL
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  async signup(data) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async refreshToken() {
    return this.request('/api/auth/refresh', {
      method: 'POST',
    })
  }

  // Page endpoints
  async createPage(data) {
    return this.request('/api/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPage(pageId) {
    return this.request(`/api/pages/${pageId}`)
  }

  async updatePage(pageId, data) {
    return this.request(`/api/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getWorkspacePages(workspaceId) {
    return this.request(`/api/pages/workspace/${workspaceId}`)
  }

  async getPageTree() {
    return this.request('/api/pages/tree')
  }

  // Workspace endpoints
  async createWorkspace(data) {
    return this.request('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserWorkspaces() {
    return this.request('/api/workspaces')
  }

  async getWorkspaceById(workspaceId) {
    return this.request(`/api/workspaces/${workspaceId}`)
  }

  async updateWorkspace(workspaceId, data) {
    return this.request(`/api/workspaces/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteWorkspace(workspaceId) {
    return this.request(`/api/workspaces/${workspaceId}`, {
      method: 'DELETE',
    })
  }

  async getWorkspaceMembers(workspaceId) {
    return this.request(`/api/workspaces/${workspaceId}/members`)
  }

  async inviteToWorkspace(workspaceId, data) {
    return this.request(`/api/workspaces/${workspaceId}/invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Template endpoints
  async getTemplates() {
    return this.request('/api/templates')
  }

  // Version endpoints
  async getLatestVersion(pageId) {
    return this.request(`/api/versions/${pageId}/latest`)
  }

  async getPageHistory(pageId) {
    return this.request(`/api/pages/${pageId}/history`)
  }

  async restorePageVersion(pageId, versionId) {
    return this.request(`/api/pages/${pageId}/restore/${versionId}`, {
      method: 'POST'
    })
  }

  async restoreVersion(versionId) {
    return this.request(`/api/versions/${versionId}/restore`, {
      method: 'POST',
    })
  }

  async addTagToPage(pageId, tag) {
    const response = await this.request(`/api/pages/${pageId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag }),
    })
    return response
  }
}

export const apiService = new ApiService() 