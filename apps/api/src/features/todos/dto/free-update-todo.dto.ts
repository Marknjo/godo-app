import { PartialType } from '@nestjs/swagger'
import { CreateFreeTodoDto } from './create-free-todo.dto'

export class FreeUpdateTodoDto extends PartialType(CreateFreeTodoDto) {}
