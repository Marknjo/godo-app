import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimRoleResponseDto } from 'src/iam/authorization/roles/dto/role-response.dto'

export class UserResponseDto extends DefaultResponseDto {
  @Expose()
  email: string

  @Expose()
  @Type(() => SlimRoleResponseDto)
  role: SlimRoleResponseDto[]

  @Expose()
  username: string

  @Expose()
  profileImg: string

  @Expose()
  bio?: string
}

export class SlimUserResponseDto {
  @Expose()
  id: string

  @Expose()
  email: string
}

export class BasicUserInfoResponseDto extends SlimUserResponseDto {
  @Expose()
  profileImg: string
}
