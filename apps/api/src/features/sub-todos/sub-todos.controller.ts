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
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'

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

  @Get(':subTodoId')
  findOne(@Param('subTodoId', PerseMongoIdPipe) subTodoId: string) {
    return this.subTodosService.findOne(subTodoId)
  }

  @Patch(':subTodoId')
  update(
    @Param('subTodoId', PerseMongoIdPipe) subTodoId: string,
    @Body() updateSubTodoDto: UpdateSubTodoDto,
  ) {
    return this.subTodosService.update(subTodoId, updateSubTodoDto)
  }

  @Delete(':subTodoId')
  remove(@Param('subTodoId', PerseMongoIdPipe) subTodoId: string) {
    return this.subTodosService.remove(subTodoId)
  }
}
