import { TRestrictToRoleMemberOnlyTuple } from '../authorization/decorators/restrict-to-role.decorator'

export enum ERoles {
  // REGULARS USERS
  TEAM_USER = 'team_user',
  PREMIUM_USER = 'premium_user',
  GUEST_USER = 'guest_user',
  STANDARD_USER = 'standard_user',
  FREE_USER = 'free_user',

  // TEAMS
  MANAGER = 'manager',
  MEMBER = 'member',

  // ADMIN
  ADMIN = 'admin',
  ADMIN_MANAGER = 'admin_manager',
  ADMIN_ASSISTANT = 'admin_assistant',

  // WHITELISTING - handlers
  WHITELISTED = 'whitelisted',
}

export enum EPremiumSubscribers {
  TEAM_USER = ERoles.TEAM_USER,
  PREMIUM_USER = ERoles.PREMIUM_USER,
  GUEST_USER = ERoles.GUEST_USER,
  ADMIN = ERoles.ADMIN,
  WHITELISTED = ERoles.WHITELISTED,
}

/**
 * Ensures EMembers is unique across all subscribers
 * the value is constructed as -> MemberRole#SubscriberRole
 */
export enum EMembers {
  ADMIN_MANAGER = `${ERoles.ADMIN_MANAGER}#${ERoles.ADMIN}`,
  ADMIN_ASSISTANT = `${ERoles.ADMIN_ASSISTANT}#${ERoles.ADMIN}`,
  PREMIUM_MANAGER = `${ERoles.MANAGER}#${ERoles.PREMIUM_USER}`,
  PREMIUM_MEMBER = `${ERoles.MEMBER}#${ERoles.PREMIUM_USER}`,
  GUEST_MANAGER = `${ERoles.MANAGER}#${ERoles.GUEST_USER}`,
  GUEST_MEMBER = `${ERoles.MEMBER}#${ERoles.GUEST_USER}`,
  TEAM_MANAGER = `${ERoles.MANAGER}#${ERoles.TEAM_USER}`,
  TEAM_MEMBER = `${ERoles.MEMBER}#${ERoles.TEAM_USER}`,
}

export const ePremiumSubscribers = Object.values(EPremiumSubscribers)

export const eMembersMap: Array<TRestrictToRoleMemberOnlyTuple> = [
  [EMembers.ADMIN_MANAGER, EPremiumSubscribers.ADMIN],
  [EMembers.ADMIN_ASSISTANT, EPremiumSubscribers.ADMIN],
  [EMembers.PREMIUM_MANAGER, EPremiumSubscribers.PREMIUM_USER],
  [EMembers.PREMIUM_MEMBER, EPremiumSubscribers.PREMIUM_USER],
  [EMembers.TEAM_MANAGER, EPremiumSubscribers.TEAM_USER],
  [EMembers.TEAM_MEMBER, EPremiumSubscribers.TEAM_USER],
  [EMembers.GUEST_MANAGER, EPremiumSubscribers.GUEST_USER],
  [EMembers.GUEST_MEMBER, EPremiumSubscribers.GUEST_USER],
]
