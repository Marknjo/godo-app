import { ERoles } from '../enums/e-roles.enum'

export interface IActiveUser {
  // Current logged in user
  sub: string

  // Get user role - permissions {regular, standard, premium, admin}
  role: ERoles

  email: string

  memberId: string
}
