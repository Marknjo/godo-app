import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.ProjectsService.create(createProjectDto)
  }

  @Get()
  findAll() {
    return this.ProjectsService.findAll()
  }

  @Get(':ProjectId')
  findOne(@Param('ProjectId', PerseMongoIdPipe) ProjectId: string) {
    return this.ProjectsService.findOne(ProjectId)
  }

  @Patch(':ProjectId')
  update(
    @Param('ProjectId', PerseMongoIdPipe) ProjectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.ProjectsService.update(ProjectId, updateProjectDto)
  }

  @Patch(':ProjectId')
  toggleStatus(
    @Param('ProjectId', PerseMongoIdPipe) ProjectId: string,
    @Body() toggleStatusDto: ToggleProjectStatusDto,
  ) {
    return this.ProjectsService.toggleStatus(ProjectId, toggleStatusDto)
  }

  @Delete(':ProjectId')
  remove(@Param('ProjectId', PerseMongoIdPipe) ProjectId: string) {
    return this.ProjectsService.remove(ProjectId)
  }
}
