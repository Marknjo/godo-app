import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { EAuthTypes } from '../enums/e-auth-types.enum'
import { AccessTokenGuard } from './access-token.guard'
import { Reflector } from '@nestjs/core'
import { AUTH_KEY } from '../decorators/auth.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly defaultAuthType = EAuthTypes.NONE

  private readonly authTypesGuardMap: Record<
    EAuthTypes,
    CanActivate | CanActivate[]
  > = {
    [EAuthTypes.BEARER]: this.accessTokenGuard,
    [EAuthTypes.NONE]: {
      canActivate: () => Promise.resolve(true),
    },
    [EAuthTypes.API]: {
      canActivate: () => Promise.resolve(true),
    },
  }

  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,

    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // extract auth type(s) from the decorator
    const authTypes = this.reflector.getAllAndOverride<Array<EAuthTypes>>(
      AUTH_KEY,
      [context.getHandler(), context.getClass()],
    ) || [this.defaultAuthType]

    const guards = authTypes.flatMap(
      authType => this.authTypesGuardMap[authType],
    )

    let error = new UnauthorizedException()

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch(err => {
        error = err
      })

      if (canActivate) {
        return true
      }
    }

    throw error
  }
}
