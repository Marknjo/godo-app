import { Module } from '@nestjs/common'
import { CategoriesModule } from './categories/categories.module'
import { IconsModule } from './icons/icons.module'
import { SubTodosModule } from './sub-todos/sub-todos.module'
import { TodosModule } from './todos/todos.module'

@Module({
  imports: [CategoriesModule, IconsModule, SubTodosModule, TodosModule],
})
export class FeaturesModule {}
