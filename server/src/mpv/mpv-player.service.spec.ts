import { Test, TestingModule } from '@nestjs/testing'

import { MpvPlayerService } from './mpv-player.service'

describe('MpvPlayerService', () => {
  let service: MpvPlayerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MpvPlayerService],
    }).compile()

    service = module.get<MpvPlayerService>(MpvPlayerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
