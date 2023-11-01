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
}

export enum EPremiumSubscribers {
  TEAM_OWNER = ERoles.TEAM_USER,
  PREMIUM_OWNER = ERoles.PREMIUM_USER,
  GUEST_USER = ERoles.GUEST_USER,
  ADMIN = ERoles.ADMIN,
}
