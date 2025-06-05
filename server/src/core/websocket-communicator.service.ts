import { Injectable, OnModuleDestroy, Scope } from '@nestjs/common'
import { WebSocket } from 'ws'

@Injectable({ scope: Scope.DEFAULT })
export class WebsocketCommunicatorService implements OnModuleDestroy {
  private socket: WebSocket

  constructor() {}

  public open(
    namespace: string,
    path: string,
    onError: (namespace, ev) => void,
    onResponse: (namespace, ev) => void,
  ) {
    this.socket = new WebSocket(path)

    this.socket.on('error', (error) => {
      onError(namespace, error)
    })

    this.socket.on('connect', () => {
      console.log('Connected to ' + path)
    })

    this.socket.on('message', (data) => {
      try {
        const json: any = JSON.parse(data.toString())
        const ev: any = { event: json, dispatched: new Date().toISOString() }
        onResponse(namespace, ev)
      } catch (err) {
        console.log('Error processing message ' + (data ?? ''), err)
      }
    })
  }

  public onModuleDestroy() {
    this.socket.destroy()
  }

  public async sendCommand(command: any) {
    const json = JSON.stringify(command)
    await this.socket.write(json, 'utf8', (res) => {})
  }
}
