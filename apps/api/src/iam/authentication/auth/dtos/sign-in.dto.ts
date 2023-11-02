import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator'

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  @Transform(({ value }) => value.trim())
  email: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Password must not exceed 255 characters' })
  @MinLength(8, { message: 'Password should be greater than 6 character' })
  @IsStrongPassword()
  @Transform(({ value }) => value.trim())
  password: string
}
