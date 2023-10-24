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

  @Get()
  findAll(@Query() filters: any, @ActiveUser() activeUser: IActiveUser) {
    return this.usersService.findAll(filters, activeUser)
  }

  @Get(':userId')
  findOne(
    @Param('userId') userId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.usersService.findOne(userId, activeUser)
  }

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
