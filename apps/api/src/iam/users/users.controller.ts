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
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ActiveUser } from '../authentication/decorators/active-user.decorator'
import { IActiveUser } from '../interfaces/i-active-user'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { UserResponseDto } from './dto/user-response.dto'
import { EAuthTypes } from '../authentication/enums/e-auth-types.enum'
import { Auth } from '../authentication/decorators/auth.decorator'
import { AccessAuth } from '../authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from '../authorization/enums/e-access-auth-types.enum'
import {
  EMembers,
  EPremiumSubscribers,
  eAdminMembersMap,
  eAllMembersMap,
  eGeneralUsers,
} from '../enums/e-roles.enum'
import { RestrictToRole } from '../authorization/decorators/restrict-to-role.decorator'

@Serialize(UserResponseDto)
@RestrictToRole(EPremiumSubscribers.ADMIN, [
  EMembers.ADMIN_MANAGER,
  EPremiumSubscribers.ADMIN,
])
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @RestrictToRole(EPremiumSubscribers.ADMIN, ...eAdminMembersMap)
  @Get()
  findAll(@Query() filters: any, @ActiveUser() activeUser: IActiveUser) {
    return this.usersService.findAll(filters, activeUser)
  }

  @RestrictToRole(EPremiumSubscribers.ADMIN, ...eAdminMembersMap)
  @Get(':userId')
  findOne(
    @Param('userId') userId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.usersService.findOne(userId, activeUser)
  }

  @RestrictToRole(...eGeneralUsers, ...eAllMembersMap)
  @Get('profile/me')
  profile(@ActiveUser() activeUser: IActiveUser) {
    const userId = activeUser.sub
    return this.usersService.findOne(userId, activeUser)
  }

  @RestrictToRole(...eGeneralUsers, ...eAllMembersMap)
  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.usersService.update(userId, updateUserDto, activeUser)
  }

  @Delete(':userId')
  remove(
    @Param('userId') userId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.usersService.remove(userId, activeUser)
  }
}
