import { Injectable, Inject } from '@nestjs/common'
import { EventEmitterReadinessWatcher, EventEmitter2 } from '@nestjs/event-emitter'
import { BaseService } from './base.service'

@Injectable()
export class EventBaseService extends BaseService {
  @Inject()
  private readonly eventEmitter: EventEmitter2

  @Inject()
  private readonly eventEmitterReadinessWatcher: EventEmitterReadinessWatcher

  constructor() {
    super()
  }

  protected async emit(name: string, event: any) {
    await this.eventEmitterReadinessWatcher.waitUntilReady()
    let ev: any = event
    ev._emittedOn = new Date().toISOString()
    ev._sender = this.__caller()

    await this.eventEmitter.emit(name, ev)
  }
}
