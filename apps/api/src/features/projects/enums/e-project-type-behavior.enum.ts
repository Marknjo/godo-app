/**
 * This enum allows a user to start a flexible project
 * such that user starts a root project that is not
 * constrained to ROOT behavior (a project that direct children
 * are sub-projects). Instead, the leafy project allows a project
 * to start with tasks then later user may convert it to ROOT only
 * project by converting it to normal. By default all projects are
 * normal -> do not behaves leafy
 */
export enum EProjectTypeBehavior {
  NORMAL = 'normal',
  LEAFY = 'leafy',
}
