import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class MemberResignationDto {
  @IsBoolean({ message: 'Invalid resignation option' })
  isResigned: boolean

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: 'Description should be less than 1000 characters',
  })
  resignationReason: string
}
