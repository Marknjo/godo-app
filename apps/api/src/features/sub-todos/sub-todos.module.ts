import { Module } from '@nestjs/common'
import { SubTodosService } from './sub-todos.service'
import { SubTodosController } from './sub-todos.controller'

@Module({
  controllers: [SubTodosController],
  providers: [SubTodosService],
})
export class SubTodosModule {}
