import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { SignUpDto } from './dtos/sign-up.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { AuthService } from './auth.service'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { AuthResponseDto } from './dtos/auth-response.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ActiveUser } from '../decorators/active-user.decorator'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { SwitchedAccountDto } from './dtos/switched-account.dto'
import { Auth } from '../decorators/auth.decorator'
import { EAuthTypes } from '../enums/e-auth-types.enum'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import { eAllMembersMap, ePremiumSubscribers } from 'src/iam/enums/e-roles.enum'

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
  @RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
  @AccessAuth(EAccessAuthTypes.ROLE)
  @Auth(EAuthTypes.BEARER)
  @Get('switch-account/:account-owner-id')
  switchAccount(
    @Param('account-owner-id', PerseMongoIdPipe) accountOwnerId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.authService.switchAccount(accountOwnerId, activeUser)
  }
}
