import { Test, TestingModule } from '@nestjs/testing'

import { SocketCommunicatorService } from './socket-communicator.service'

describe('SocketCommunicatorService', () => {
  let service: SocketCommunicatorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketCommunicatorService],
    }).compile()

    service = module.get<SocketCommunicatorService>(SocketCommunicatorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
