import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'
import { EProjectStages } from '../enums/e-project-stages.enum'
import { Expose, Transform, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'

export class SlimProjectResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  stages?: Array<EProjectStages | string>

  @Expose()
  progressStage?: EProjectStages | string

  @Expose()
  @Transform(({ value }) => value?.toString())
  rootParentId?: string

  @Expose()
  @Transform(({ value }) => value?.toString())
  subParentId?: string

  @Expose()
  totalSubProjects: number

  @Expose()
  totalProjectTodos: number

  @Expose()
  @Type(() => SlimProjectResponseDto)
  dependsOn?: SlimProjectResponseDto

  @Expose()
  endAt?: string

  @Expose()
  startAt?: string
}

export class ProjectResponseDto extends DefaultResponseDto {
  @Expose()
  title: string

  @Expose()
  description?: string

  @Expose()
  stages?: Array<EProjectStages | string>

  @Type(() => SlimIconResponseDto)
  iconsId?: SlimIconResponseDto

  @Expose()
  isEnabled: boolean

  @Expose()
  progressStage?: EProjectStages | string

  @Expose()
  @Type(() => SlimProjectResponseDto)
  rootParentId?: SlimProjectResponseDto

  @Expose()
  @Type(() => SlimProjectResponseDto)
  subParentId?: SlimProjectResponseDto

  @Expose()
  @Type(() => SlimProjectResponseDto)
  dependsOn?: SlimProjectResponseDto

  @Expose()
  totalSubProjects: number

  @Expose()
  totalProjectTodos: number

  @Expose()
  endAt?: string

  @Expose()
  startAt?: string
}
