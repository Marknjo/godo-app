export interface IActiveUser {
  // Current logged in user
  sub: string

  // Get user role - permissions {regular, standard, premium, admin}
  role: string

  email: string
}
