import { IsMongoId } from 'class-validator'
import { Todo } from 'src/features/todos/schema/todo.schema'

export class CreateSubTodoDto {
  @IsMongoId()
  todoId: Todo

  @IsMongoId()
  subTodoId: Todo
}
