import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimUserResponseDto } from '../user-response.dto'

export class TeamResponseDto extends DefaultResponseDto {
  @Expose()
  @Type(() => SlimUserResponseDto)
  accountOwner: SlimUserResponseDto

  @Expose()
  @Type(() => SlimUserResponseDto)
  memberId: SlimUserResponseDto

  @Expose()
  description?: string

  @Expose()
  isResigned?: boolean

  @Expose()
  resignationReason?: string

  @Expose()
  isActive?: boolean
}

export class TeamSlimResponseDto {
  @Expose()
  @Type(() => SlimUserResponseDto)
  accountOwner: SlimUserResponseDto

  @Expose()
  @Type(() => SlimUserResponseDto)
  memberId: SlimUserResponseDto

  @Expose()
  isActive?: boolean
}
