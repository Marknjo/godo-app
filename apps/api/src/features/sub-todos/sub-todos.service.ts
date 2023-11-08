import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'

@Injectable()
export class SubTodosService {
  private readonly logger: LoggerService = new Logger(SubTodosService.name)

  create(createSubTodoDto: CreateSubTodoDto) {
    return 'This action adds a new subTodo'
  }

  findAll() {
    return `This action returns all subTodos`
  }

  findOne(subTodoId: string) {
    return `This action returns a #${subTodoId} subTodo`
  }

  update(subTodoId: string, updateSubTodoDto: UpdateSubTodoDto) {
    return `This action updates a #${subTodoId} subTodo`
  }

  remove(subTodoId: string) {
    return `This action removes a #${subTodoId} subTodo`
  }
}
