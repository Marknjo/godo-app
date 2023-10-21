import { Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Match } from 'src/common/validators/match.validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  @Transform(({ value }) => value.trim())
  username: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  @Transform(({ value }) => value.trim())
  email: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Password must not exceed 255 characters' })
  @MinLength(6, { message: 'Password should be greater than 6 character' })
  @Transform(({ value }) => value.trim())
  password: string

  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Password do not match' })
  passwordConfirm: string

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Bio must not exceed 1000 characters' })
  @Transform(({ value }) => value.trim())
  bio?: string

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  profileImg?: string
}
