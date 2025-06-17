import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = false
  }

  connect(pageId, token) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(import.meta.env.VITE_API_URL, {
      path: '/ws',
      auth: {
        token,
      },
      query: {
        pageId,
      },
    })

    this.socket.on('connect', () => {
      this.connected = true
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      this.connected = false
      console.log('Socket disconnected')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  emitCursorPosition(position) {
    if (this.socket && this.connected) {
      this.socket.emit('cursor:move', position)
    }
  }

  onCursorMove(callback) {
    if (this.socket) {
      this.socket.on('cursor:move', callback)
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user:joined', callback)
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user:left', callback)
    }
  }
}

export const socketService = new SocketService() 