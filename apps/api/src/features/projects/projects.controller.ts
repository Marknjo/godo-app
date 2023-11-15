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
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ToggleProjectStatusDto } from './dto/toggle-project-status.dto'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { ProjectResponseDto } from './dto/project-response.dto'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import { eAllMembersMap, ePremiumSubscribers } from 'src/iam/enums/e-roles.enum'
import { FilterQuery } from 'mongoose'
import { Project } from './schema/project.schema'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'

@Serialize(ProjectResponseDto)
@RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'Projects',
  version: '1',
})
export class ProjectsController {
  constructor(private readonly ProjectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.ProjectsService.create(createProjectDto, activeUser)
  }

  @Get()
  findAll(
    @Query() filters: FilterQuery<Project>,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.ProjectsService.findAll(filters, activeUser)
  }

  @Get(':projectId')
  findOne(
    @Param('projectId', PerseMongoIdPipe) projectId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.ProjectsService.findOne(projectId, activeUser)
  }

  @Patch(':projectId')
  update(
    @Param('projectId', PerseMongoIdPipe) projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.ProjectsService.update(projectId, updateProjectDto, activeUser)
  }

  @Patch(':projectId')
  toggleStatus(
    @Param('projectId', PerseMongoIdPipe) projectId: string,
    @Body() toggleStatusDto: ToggleProjectStatusDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.ProjectsService.toggleStatus(
      projectId,
      toggleStatusDto,
      activeUser,
    )
  }

  @Delete(':projectId')
  remove(
    @Param('projectId', PerseMongoIdPipe) projectId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.ProjectsService.remove(projectId, activeUser)
  }
}
