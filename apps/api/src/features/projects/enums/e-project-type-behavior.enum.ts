/**
 * Enum that defines behavior of a project like a tree when you couple
 * it with EProjectsTypes, (root and sub-project)
 * - You have 4 outcomes
 *   1. Root:Branch
 *   2. Root:Leafy
 *   3. SubProject:Branch
 *   4. SubProject:Leafy
 *
 * - Analogy of a tree explained:
 *  -> Root:Branch -> a project type root, that behaves like a tree.
 *     All other branches and leafs are attached to this root. So,
 *     it is our main tree, and direct children are subProjects,
 *     no direct tasks attached to it.
 *  -> Root:Leafy -> a project that is main, but it does not have
 *     branches, only tasks as its leafs; no branches. However, user
 *     can convert it later to Root:Branch
 *  -> SubProject:Branch -> a project that is a branch of a Root:Branch
 *     or another SubProject:Branch. It does not have direct tasks
 *  -> SubProject:Leafy -> a project type that is the deepest nested
 *     project. It's direct children are tasks. It's parent can be other
 *     SubProject:Branch or Root:Branch
 */
export enum EProjectTypeBehavior {
  BRANCH = 'branch',
  LEAFY = 'leafy',
}
