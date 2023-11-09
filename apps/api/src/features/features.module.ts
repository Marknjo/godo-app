import { Module } from '@nestjs/common'
import { ProjectsModule } from './projects/projects.module'
import { IconsModule } from './icons/icons.module'
import { SubTodosModule } from './sub-todos/sub-todos.module'
import { TodosModule } from './todos/todos.module'

@Module({
  imports: [ProjectsModule, IconsModule, SubTodosModule, TodosModule],
})
export class FeaturesModule {}
