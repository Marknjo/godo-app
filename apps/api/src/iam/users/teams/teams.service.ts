import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CreateTeamDto } from '../dto/teams/create-team.dto'
import { UpdateTeamDto } from '../dto/teams/update-team.dto'
import { FilterQuery, Model, PopulateOptions } from 'mongoose'
import { Team } from '../schema/team.schema'
import { UsersService } from '../users.service'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { MemberResignationDto } from '../dto/teams/member-resignation.dto'
import { DisableMemberStatusDto } from '../dto/teams/disable-member-status.dto'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { InjectModel } from '@nestjs/mongoose'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'
import { TUserDoc } from '../schema/user.schema'

@Injectable()
export class TeamsService {
  private readonly logger: LoggerService = new Logger(TeamsService.name)

  private readonly MAX_PREMIUM_TEAM = 12

  private readonly MAX_GUEST_TEAM = 3

  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<Team>,

    private readonly userService: UsersService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createTeamDto: CreateTeamDto, activeUser: IActiveUser) {
    return 'create'
  }

  findAll(activeUser: IActiveUser, filters?: FilterQuery<Team>) {
    return 'find all'
  }

  async findOne(
    teamId: string,
    activeUser: IActiveUser,
    filters: FilterQuery<
      Pick<Team, 'memberId' | 'isActive' | 'isResigned'>
    > = {},
  ) {
    return 'find one'
  }

  async update(
    teamId: string,
    updateTeamDto: Partial<
      UpdateTeamDto | DisableMemberStatusDto | MemberResignationDto
    >,
    activeUser: IActiveUser,
    filters: FilterQuery<Team> = {},
  ) {
    return 'update'
  }

  async disable(
    teamId: string,
    disable: DisableMemberStatusDto,
    activeUser: IActiveUser,
    memberId: string,
  ) {
    return 'disable'
  }

  async resign(
    teamId: string,
    memberId: string,
    resignDto: MemberResignationDto,
    activeUser: IActiveUser,
  ) {
    return 'resign'
  }

  async remove(teamId: string, activeUser: IActiveUser) {
    return 'remove/delete'
  }

  /**
   * ----------------------------------------
   *              HELPERS
   * ----------------------------------------
   */

  /**
   * Helper method that returns teams populate fields for
   * account owner & member id relations
   * @returns
   */
  private populateConfigs(): PopulateOptions[] {
    return [
      {
        path: 'accountOwner',
        select: 'id email',
      },
      {
        path: 'memberId',
        select: 'id email',
      },
    ]
  }
}
