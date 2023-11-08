import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto)
  }

  @Get()
  findAll() {
    return this.todosService.findAll()
  }

  @Get(':todoId')
  findOne(@Param('todoId') todoId: string) {
    return this.todosService.findOne(todoId)
  }

  @Patch(':todoId')
  update(
    @Param('todoId') todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(todoId, updateTodoDto)
  }

  @Delete(':todoId')
  remove(@Param('todoId') todoId: string) {
    return this.todosService.remove(todoId)
  }
}
