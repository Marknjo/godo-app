import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ACTIVE_USER_KEY } from 'src/iam/authentication/constants/active-user.constant'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import {
  RESTRICT_TO_ROLE_KEY,
  TRestrictToRole,
  TRestrictToRoleMemberOnlyTuple,
  TRestrictedToRoleMembersOnly,
} from '../decorators/restrict-to-role.decorator'
import {
  EMembers,
  EPremiumSubscribers,
  ERoles,
} from 'src/iam/enums/e-roles.enum'

@Injectable()
export class RoleAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()

    const activeUser = req[ACTIVE_USER_KEY] as IActiveUser

    // this user is admin - allow to pass
    if (activeUser.role === ERoles.ADMIN) {
      return true
    }

    // find restrictions - reflector - restrictToRole decorator
    const accessRoles = this.reflector.getAllAndOverride<TRestrictToRole[]>(
      RESTRICT_TO_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    )

    // users can pass through if the handler is whitelisted
    if (accessRoles.includes(EPremiumSubscribers.WHITELISTED)) {
      return true
    }

    // check if user is an account owner
    const canAccess = this.canAccountOwnerAccess(accessRoles, activeUser)

    // return success early
    if (canAccess && EPremiumSubscribers[activeUser.role.toUpperCase()]) {
      return true
    }

    // stop processing if user is premium but fails
    if (!canAccess && EPremiumSubscribers[activeUser.role.toUpperCase()])
      return false

    /// MEMBERS ONLY AREA
    const filterResults = this.filterMembersAccessRoles(accessRoles, activeUser)

    // fail early if no filters
    if (!filterResults) return false

    const members = filterResults as TRestrictedToRoleMembersOnly

    return this.canMemberAccess(members, activeUser)
  }

  /**
   * Filters account owners, as they are provided as string
   * of EPremiumSubscribers; convert the results to a set,
   * then checks if the set has the active user role
   *
   * @param accessRoles
   * @param activeUser
   * @returns
   */
  private canAccountOwnerAccess(
    accessRoles: TRestrictToRole[],
    activeUser: IActiveUser,
  ) {
    let accountOwners: Array<EPremiumSubscribers> = accessRoles.filter(
      access => typeof access === 'string',
    ) as Array<EPremiumSubscribers>

    if (accountOwners.length > 0) {
      const filteredAccesses = new Set(accountOwners)

      return filteredAccesses.has(activeUser.baseRole)
    }
    return true
  }

  /**
   * Checks if the filtered members accesses can be found in
   * the membersAccesses map object
   *
   * @param memberAccesses
   * @param activeUser
   * @returns
   */
  private canMemberAccess(
    memberAccesses: TRestrictedToRoleMembersOnly,
    activeUser: IActiveUser,
  ): boolean {
    const role = `${activeUser.role}#${activeUser.baseRole}` as EMembers

    return memberAccesses.get(role) === activeUser.baseRole
  }

  /**
   * Filter outs member tuples and create a map of the tuple
   *  -> key   - EMember
   *  -> value - EPremiumSubscribers
   *
   * Steps:
   *   - filter tuples of [EMember, EPremiumSubscribers],
   *     it becomes an array of [[EMember, EPremiumSubscribers],...]
   *     of members accesses tuples
   *   - convert the array of tuples to a map, new Map([[],...])
   *   - if the accessMap.size or the length of a map is 0 or for
   *     whatever reason the member role cannot be found from
   *     EMembers, return false as an error
   *   - lastly, if no error return the TRestrictedToRoleMembersOnly
   *
   * @param accessRoles
   * @param activeUser
   * @returns
   */
  private filterMembersAccessRoles(
    accessRoles: TRestrictToRole[],
    activeUser: IActiveUser,
  ): TRestrictedToRoleMembersOnly | boolean {
    let members = accessRoles.filter(
      access => typeof access !== 'string',
    ) as Array<TRestrictToRoleMemberOnlyTuple>

    const accessesMap = new Map(members) as TRestrictedToRoleMembersOnly

    if (accessesMap.size === 0 || !EMembers[activeUser.role]) return false

    return accessesMap
  }
}
