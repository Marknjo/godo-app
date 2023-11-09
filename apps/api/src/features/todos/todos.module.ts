import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from './schema/todo.schema'
import { CategoriesModule } from '../categories/categories.module'
import { IconsModule } from '../icons/icons.module'

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
    CategoriesModule,
    IconsModule,
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
