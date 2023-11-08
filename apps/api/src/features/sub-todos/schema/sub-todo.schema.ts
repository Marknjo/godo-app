import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Todo } from 'src/features/todos/schema/todo.schema'
import { User } from 'src/iam/users/schema/user.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class SubTodo {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Todo',
  })
  todoId: Todo

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Todo',
  })
  subTodoId: Todo

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  userId: User
}

export const SubTodoSchema = SchemaFactory.createForClass(SubTodo)
export type TSubTodoDoc = HydratedDocument<SubTodo>
