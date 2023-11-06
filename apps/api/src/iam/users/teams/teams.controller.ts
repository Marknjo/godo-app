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
import { TeamsService } from './teams.service'
import { CreateTeamDto } from '../dto/teams/create-team.dto'
import { UpdateTeamDto } from '../dto/teams/update-team.dto'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { FilterQuery } from 'mongoose'
import { Team } from '../schema/team.schema'
import { MemberResignationDto } from '../dto/teams/member-resignation.dto'
import { DisableMemberStatusDto } from '../dto/teams/disable-member-status.dto'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { TeamResponseDto } from '../dto/teams/team-response.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import {
  eAllMembersMap,
  eManagerMembersMap,
  ePremiumSubscribers,
} from 'src/iam/enums/e-roles.enum'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'

@Serialize(TeamResponseDto)
@RestrictToRole(...ePremiumSubscribers, ...eManagerMembersMap)
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'teams',
  version: '1',
})
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.teamsService.create(createTeamDto, activeUser)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Get()
  findAll(
    @ActiveUser() activeUser: IActiveUser,
    filters: FilterQuery<Team> = {},
  ) {
    return this.teamsService.findAll(activeUser, filters)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Get(':teamId')
  findOne(
    @Param('teamId', PerseMongoIdPipe) teamId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.teamsService.findOne(teamId, activeUser)
  }

  @Patch(':teamId')
  update(
    @Param('teamId', PerseMongoIdPipe) teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.teamsService.update(teamId, updateTeamDto, activeUser)
  }

  @Get('/disable/:teamId/member/:memberId')
  disable(
    @Param('teamId', PerseMongoIdPipe) teamId: string,
    @Param('memberId', PerseMongoIdPipe) memberId: string,
    @Query('disable') disable: DisableMemberStatusDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.teamsService.disable(teamId, disable, activeUser, memberId)
  }

  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @Patch(':teamId/resign/:memberId')
  resign(
    @Param('teamId', PerseMongoIdPipe) teamId: string,
    @Param('memberId', PerseMongoIdPipe) memberId: string,
    @Body() resignDto: MemberResignationDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.teamsService.resign(teamId, memberId, resignDto, activeUser)
  }

  @Delete(':teamId')
  remove(
    @Param('teamId', PerseMongoIdPipe) teamId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.teamsService.remove(teamId, activeUser)
  }
}
