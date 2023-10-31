import { IsBoolean } from 'class-validator'

export class DisableMemberStatusDto {
  @IsBoolean({ message: 'Invalid disable option' })
  disable: boolean
}
