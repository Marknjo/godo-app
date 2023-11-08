import { Type } from 'class-transformer'
import { SlimTodoResponseDto } from 'src/features/todos/dto/todo-response.dto'
import { SlimUserResponseDto } from 'src/iam/users/dto/user-response.dto'

export class SubTodoResponseDto {
  @Type(() => SlimTodoResponseDto)
  todoId: SlimTodoResponseDto

  @Type(() => SlimTodoResponseDto)
  subTodoId: SlimTodoResponseDto

  @Type(() => SlimUserResponseDto)
  userId: SlimUserResponseDto
}
