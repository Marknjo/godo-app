import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { SubTodo } from './schema/sub-todo.schema'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { TSubTodoOptions } from './types/t-sub-todo-options'

@Injectable()
export class SubTodosService {
  private readonly logger: LoggerService = new Logger(SubTodosService.name)

  constructor(
    @InjectModel(SubTodo.name)
    private readonly subTodoModel: Model<SubTodo>,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  create(createSubTodoDto: CreateSubTodoDto, activeUser: IActiveUser) {
    return this.subTodoModel.create({
      ...createSubTodoDto,
      userId: activeUser.sub,
    })
  }

  async findAll(filters: FilterQuery<SubTodo>, activeUser: IActiveUser) {
    const foundTodos = await this.subTodoModel
      .find({
        ...filters,
        userId: activeUser.sub,
      })
      .sort('-createdAt')

    return {
      data: foundTodos,
    }
  }

  async findOne(activeUser: IActiveUser, options: TSubTodoOptions) {
    const defaultOptions = {
      filters: {},
    }

    const { subTodoId, filters } = {
      ...defaultOptions,
      ...options,
    }

    const whoIs = this.factoryUtils.whoIs(activeUser)

    const action = 'find'

    this.throwIfNoIdAndFilters(subTodoId, filters, whoIs, action)

    const foundTodo = await this.subTodoModel.findOne(
      {
        userId: activeUser,
        ...(subTodoId ? { _id: subTodoId } : {}),
        ...filters,
      },
      {},
      {
        new: true,
      },
    )

    if (!foundTodo) {
      this.logger.warn(
        `User with id ${whoIs} could not find a sub-todo with id ${subTodoId}`,
      )

      throw new NotFoundException(`The requested todo not found in your tasks`)
    }

    return foundTodo
  }

  /**
   * @NOTE: To move a sub-todo to another parent todo
   *
   * @param updateSubTodoDto
   * @param activeUser
   * @param options
   * @returns
   */
  async update(
    updateSubTodoDto: UpdateSubTodoDto,
    activeUser: IActiveUser,
    options: TSubTodoOptions,
  ) {
    const defaultOptions = {
      filters: {},
    }

    const { subTodoId, filters } = {
      ...defaultOptions,
      ...options,
    }

    const whoIs = this.factoryUtils.whoIs(activeUser)

    const action = 'update'

    this.throwIfNoIdAndFilters(subTodoId, filters, whoIs, action)
    //
    const updatedTodo = await this.subTodoModel.findOneAndUpdate(
      {
        userId: activeUser,
        ...(subTodoId ? { _id: subTodoId } : {}),
        ...filters,
      },
      updateSubTodoDto,
      {
        new: true,
      },
    )

    if (!updatedTodo) {
      this.logger.warn(
        `User with id ${whoIs} could not update a sub-todo with id ${subTodoId}`,
      )

      throw new BadRequestException(
        `The requested todo not found in your tasks`,
      )
    }

    const message = `Updating sub-todo was successful`

    this.logger.log(`User successfully updated a sub-todo`)

    return {
      message,
      data: updatedTodo,
    }
  }

  async remove(activeUser: IActiveUser, options: TSubTodoOptions) {
    const defaultOptions = {
      filters: {},
    }

    const { subTodoId, filters } = {
      ...defaultOptions,
      ...options,
    }
    const whoIs = this.factoryUtils.whoIs(activeUser)

    const action = 'remove'

    this.throwIfNoIdAndFilters(subTodoId, filters, whoIs, action)

    //
    const deletedTodo = await this.subTodoModel.findOneAndDelete({
      userId: activeUser,
      ...(subTodoId ? { _id: subTodoId } : {}),
      ...filters,
    })

    if (!deletedTodo) {
      this.logger.warn(
        `User with id ${whoIs} could not delete a sub-todo with id ${subTodoId}`,
      )

      throw new BadRequestException(
        `Deleting this sub-todo failed, please try again`,
      )
    }

    const message = `Deleting sub-todo was successful`

    this.logger.log(`User successfully deleted a sub-todo`)

    return {
      message,
      data: deletedTodo,
    }
  }

  /**
   * ---------------------------------------------
   *
   *                      HELPERS
   *
   * ---------------------------------------------
   */

  /**
   * Ensures a users who does not provide a default sub-todo id
   * also provides a filter option
   *
   * @param subTodoId
   * @param filters
   * @param whoIs
   * @param action
   */
  private throwIfNoIdAndFilters(
    subTodoId: string,
    filters: {},
    whoIs: string,
    action: string,
  ) {
    if (!subTodoId && Object.values(filters).length === 0) {
      this.logger.log(
        `User with id ${whoIs} is trying ${action} without a sub-todo id and an alternative option other than user id`,
      )

      throw new BadRequestException(
        `Failed to ${action} a todo: Please provide an alternative filter`,
      )
    }
  }
}
