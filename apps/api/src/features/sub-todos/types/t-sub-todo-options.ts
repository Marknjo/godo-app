import { FilterQuery } from 'mongoose'
import { SubTodo } from '../schema/sub-todo.schema'

export type TSubTodoOptions = {
  subTodoId?: string
  filters?: FilterQuery<SubTodo>
}
