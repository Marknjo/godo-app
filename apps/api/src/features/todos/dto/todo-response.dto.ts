import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimProjectResponseDto } from 'src/features/projects/dto/project-response.dto'
import { EProjectStages } from 'src/features/projects/enums/e-project-stages.enum'
import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'
import { SlimUserResponseDto } from 'src/iam/users/dto/user-response.dto'

export class SlimTodoResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  progressStage?: string | EProjectStages

  @Expose()
  startAt?: Date

  @Expose()
  endAt?: Date

  @Expose()
  isEnabled: boolean
}

export class TodoResponseDto extends DefaultResponseDto {
  @Expose()
  title: string

  @Expose()
  description?: string

  @Expose()
  progressStage?: string | EProjectStages

  @Expose()
  startAt?: Date

  @Expose()
  endAt?: Date

  @Expose()
  @Type(() => SlimUserResponseDto)
  userId: SlimUserResponseDto

  @Expose()
  @Type(() => SlimProjectResponseDto)
  projectId?: SlimProjectResponseDto

  @Expose()
  @Type(() => SlimIconResponseDto)
  iconId?: SlimIconResponseDto

  @Expose()
  isEnabled: boolean

  @Expose()
  @Type(() => SlimTodoResponseDto)
  dependsOn?: SlimTodoResponseDto
}
