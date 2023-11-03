import { ERoles } from 'src/iam/enums/e-roles.enum'

export enum ERoleTypes {
  REGULAR = 'regular',
  ADMIN = 'admin',
}

export enum ERolesAdmin {
  ADMIN = ERoles.ADMIN,
  ADMIN_MANAGER = ERoles.ADMIN_MANAGER,
  ADMIN_ASSISTANT = ERoles.ADMIN_ASSISTANT,
}

export enum ERolesRegular {
  TEAM_USER = ERoles.TEAM_USER,
  PREMIUM_USER = ERoles.PREMIUM_USER,
  GUEST_USER = ERoles.GUEST_USER,
  STANDARD_USER = ERoles.STANDARD_USER,
  FREE_USER = ERoles.FREE_USER,
  MANAGER = ERoles.MANAGER,
  MEMBER = ERoles.MEMBER,
}
