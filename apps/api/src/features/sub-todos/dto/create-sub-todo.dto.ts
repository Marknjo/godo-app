import { IsMongoId, IsOptional } from 'class-validator'
import { Todo } from 'src/features/todos/schema/todo.schema'

export class CreateSubTodoDto {
  @IsMongoId()
  subTodo: Todo

  @IsMongoId()
  parentId: Todo

  @IsOptional()
  @IsMongoId()
  subParentId?: Todo
}
