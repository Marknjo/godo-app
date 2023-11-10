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
import { SubTodosService } from './sub-todos.service'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { SubTodoResponseDto } from './dto/sub-todo-response.dto'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import { eAllMembersMap, ePremiumSubscribers } from 'src/iam/enums/e-roles.enum'
import { FilterQuery } from 'mongoose'
import { SubTodo } from './schema/sub-todo.schema'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

@Serialize(SubTodoResponseDto)
@RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'sub-todos',
  version: '1',
})
export class SubTodosController {
  constructor(private readonly subTodosService: SubTodosService) {}

  @Post()
  create(
    @Body() createSubTodoDto: CreateSubTodoDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.subTodosService.create(createSubTodoDto, activeUser)
  }

  @Get()
  findAll(
    @Query() filters: FilterQuery<SubTodo>,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.subTodosService.findAll(filters, activeUser)
  }

  @Get(':subTodoId')
  findOne(
    @Param('subTodoId', PerseMongoIdPipe) subTodoId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.subTodosService.findOne(activeUser, { subTodoId })
  }

  @Patch(':subTodoId')
  update(
    @Param('subTodoId', PerseMongoIdPipe) subTodoId: string,
    @Body() updateSubTodoDto: UpdateSubTodoDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.subTodosService.update(updateSubTodoDto, activeUser, {
      subTodoId,
    })
  }

  @Delete(':subTodoId')
  remove(
    @Param('subTodoId', PerseMongoIdPipe) subTodoId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.subTodosService.remove(activeUser, {
      subTodoId,
    })
  }
}
