import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { SignUpDto } from './dtos/sign-up.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { AuthService } from './auth.service'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { AuthResponseDto } from './dtos/auth-response.dto'
import { Request } from 'express'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ActiveUser } from '../decorators/active-user.decorator'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { SwitchedAccountDto } from './dtos/switched-account.dto'

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

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  // TODO: Implement authGuard
  @Serialize(SwitchedAccountDto)
  @Get('switch-account/:account-owner-id')
  switchAccount(
    @Param('account-owner-id', PerseMongoIdPipe) accountOwnerId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.authService.switchAccount(accountOwnerId, activeUser)
  }
}
