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
