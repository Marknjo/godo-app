import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from './schema/todo.schema'
import { IconsModule } from '../icons/icons.module'
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
    ProjectsModule,
    IconsModule,
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
