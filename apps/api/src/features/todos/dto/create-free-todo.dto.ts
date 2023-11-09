import { PickType } from '@nestjs/swagger'

import { CreateTodoDto } from './create-todo.dto'

export class CreateFreeTodoDto extends PickType(CreateTodoDto, [
  'title',
  'description',
  'startAt',
  'endAt',
  'iconId',
]) {}
