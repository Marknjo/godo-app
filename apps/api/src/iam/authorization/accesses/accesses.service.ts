import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { FactoryUtils } from 'src/common/services/factory.utils'
import { UsersService } from 'src/iam/users/users.service'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { Access } from './schema/access.schema'
import { RolesService } from '../roles/roles.service'

@Injectable()
export class AccessesService {
  private readonly logger: LoggerService = new Logger(AccessesService.name)

  constructor(
    @InjectModel(Access.name)
    private readonly accessesModel: Model<Access>,

    private readonly usersService: UsersService,

    private readonly rolesService: RolesService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  create(createAccessDto: CreateAccessDto, activeUser: IActiveUser) {
    return 'This action adds a new access'
  }

  findAll(activeUser: IActiveUser, filters?: FilterQuery<Access>) {
    return `This action returns all accesses ${activeUser}`
  }

  findOne(accessId: string, activeUser: IActiveUser) {
    return `This action returns a #${accessId} access`
  }

  update(
    accessId: string,
    updateAccessDto: UpdateAccessDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${accessId} access`
  }

  remove(accessId: string, activeUser: IActiveUser) {
    return `This action removes a #${accessId} access`
  }
}
