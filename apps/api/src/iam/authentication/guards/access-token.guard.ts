import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { EAuthTypes } from '../enums/e-auth-types.enum'
import { JwtService } from '@nestjs/jwt'
import { AccessesService } from 'src/iam/authorization/accesses/accesses.service'
import { TAccessResponseDoc } from 'src/iam/authorization/accesses/types/t-access-response-doc.type'
import { ACTIVE_USER_KEY } from '../constants/active-user.constant'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'

/**
 *
 * - tokens
 *   1. From body extract from headers (use for now - temporarily)
 *   2. Cookies -> safest (in production apps)
 *
 * -> extract token
 * -> verify
 *    - if user has a token
 *       - if not unauthorized
 *    - if is a valid token
 *       - if not unauthorized
 *
 * -> Find this user from the database (subscriber or a member)
 *    1. find their accesses [if memberId is in token - we use to find accesses]
 *       - what is their role
 *    2. totalMembers
 *
 *    3. Attach user to the request: ACTIVE_USER_KEY -> active-use
 *      - get the nestjs request
 *      - req[key]
 *      - values: IActiveUser
 *        -  memberId if token has member id
 *        - baseRole if token has member id, will be for id, token we put in the token
 *
 *
 *
 */

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    private readonly accessesService: AccessesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()

    const token = this.extractToken(req)

    if (!token) {
      throw new UnauthorizedException()
    }

    // there is token - verify token
    let payload: Partial<IActiveUser>

    try {
      payload = await this.jwtService.verifyAsync(token)
    } catch (error) {
      throw new UnauthorizedException()
    }

    if (!payload) {
      throw new UnauthorizedException()
    }

    // valid jwt payload - add active user to the request
    await this.addActiveUserToReq(payload, req)

    return true
  }

  /**
   * Fetches
   * @param payload
   * @param req
   */
  private async addActiveUserToReq(
    payload: Partial<IActiveUser>,
    req: Request,
  ) {
    const { sub, memberId } = payload

    const isMember = !!memberId

    let populatedAccessDoc: TAccessResponseDoc

    try {
      populatedAccessDoc = await this.accessesService.findOneHelper(true, {
        accountOwner: sub,
        assignedTo: isMember ? memberId : sub,
      })
    } catch (error) {
      throw new UnauthorizedException()
    }

    // prep active user payload
    const baseRole =
      populatedAccessDoc.baseRole as unknown as EPremiumSubscribers

    const { email, totalTeamMembers, totalProjects } =
      populatedAccessDoc.accountOwner

    const { name: role } = populatedAccessDoc.roleId

    const reqOptions = {
      sub,
      memberId,
      baseRole,
      email,
      role,
      totalTeamMembers,
      totalProjects,
    } as IActiveUser

    req[ACTIVE_USER_KEY] = reqOptions
  }

  /**
   * Token extractor from the request object
   * @param context
   * @returns
   */
  extractToken(req: Request) {
    // @TODO: also try to get token from cookies
    const authToken = req.headers?.authorization

    if (!authToken) {
      return false
    }

    const [bearer, token] = authToken.split(' ')

    if (bearer.toLowerCase() !== EAuthTypes.BEARER) {
      return false
    }

    return token
  }
}
