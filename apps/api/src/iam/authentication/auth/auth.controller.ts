import { Body, Controller, Post, Req } from '@nestjs/common'
import { SignUpDto } from './dtos/sign-up.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { AuthService } from './auth.service'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { AuthResponseDto } from './dtos/auth-response.dto'
import { Request } from 'express'

@Serialize(AuthResponseDto)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('signin/:dynamic/:more')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }
}
