import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { EAccessAuthTypes } from '../enums/e-access-auth-types.enum'
import { Reflector } from '@nestjs/core'
import { RoleAccessGuard } from './role-access.guard'
import { ACCESS_AUTH_KEY } from '../decorators/access-auth.decorator'

@Injectable()
export class AccessGuard implements CanActivate {
  private readonly defaultAccessType = EAccessAuthTypes.NONE

  private readonly accessTypeGuardMap: Record<
    EAccessAuthTypes,
    CanActivate | CanActivate[]
  > = {
    [EAccessAuthTypes.ROLE]: this.roleAccessGuard,
    [EAccessAuthTypes.NONE]: {
      canActivate: () => Promise.resolve(true),
    },
    [EAccessAuthTypes.PERMISSION]: {
      canActivate: () => Promise.resolve(true),
    },
  }

  constructor(
    private readonly reflector: Reflector,

    private readonly roleAccessGuard: RoleAccessGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessTypes = this.reflector.getAllAndOverride<EAccessAuthTypes[]>(
      ACCESS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    ) || [this.defaultAccessType]

    const guards = accessTypes.flatMap(type => this.accessTypeGuardMap[type])

    let error = new ForbiddenException()

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
