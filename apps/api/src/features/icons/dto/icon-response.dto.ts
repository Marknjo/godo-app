import { Expose } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'

export class IconResponseDto extends DefaultResponseDto {
  @Expose()
  slug: string

  @Expose()
  prettyName: string

  @Expose()
  description?: string

  @Expose()
  isEnabled?: boolean
}

export class SlimIconResponseDto {
  @Expose()
  id: string

  @Expose()
  slug: string

  @Expose()
  isEnabled?: boolean
}
