import { Injectable } from '@nestjs/common'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'

@Injectable()
export class SubTodosService {
  create(createSubTodoDto: CreateSubTodoDto) {
    return 'This action adds a new subTodo'
  }

  findAll() {
    return `This action returns all subTodos`
  }

  findOne(id: number) {
    return `This action returns a #${id} subTodo`
  }

  update(id: number, updateSubTodoDto: UpdateSubTodoDto) {
    return `This action updates a #${id} subTodo`
  }

  remove(id: number) {
    return `This action removes a #${id} subTodo`
  }
}
