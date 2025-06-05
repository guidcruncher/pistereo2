import { Injectable, OnModuleDestroy, Scope } from '@nestjs/common'
import * as net from 'net'

@Injectable({ scope: Scope.DEFAULT })
export class SocketCommunicatorService implements OnModuleDestroy {
  private socket: net.Socket

  constructor() {}

  public open(
    namespace: string,
    path: string,
    onError: (namespace, ev) => void,
    onResponse: (namespace, ev) => void,
  ) {
    this.socket = new net.Socket()
    this.socket.setEncoding('utf-8')
    this.socket.on('error', (error) => {
      onError(namespace, error)
    })
    this.socket.on('close', (state) => {})
    this.socket.on('data', (data) => {
      try {
        const json: any = JSON.parse(data.toString())
        const ev: any = { event: json, dispatched: new Date().toISOString() }
        onResponse(namespace, ev)
      } catch (err) {}
    })
    this.socket.connect({ path: path }, () => {})
  }

  public onModuleDestroy() {
    this.socket.destroy()
  }

  public async sendCommand(command: any) {
    const json = JSON.stringify(command)
    await this.socket.write(json, 'utf8', (res) => {})
  }
}
