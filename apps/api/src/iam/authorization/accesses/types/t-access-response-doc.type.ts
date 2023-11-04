import { MergeType } from 'mongoose'
import { TUserDoc } from 'src/iam/users/schema/user.schema'
import { TAccessDoc } from '../schema/access.schema'
import { TRolesDoc } from '../../roles/schema/role.schema'

export type TAccessResponseDoc = MergeType<
  TAccessDoc,
  {
    accountOwner: TUserDoc
    assignedTo: TUserDoc
    roleId: TRolesDoc
  }
>
