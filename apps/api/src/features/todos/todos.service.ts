import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { ToggleTodoStatusDto } from './dto/toggle-todo-status.dto'
import { FreeUpdateTodoDto } from './dto/free-update-todo.dto'
import { CreateFreeTodoDto } from './dto/create-free-todo.dto'

@Injectable()
export class TodosService {
  private readonly logger: LoggerService = new Logger(TodosService.name)

  private readonly MAX_STANDARD_SUBSCRIBER_PROJECTS = 24

  createFree(createTodoDto: CreateFreeTodoDto) {
    return 'This action adds a new todo'
  }

  create(createTodoDto: CreateTodoDto) {
    return 'This action adds a new todo'
  }

  findAll() {
    return `This action returns all todos`
  }

  findOne(todoId: string) {
    return `This action returns a #${todoId} todo`
  }

  update(
    todoId: string,
    updateTodoDto: Partial<UpdateTodoDto | ToggleTodoStatusDto>,
  ) {
    return `This action updates a #${todoId} todo`
  }

  updateFree(
    todoId: string,
    updateTodoDto: Partial<FreeUpdateTodoDto | ToggleTodoStatusDto>,
  ) {
    return `This action updates a #${todoId} todo`
  }

  toggleStatus(todoId: string, toggleStatusDto: ToggleTodoStatusDto) {
    return `toggleStatus`
  }

  remove(todoId: string) {
    return `This action removes a #${todoId} todo`
  }
}
