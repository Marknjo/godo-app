import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common'
import { ACTIVE_USER_KEY } from '../constants/active-user.constant'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { Request } from 'express'

export const ActiveUser = createParamDecorator(
  (_, ctx: ExecutionContext): IActiveUser => {
    const req = ctx.switchToHttp().getRequest<Request>()

    // to get something related current loggedIn user
    const activeUserDetails = req[ACTIVE_USER_KEY]

    if (!activeUserDetails) {
      throw new UnauthorizedException()
    }

    return activeUserDetails
  },
)
