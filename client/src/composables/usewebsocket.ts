import { on, emit, off } from './useeventbus'

export async function useWebsocketAsync(
  name: string,
  callback: (type: string, payload: any) => Promise<any>,
) {
  let url = `ws://${window.location.hostname}/api/ws/${name}`
  const socket = new WebSocket(url)
  socket.onopen = async (e) => {}
  socket.onmessage = async (e) => {
    const ev = JSON.parse(e.data)
    await callback(`${ev.type}`, ev)
  }
  return socket
}

export function useWebsocket(name: string, callback: (type: string, payload: any) => void) {
  let url = `ws://${window.location.hostname}/api/ws/${name}`
  const socket = new WebSocket(url)
  socket.onopen = (e) => {}
  socket.onmessage = (e) => {
    const ev = JSON.parse(e.data)
    callback(`${ev.type}`, ev)
  }
  return socket
}
