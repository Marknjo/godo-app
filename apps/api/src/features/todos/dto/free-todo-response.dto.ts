import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'

export class FreeTodoResponseDto extends DefaultResponseDto {
  @Expose()
  title: string

  @Expose()
  description?: string

  @Expose()
  startAt?: string

  @Expose()
  endAt?: string

  @Expose()
  @Type(() => SlimIconResponseDto)
  iconId?: SlimIconResponseDto

  @Expose()
  isEnabled: boolean
}
