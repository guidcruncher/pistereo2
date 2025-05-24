import { Test, TestingModule } from '@nestjs/testing'
import { UserStreamPlayerService } from './user-stream-player.service'

describe('UserStreamPlayerService', () => {
  let service: UserStreamPlayerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStreamPlayerService],
    }).compile()

    service = module.get<UserStreamPlayerService>(UserStreamPlayerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
