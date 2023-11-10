import { Module } from '@nestjs/common'
import { SubTodosService } from './sub-todos.service'
import { SubTodosController } from './sub-todos.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { SubTodo, SubTodoSchema } from './schema/sub-todo.schema'
import { FactoryUtils } from 'src/common/services/factory.utils'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: SubTodo.name,
        useFactory: () => {
          const schema = SubTodoSchema

          return schema
        },
      },
    ]),
  ],
  controllers: [SubTodosController],
  providers: [SubTodosService, FactoryUtils],
  exports: [SubTodosService],
})
export class SubTodosModule {}
