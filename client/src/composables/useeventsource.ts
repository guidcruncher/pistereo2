import { on, emit, off } from './useeventbus'

export async function useEventSourceAsync(
  name: string,
  callback: (type: string, payload: any) => Promise<any>,
) {
  const evtSource = new EventSource('/api/ws/' + name)
  evtSource.onmessage = async (e) => {
    const ev = JSON.parse(e.data)
    await callback(`${ev.type}`, ev)
  }
  return evtSource
}

export function useEventSource(name: string, callback: (type: string, payload: any) => void) {
  const evtSource = new EventSource('/api/ws/' + name)
  evtSource.onmessage = (e) => {
    const ev = JSON.parse(e.data)
    callback(`${ev.type}`, ev)
  }
  return evtSource
}
