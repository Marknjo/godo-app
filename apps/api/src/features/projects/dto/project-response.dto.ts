import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'
import { EProjectStages } from '../enums/e-project-stages.enum'
import { Expose, Transform, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { EProjectTypes } from '../enums/e-project-types.enum'
import { EProjectTypeBehavior } from '../enums/e-project-type-behavior.enum'

export class SlimProjectResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string
}

export class ProjectResponseBaseDto extends DefaultResponseDto {
  @Expose()
  title: string

  @Expose()
  projectType?: EProjectTypes

  @Expose()
  projectTypeBehavior?: EProjectTypeBehavior

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
  totalSubProjects: number

  @Expose()
  totalProjectTodos: number

  @Expose()
  endAt?: string

  @Expose()
  startAt?: string

  @Expose()
  @Type(() => SlimProjectResponseDto)
  dependsOn?: SlimProjectResponseDto
}

export class ProjectResponseDto extends ProjectResponseBaseDto {
  @Expose()
  @Type(() => SlimProjectResponseDto)
  rootParentId?: SlimProjectResponseDto

  @Expose()
  @Type(() => SlimProjectResponseDto)
  subParentId?: SlimProjectResponseDto
}

export class ProjectResponseIdsUnSerializedDto extends ProjectResponseBaseDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  rootParentId?: string

  @Expose()
  @Transform(({ value }) => value?.toString())
  subParentId?: string
}
