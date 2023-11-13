import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { ToggleTodoStatusDto } from './dto/toggle-todo-status.dto'
import { FreeUpdateTodoDto } from './dto/free-update-todo.dto'
import { CreateFreeTodoDto } from './dto/create-free-todo.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Todo } from './schema/todo.schema'
import { FilterQuery, Model, PopulateOptions } from 'mongoose'
import { SubTodosService } from '../sub-todos/sub-todos.service'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { IconsService } from '../icons/icons.service'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { ProjectsService } from '../projects/projects.service'

@Injectable()
export class TodosService {
  private readonly logger: LoggerService = new Logger(TodosService.name)

  private readonly MAX_STANDARD_SUBSCRIBER_PROJECTS = 12
  private readonly MAX_GUEST_SUBSCRIBER_PROJECTS = 6

  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,

    private readonly subTodosService: SubTodosService,

    private readonly iconsService: IconsService,

    private readonly projectService: ProjectsService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async createFree(
    createTodoDto: CreateFreeTodoDto | CreateTodoDto,
    activeUser: IActiveUser,
  ) {
    const parentId = createTodoDto?.parentId
    const hasParentOrSubParentId = !!parentId

    // remove parentId & subParentId
    delete createTodoDto?.parentId

    const createdTodo = await this.todoModel.create(createTodoDto)

    const todoId = createdTodo.id

    if (hasParentOrSubParentId) {
      const parentId = createTodoDto?.parentId
      const subParentId = createTodoDto?.subParentId
      // create sub-todo
      await this.subTodosService.create(
        {
          subTodo: todoId,
          parentId,
          ...(subParentId ? { subParentId } : {}),
        },
        activeUser,
      )
    }

    return {
      message: `A new todo was added successfully`,
      data: createTodoDto,
    }
  }

  async create(createTodoDto: CreateTodoDto, activeUser: IActiveUser) {
    // @TODO: before save - check if the project exists & belongs to user
    if (createTodoDto?.projectId) {
      // process data
      // response
    }

    // assign
    return this.createFree(createTodoDto, activeUser)
  }

  async findAll(filters: FilterQuery<Todo>, activeUser: IActiveUser) {
    return 'findAll'
  }

  findOne(todoId: string, activeUser: IActiveUser) {
    return `This action returns a #${todoId} todo`
  }

  update(
    todoId: string,
    updateTodoDto: Partial<UpdateTodoDto | ToggleTodoStatusDto>,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${todoId} todo`
  }

  updateFree(
    todoId: string,
    updateTodoDto: Partial<FreeUpdateTodoDto | ToggleTodoStatusDto>,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${todoId} todo`
  }

  toggleStatus(
    todoId: string,
    toggleStatusDto: ToggleTodoStatusDto,
    activeUser: IActiveUser,
  ) {
    return `toggleStatus`
  }

  remove(todoId: string, activeUser: IActiveUser) {
    return `This action removes a #${todoId} todo`
  }

  /**
   * ---------------------------------------
   *
   *                 HELPERS
   *
   * ---------------------------------------
   *
   */

  /**
   * Pre configure populate fields
   * @returns
   */
  private populateConfigs(): PopulateOptions[] {
    return [
      { path: 'userId' },
      { path: 'projectId' },
      { path: 'parentTodos.parentId' },
      { path: 'parentTodos.subParentId' },
      { path: 'iconId' },
    ]
  }
}
