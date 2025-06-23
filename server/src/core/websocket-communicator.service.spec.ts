import { Test, TestingModule } from '@nestjs/testing'

import { WebsocketCommunicatorService } from './websocket-communicator.service'

describe('WebsocketCommunicatorService', () => {
  let service: WebsocketCommunicatorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketCommunicatorService],
    }).compile()

    service = module.get<WebsocketCommunicatorService>(WebsocketCommunicatorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
