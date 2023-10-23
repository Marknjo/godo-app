import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { IActiveUser } from '../interfaces/i-active-user'
import { TUserDoc, User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<TUserDoc>,
  ) {}

  async create(createUserDto: CreateUserDto, activeUser: IActiveUser) {
    return 'This action adds a new user'
  }

  async findAll(activeUser: IActiveUser) {
    return `This action returns all users`
  }

  async findOne(userId: string, activeUser: IActiveUser) {
    return `This action returns a #${userId} user`
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${userId} user`
  }

  async remove(userId: string, activeUser: IActiveUser) {
    return `This action removes a #${userId} user`
  }
}
