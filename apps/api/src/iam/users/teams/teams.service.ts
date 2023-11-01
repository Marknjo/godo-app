import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, PopulateOptions } from 'mongoose'

import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'

import { Team } from '../schema/team.schema'
import { TUserDoc } from '../schema/user.schema'

import { CreateTeamDto } from '../dto/teams/create-team.dto'
import { UpdateTeamDto } from '../dto/teams/update-team.dto'
import { MemberResignationDto } from '../dto/teams/member-resignation.dto'
import { DisableMemberStatusDto } from '../dto/teams/disable-member-status.dto'

@Injectable()
export class TeamsService {
  private readonly logger: LoggerService = new Logger(TeamsService.name)

  private readonly MAX_PREMIUM_TEAM = 12

  private readonly MAX_GUEST_TEAM = 3

  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<Team>,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createTeamDto: CreateTeamDto, activeUser: IActiveUser) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    const isManager = whoIs === activeUser?.memberId
    const baseRole = activeUser?.baseRole

    const isGuestOrPremiumAccountOwner =
      activeUser.baseRole === EPremiumSubscribers.GUEST_USER ||
      activeUser.baseRole === EPremiumSubscribers.PREMIUM_USER

    if (
      (isManager && baseRole !== EPremiumSubscribers.TEAM_USER) ||
      (isManager && baseRole !== EPremiumSubscribers.ADMIN) ||
      isGuestOrPremiumAccountOwner
    ) {
      const limits = {
        [EPremiumSubscribers.GUEST_USER]: this.MAX_GUEST_TEAM,
        [EPremiumSubscribers.PREMIUM_USER]: this.MAX_PREMIUM_TEAM,
      }
      // we handle limits

      if (limits[baseRole] >= activeUser.totalTeamMembers) {
        throw new UnprocessableEntityException(
          `You've hit a max limit of numbers you can add in your team with this account, ${baseRole}. Please upgrade your account if you would like to add more members in your team`,
        )
      }
    }

    let newMember = await this.teamModel.create(createTeamDto)

    newMember = await newMember.populate(this.populateConfigs())

    return newMember
  }

  findAll(activeUser: IActiveUser, filters?: FilterQuery<Team>) {
    // @TODO: implement pagination
    return this.teamModel
      .find({
        ...filters,
        accountOwner: activeUser.sub,
      })
      .populate(this.populateConfigs())
  }

  async findOne(
    teamId: string,
    activeUser: IActiveUser,
    filters: FilterQuery<
      Pick<Team, 'memberId' | 'isActive' | 'isResigned'>
    > = {},
  ) {
    let foundTeam = await this.teamModel.findOne({
      accountOwner: activeUser.sub,
      _id: teamId,
      ...filters,
    })

    if (!foundTeam) {
      const whoIs = this.factoryUtils.whoIs(activeUser)
      this.logger.warn(
        `User with id ${whoIs} failed to fetch a team member of id ${teamId} with filters ${JSON.stringify(
          filters,
        )}`,
      )

      throw new NotFoundException(`Requested team member not found!`)
    }

    foundTeam = await foundTeam.populate<{
      accountOwner: TUserDoc
      memberId: TUserDoc
    }>(this.populateConfigs())

    return foundTeam
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
