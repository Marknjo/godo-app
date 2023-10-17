import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { REQ_ACTIVE_USER } from '../constants/active-user.constant'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

export const ActiveUser = createParamDecorator(
  (_, ctx: ExecutionContext): IActiveUser => {
    const req = ctx.switchToHttp().getRequest()

    // to get something related current loggedIn user
    const activeUserDetails = req[REQ_ACTIVE_USER]

    return activeUserDetails
  },
)
