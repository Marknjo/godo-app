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
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ToggleTodoStatusDto } from './dto/toggle-todo-status.dto'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { TodoResponseDto } from './dto/todo-response.dto'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import {
  eAllMembersMap,
  eGeneralUsers,
  ePremiumSubscribers,
} from 'src/iam/enums/e-roles.enum'
import { CreateFreeTodoDto } from './dto/create-free-todo.dto'
import { FreeTodoResponseDto } from './dto/free-todo-response.dto'

@Serialize(TodoResponseDto)
@RestrictToRole(...eGeneralUsers, ...eAllMembersMap)
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'todos',
  version: '1',
})
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Serialize(FreeTodoResponseDto)
  @RestrictToRole()
  @Post()
  createFree(@Body() createTodoDto: CreateFreeTodoDto) {
    return this.todosService.createFree(createTodoDto)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Post('/premium')
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto)
  }

  @Get()
  findAll() {
    return this.todosService.findAll()
  }

  @Get(':todoId')
  findOne(@Param('todoId', PerseMongoIdPipe) todoId: string) {
    return this.todosService.findOne(todoId)
  }

  @Serialize(FreeTodoResponseDto)
  @Patch(':todoId')
  updateFree(
    @Param('todoId', PerseMongoIdPipe) todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.updateFree(todoId, updateTodoDto)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Patch(':todoId')
  update(
    @Param('todoId', PerseMongoIdPipe) todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(todoId, updateTodoDto)
  }

  @RestrictToRole(...eGeneralUsers, ...eAllMembersMap)
  @Patch(':todoId')
  toggleStatus(
    @Param('todoId', PerseMongoIdPipe) ProjectId: string,
    @Body() toggleStatusDto: ToggleTodoStatusDto,
  ) {
    return this.todosService.toggleStatus(ProjectId, toggleStatusDto)
  }

  @Delete(':todoId')
  remove(@Param('todoId', PerseMongoIdPipe) todoId: string) {
    return this.todosService.remove(todoId)
  }
}
