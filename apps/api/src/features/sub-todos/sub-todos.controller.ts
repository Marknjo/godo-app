import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { SubTodosService } from './sub-todos.service'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'

@Controller('sub-todos')
export class SubTodosController {
  constructor(private readonly subTodosService: SubTodosService) {}

  @Post()
  create(@Body() createSubTodoDto: CreateSubTodoDto) {
    return this.subTodosService.create(createSubTodoDto)
  }

  @Get()
  findAll() {
    return this.subTodosService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subTodosService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubTodoDto: UpdateSubTodoDto) {
    return this.subTodosService.update(+id, updateSubTodoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subTodosService.remove(+id)
  }
}
