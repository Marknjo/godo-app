import { EPremiumSubscribers, ERoles } from '../enums/e-roles.enum'

export interface IActiveUser {
  // Current logged in user
  sub: string

  // Get user role - permissions {regular, standard, premium, admin}
  role: ERoles

  email: string

  memberId?: string

  /**
   * Regardless of who is logged in, the base role MUST always be assigned a value
   * - for account owners baseRole will be equal to role
   * - for members baseRole with be equal to accountOwner role
   */
  baseRole: EPremiumSubscribers

  /**
   * Maintains total number of team members a premium user has
   *  - Allows us to limit number of team members a premium account
   *   can have
   */
  totalTeamMembers: number

  /**
   * Exposes total number of projects a user have created
   * - manly for capping subscribers,
   *   i.e. Standard Subscribers have a maximum of
   *   12 projects, while guest 3 projects
   */
  totalProjects: number
}
