import { Test, TestingModule } from '@nestjs/testing'
import { SubTodosController } from './sub-todos.controller'
import { SubTodosService } from './sub-todos.service'

describe('SubTodosController', () => {
  let controller: SubTodosController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubTodosController],
      providers: [SubTodosService],
    }).compile()

    controller = module.get<SubTodosController>(SubTodosController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
