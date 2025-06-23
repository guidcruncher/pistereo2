import { Test, TestingModule } from '@nestjs/testing'

import { TuneinPlayerService } from './tunein-player.service'

describe('TuneinPlayerService', () => {
  let service: TuneinPlayerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TuneinPlayerService],
    }).compile()

    service = module.get<TuneinPlayerService>(TuneinPlayerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
