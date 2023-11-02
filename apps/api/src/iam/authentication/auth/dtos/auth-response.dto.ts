import { Expose } from 'class-transformer'
import { UserResponseDto } from 'src/iam/users/dto/user-response.dto'

export class AuthResponseDto extends UserResponseDto {
  @Expose()
  accessToken: string
}
