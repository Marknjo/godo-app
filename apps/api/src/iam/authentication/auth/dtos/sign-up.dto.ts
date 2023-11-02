import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Match } from 'src/common/validators/match.validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  @Transform(({ value }) => value.trim())
  username: string

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

  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Password do not match' })
  passwordConfirm: string
}
