import { SetMetadata } from '@nestjs/common'
import { EMembers, EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'

export const RESTRICT_TO_ROLE_KEY = 'RESTRICT_TO_ROLE_KEY'

export type TRestrictToRoleMemberOnlyTuple = [EMembers, EPremiumSubscribers]

export type TRestrictedToRoleMembersOnly = Map<EMembers, EPremiumSubscribers>

export type TRestrictToRole =
  | TRestrictToRoleMemberOnlyTuple
  | EPremiumSubscribers

export const RestrictToRole = (...roles: TRestrictToRole[]) =>
  SetMetadata(RESTRICT_TO_ROLE_KEY, roles)
