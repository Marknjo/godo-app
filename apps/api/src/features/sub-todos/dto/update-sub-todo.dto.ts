import { PartialType } from '@nestjs/swagger'
import { CreateSubTodoDto } from './create-sub-todo.dto'

export class UpdateSubTodoDto extends PartialType(CreateSubTodoDto) {}
