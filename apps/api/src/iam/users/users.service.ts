import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { IActiveUser } from '../interfaces/i-active-user'

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto, activeUser: IActiveUser) {
    return 'This action adds a new user'
  }

  findAll(activeUser: IActiveUser) {
    return `This action returns all users`
  }

  findOne(userId: string, activeUser: IActiveUser) {
    return `This action returns a #${userId} user`
  }

  update(
    userId: string,
    updateUserDto: UpdateUserDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${userId} user`
  }

  remove(userId: string, activeUser: IActiveUser) {
    return `This action removes a #${userId} user`
  }
}
