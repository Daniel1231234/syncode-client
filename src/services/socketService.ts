import io from 'socket.io-client'


const socketIoServerUrl = import.meta.env.MODE === 'development' ? 'http://localhost:3001/' : ''

export const socketService = createSocketService()

// for debugging from console
// window.socketService = socketService
socketService.setup()

function createSocketService() {
  var socket: any = null
  const socketService = {
    setup() {
      socket = io(socketIoServerUrl)
    },
    on(eventName: string, cb: Function) {
      socket.on(eventName, cb)
    },
    off(eventName: string, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName: string, data: any) {
      data = JSON.parse(JSON.stringify(data))
      socket.emit(eventName, data)
    },
  }
  return socketService
}