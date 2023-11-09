import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ToggleProjectStatusDto } from './dto/toggle-project-status.dto'

@Injectable()
export class ProjectsService {
  private readonly logger: LoggerService = new Logger(ProjectsService.name)

  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new Project'
  }

  findAll() {
    return `This action returns all Projects`
  }

  findOne(ProjectId: string) {
    return `This action returns a #${ProjectId} Project`
  }

  update(
    ProjectId: string,
    updateProjectDto: Partial<UpdateProjectDto | ToggleProjectStatusDto>,
  ) {
    return `This action updates a #${ProjectId} Project`
  }

  toggleStatus(ProjectId: string, toggleStatusDto: ToggleProjectStatusDto) {
    return `toggleStatus`
  }

  remove(ProjectId: string) {
    return `This action removes a #${ProjectId} Project`
  }
}
