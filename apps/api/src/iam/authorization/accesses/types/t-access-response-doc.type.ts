import { MergeType } from 'mongoose'
import { TUserDoc } from 'src/iam/users/schema/user.schema'
import { TAccessDoc } from '../schema/access.schema'
import { TRolesDoc } from '../../roles/schema/role.schema'

export type TAccessResponseDoc = MergeType<
  TAccessDoc,
  {
    accountOwner: MergeType<
      TUserDoc,
      {
        accesses: MergeType<
          TAccessDoc,
          {
            roleId: TRolesDoc
          }
        >
      }
    >
    assignedTo: MergeType<
      TUserDoc,
      {
        accesses: MergeType<
          TAccessDoc,
          {
            roleId: TRolesDoc
          }
        >
      }
    >
    roleId: TRolesDoc
  }
>
