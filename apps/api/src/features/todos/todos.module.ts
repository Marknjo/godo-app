import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from './schema/todo.schema'
import { IconsModule } from '../icons/icons.module'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { SubTodosModule } from '../sub-todos/sub-todos.module'
import { ProjectsModule } from '../projects/projects.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Todo.name,
        useFactory: () => {
          const schema = TodoSchema

          return schema
        },
      },
    ]),
    SubTodosModule,
    IconsModule,
    ProjectsModule,
  ],
  controllers: [TodosController],
  providers: [TodosService, FactoryUtils],
})
export class TodosModule {}
