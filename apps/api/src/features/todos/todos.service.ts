import { Injectable } from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Injectable()
export class TodosService {
  create(createTodoDto: CreateTodoDto) {
    return 'This action adds a new todo'
  }

  findAll() {
    return `This action returns all todos`
  }

  findOne(todoId: string) {
    return `This action returns a #${todoId} todo`
  }

  update(todoId: string, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${todoId} todo`
  }

  remove(todoId: string) {
    return `This action removes a #${todoId} todo`
  }
}
