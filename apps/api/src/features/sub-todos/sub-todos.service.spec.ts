import { Test, TestingModule } from '@nestjs/testing'
import { SubTodosService } from './sub-todos.service'

describe('SubTodosService', () => {
  let service: SubTodosService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubTodosService],
    }).compile()

    service = module.get<SubTodosService>(SubTodosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
