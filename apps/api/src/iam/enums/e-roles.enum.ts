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

export enum EMembers {
  ADMIN_MANAGER = ERoles.MEMBER,
  ADMIN_ASSISTANT = ERoles.ADMIN_ASSISTANT,
  MANAGER = ERoles.MANAGER,
  MEMBER = ERoles.MEMBER,
}
