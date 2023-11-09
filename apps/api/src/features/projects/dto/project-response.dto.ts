import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'
import { EProjectStages } from '../enums/e-project-stages.enum'
import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'

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
}

export class SlimProjectResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  stages?: Array<EProjectStages | string>
}
