import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { FilterQuery } from 'mongoose'
import { Todo } from './schema/todo.schema'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

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
  createFree(
    @Body() createTodoDto: CreateFreeTodoDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.createFree(createTodoDto, activeUser)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Post('/premium')
  create(
    @Body() createTodoDto: CreateTodoDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.create(createTodoDto, activeUser)
  }

  @Get()
  findAll(
    @Query() filters: FilterQuery<Todo> = {},
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.findAll(filters, activeUser)
  }

  @Get(':todoId')
  findOne(
    @Param('todoId', PerseMongoIdPipe) todoId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.findOne(todoId, activeUser)
  }

  @Serialize(FreeTodoResponseDto)
  @Patch(':todoId')
  updateFree(
    @Param('todoId', PerseMongoIdPipe) todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.updateFree(todoId, updateTodoDto, activeUser)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Patch(':todoId')
  update(
    @Param('todoId', PerseMongoIdPipe) todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.update(todoId, updateTodoDto, activeUser)
  }

  @RestrictToRole(...eGeneralUsers, ...eAllMembersMap)
  @Patch(':todoId')
  toggleStatus(
    @Param('todoId', PerseMongoIdPipe) projectId: string,
    @Body() toggleStatusDto: ToggleTodoStatusDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.toggleStatus(
      projectId,
      toggleStatusDto,
      activeUser,
    )
  }

  @Delete(':todoId')
  remove(
    @Param('todoId', PerseMongoIdPipe) todoId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.todosService.remove(todoId, activeUser)
  }
}
