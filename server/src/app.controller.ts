import { Get, Delete, Query, Put, Body, Post } from '@nestjs/common'
import { Public } from '@auth/decorators'
import { Controller, MessageEvent, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MediaServerService } from './data/media-server.service'
import { MediaServer } from '@schemas/index'

@Public()
@Controller('/api/discovery')
export class AppController {
  constructor(private readonly deviceService: MediaServerService,
               private readonly eventEmitter: EventEmitter2,) {}

  @Post('/register')
  async register(@Body() data: any) {
    let device: any = await this.deviceService.find(data.id)

    if (!device) {
      device = new MediaServer()
    }

    device.ipAddress = data.ipAddress
    device.apiUrl = data.apiUrl
    device.hostname = data.hostname
    device.id = data.id
    device.lastHeartbeat = new Date()
    device.expiresAt = new Date(new Date().setDate(new Date().getDate() + 1))
    let res = await this.deviceService.saveDevice(device)

    this.eventEmitter.emit('ensuresocket', {
      type: 'register',
      device: data,
    })

    return res
  }

  @Get('/heartbeat')
  async heartbeat(@Query('id') id: string) {
    let device: any = await this.deviceService.find(id)
    if (device) {
      device.lastHeartbeat = new Date()
      device.expiresAt = new Date(new Date().setDate(new Date().getDate() + 1))
      return await this.deviceService.saveDevice(device)
    }

    return device
  }

  @Delete('/unregister')
  async unregister(@Query('id') id: string) {
    return await this.deviceService.delete(id)
  }
}
