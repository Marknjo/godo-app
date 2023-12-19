import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ToggleProjectStatusDto } from './dto/toggle-project-status.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Project, TProjectDoc } from './schema/project.schema'
import { FilterQuery, MergeType, Model, PopulateOptions, Types } from 'mongoose'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'
import { PaymentRequiredException } from 'src/common/exceptions/payment-require.exception'
import { UpdateUserDto } from 'src/iam/users/dto/update-user.dto'
import { UsersService } from 'src/iam/users/users.service'
import { EProjectTypes } from './enums/e-project-types.enum'
import { EProjectTypeBehavior } from './enums/e-project-type-behavior.enum'
import { TTodoDoc } from '../todos/schema/todo.schema'
import { User } from 'src/iam/users/schema/user.schema'

@Injectable()
export class ProjectsService {
  private readonly MAX_STANDARD_SUBSCRIBER_PROJECTS = 12
  private readonly MAX_GUEST_SUBSCRIBER_PROJECTS = 3

  private readonly logger: LoggerService = new Logger(ProjectsService.name)

  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,

    private readonly userService: UsersService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createProjectDto: CreateProjectDto, activeUser: IActiveUser) {
    const totalProjects = activeUser.totalProjects

    try {
      // ⛳ Prep constants
      const whoIs = this.factoryUtils.whoIs(activeUser)

      const subParentId = createProjectDto?.subParentId

      const isRootLeafy =
        createProjectDto?.projectTypeBehavior === EProjectTypeBehavior.LEAFY &&
        createProjectDto?.projectType === EProjectTypes.ROOT

      const isRootBranch =
        createProjectDto?.projectTypeBehavior === EProjectTypeBehavior.BRANCH &&
        createProjectDto?.projectType === EProjectTypes.ROOT

      const rootParentId = createProjectDto?.rootParentId

      const userSubscription = activeUser.baseRole

      // 🚦 Validator
      this.throwIfEndAtIsDue(createProjectDto, whoIs, 'create')

      // 🚦 Validator
      this.throwIfStartAtIsGreaterThanEndAtDate(
        createProjectDto,
        whoIs,
        'creating',
      )

      // 🚦 Validator
      this.throwIfSimilarRootProjectIdAndSubProjectId(
        subParentId,
        rootParentId,
        whoIs,
      )

      // 🚦 Validator
      this.throwIfRootProjectsHasDependantId(
        isRootLeafy,
        isRootBranch,
        rootParentId,
        subParentId,
        whoIs,
      )

      // 🚦 Validator
      this.throwIfChildLacksRootProjectId(createProjectDto, whoIs)

      // 🚦 Validator
      this.throwIfSubscriberHasHitMaxLimit(
        userSubscription,
        totalProjects,
        whoIs,
      )

      // update user with totalProjects - we can use transactions
      await this.updateTotalProjects(
        totalProjects,
        activeUser,
        createProjectDto,
      )

      let message: string
      let foundProject: MergeType<
        TProjectDoc,
        {
          createdAt: string
          updatedAt: string
        }
      >
      // find parent project user is trying to create
      if (createProjectDto?.subParentId || createProjectDto?.rootParentId) {
        foundProject = await this.projectModel.findById(
          createProjectDto?.subParentId || createProjectDto?.rootParentId,
        )

        // @TODO: check - don't add tasks to root:branch or sub-project:branch projects

        const isRootLeafy =
          foundProject &&
          foundProject.projectTypeBehavior === EProjectTypeBehavior.LEAFY &&
          foundProject.projectType === EProjectTypes.ROOT

        const isSubProjectLeafy =
          foundProject &&
          foundProject.projectTypeBehavior === EProjectTypeBehavior.LEAFY &&
          foundProject.projectType === EProjectTypes.SUB_PROJECT

        if (isSubProjectLeafy || isRootLeafy) {
          const withTasks = await foundProject.populate<{ tasks: TTodoDoc }>(
            'tasks',
          )

          const typeBh = isRootLeafy ? 'root project' : 'sub-project'

          // if no tasks, update leafy to normal - lock the leafy project
          withTasks.projectTypeBehavior = EProjectTypeBehavior.BRANCH
          await withTasks.save()

          if (withTasks?.tasks) {
            message = `The ${typeBh} you are trying to associate this sub-project has tasks as its direct children. Please, move all these tasks into their associated relevant sub-projects`
          } else {
            this.logger.log(
              `A leafy ${typeBh} was automatically converted to a branch project`,
            )

            message = `You've successfully created a sub-project based on a leafy ${typeBh}. Please note, you cannot add more tasks directly to this project`
          }
        }
      }

      // can now create a new project
      let newProject: TProjectDoc

      if (!foundProject) {
        newProject = await this.projectModel.create({
          ...createProjectDto,
          userId: activeUser.sub as unknown as User,
        })
      }

      // reusing the handle
      if (foundProject) {
        Object.entries(createProjectDto).forEach(([key, value]) => {
          foundProject[key] = value
        })

        //clean: remove unnecessary fields
        foundProject.id = undefined
        foundProject._id = undefined
        foundProject.createdAt = undefined
        foundProject.updatedAt = undefined
        foundProject.__v = undefined

        // add user
        foundProject.userId = activeUser.sub as unknown as User

        foundProject.isNew = true
        newProject = await foundProject.save()
      }

      // always populate
      newProject = await newProject.populate(this.populateConfigs(true))

      return {
        message: message || 'A new project was successfully created',
        data: newProject,
      }
    } catch (error) {
      this.logger.warn(error.message)
      this.logger.verbose(error)

      // handler bad request
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message)
      }

      // handle payment exceptions request
      if (error instanceof PaymentRequiredException) {
        throw new PaymentRequiredException(error.message)
      }

      // handle not found exceptions request
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Failed to create a new project`)
      }

      // handle forbidden exceptions request
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(`Failed to create a new project`)
      }

      // handle validations
      if (error instanceof Error && error.name === 'Validations') {
        // rollback updating total projects
        await this.updateTotalProjects(
          totalProjects,
          activeUser,
          createProjectDto,
          false,
        )

        throw new BadRequestException(error.message)
      }

      // handle conflict
      if (error.code === 11000) {
        // rollback updating total projects
        await this.updateTotalProjects(
          totalProjects,
          activeUser,
          createProjectDto,
          false,
        )

        const message = this.factoryUtils.autoGenerateDuplicateMessage(error)

        throw new ConflictException(message || 'Failed to create a new project')
      }

      // handle default - unknown error
      throw new InternalServerErrorException(
        'Server failed to process your request, please try again later',
      )
    }
  }

  async findAll(
    filters: FilterQuery<Project>,
    activeUser: IActiveUser,
    canPopIds: boolean = true,
  ) {
    const projects = await this.projectModel
      .find({
        userId: activeUser.sub,
        ...filters,
      })
      .sort('-createdAt')
      .populate(this.populateConfigs(canPopIds))

    // console.log(projects)

    return {
      data: projects,
    }
  }

  async findOne(projectId: string, activeUser: IActiveUser) {
    const whoIs = this.factoryUtils.whoIs(activeUser)

    // find one & all its direct children
    const projects = await this.findAll(
      {
        $or: [
          { _id: projectId },
          { rootParentId: projectId },
          { subParentId: projectId },
        ],
      },
      activeUser,
      false,
    )

    if (projects.data.length === 0) {
      this.logger.warn(
        `User (${whoIs}) is trying to find a project that is not available in their collection`,
      )

      throw new NotFoundException(`Could not find the requested project`)
    }

    return projects
  }

  async update(
    projectId: string,
    updateProjectDto: Partial<UpdateProjectDto & ToggleProjectStatusDto>,
    activeUser: IActiveUser,
  ) {
    // ⛳ Prep constants
    const whoIs = this.factoryUtils.whoIs(activeUser)
    const rootParentId = updateProjectDto?.rootParentId
    const subParentId = updateProjectDto?.subParentId

    // prevent updating endAt in the past
    this.throwIfEndAtIsDue(updateProjectDto, whoIs, 'update')

    // startAt cannot be greater than endAt
    this.throwIfStartAtIsGreaterThanEndAtDate(
      updateProjectDto,
      whoIs,
      'updating',
    )

    let foundProject = await this.findProjectHelper(projectId, activeUser)

    const fpRootProjectId = foundProject?.rootParentId
    const fpSubProjectId = foundProject?.subParentId

    const isRootLeafy =
      foundProject.projectTypeBehavior === EProjectTypeBehavior.LEAFY &&
      foundProject.projectType === EProjectTypes.ROOT

    const isRootBranch =
      foundProject.projectTypeBehavior === EProjectTypeBehavior.BRANCH &&
      foundProject.projectType === EProjectTypes.ROOT

    const isRootProject = isRootBranch || isRootLeafy

    if (!isRootProject) {
      foundProject = await foundProject.populate<{
        rootParentId: TProjectDoc
        subParentId: TProjectDoc
      }>([{ path: 'rootParentId' }, { path: 'subParentId' }])
    }

    // user cannot add same rootParentId with subProjectId
    if (subParentId || rootParentId)
      this.throwIfSimilarRootProjectIdAndSubProjectId(
        subParentId || fpRootProjectId,
        rootParentId || fpSubProjectId,
        whoIs,
        'updating',
      )

    // cannot add rootParentId & subParentId to the root:branch or root:leafy
    this.throwIfRootProjectsHasDependantId(
      isRootLeafy,
      isRootBranch,
      rootParentId,
      subParentId,
      whoIs,
      'updating',
    )

    // a project cannot depend on itself
    const fpId = foundProject.id
    if (
      (rootParentId || subParentId) &&
      (rootParentId === fpId || subParentId === fpId)
    ) {
      this.logger.warn(
        `User (${whoIs}) is trying to update a project dependency with its current id`,
      )

      throw new BadRequestException(`Projects should not depend on themselves`)
    }

    // @TODO: swapping - should be delegated

    // a parent project cannot depend on it's child
    if (subParentId) {
      const subParentDoc = await this.findProjectHelper(
        subParentId.toString(),
        activeUser,
      )

      if (subParentDoc.id === fpId) {
        this.logger.warn(
          `User (${whoIs}) is creating a relationship that makes a parent project depend on it's child`,
        )

        throw new BadRequestException(
          `A parent project can only depend on other parent projects but not it's children`,
        )
      }
    }

    // if demoting a root parent to a sub-parent, then user must provide a subRootId - update parent to branch if leafy
    // cannot add a project stage that does not exists

    const updatedProject = await this.projectModel.updateOne(
      {
        userId: activeUser.sub,
        _id: projectId,
        ...(rootParentId
          ? {
              rootParentId: {
                $exists: true,
                $eq: new Types.ObjectId(rootParentId.toString()),
              },
            }
          : {}),
      },
      updateProjectDto,
      {
        new: true,
      },
    )

    return updatedProject
  }

  toggleStatus(
    projectId: string,
    toggleStatusDto: ToggleProjectStatusDto,
    activeUser: IActiveUser,
  ) {
    return `toggleStatus`
  }

  remove(projectId: string, activeUser: IActiveUser) {
    return `This action removes a #${projectId} Project`
  }

  /**
   * ---------------------------------------
   *
   *                 HELPERS
   *
   * ---------------------------------------
   *
   */
  private async findProjectHelper(projectId: string, activeUser: IActiveUser) {
    let foundProject = await this.projectModel.findOne({
      _id: projectId,
      userId: activeUser.sub,
    })

    const whoIs = this.factoryUtils.whoIs(activeUser)

    if (!foundProject) {
      this.logger.warn(
        `User (${whoIs}) is trying to find a project that is not available in their collection`,
      )

      throw new NotFoundException(`Could not find the requested project`)
    }

    foundProject = await foundProject.populate(this.populateConfigs())

    return foundProject
  }

  /**
   * Updates user total projects
   * - Can also be used to rollback updates if create error occurs
   *
   * @param totalProjects
   * @param activeUser
   * @param add
   */
  private async updateTotalProjects(
    totalProjects: number,
    activeUser: IActiveUser,
    dto: CreateProjectDto,
    add: boolean = true,
  ) {
    if (dto.projectType !== EProjectTypes.ROOT) return

    const userUpdateDto = {
      totalProjects: totalProjects + (add ? 1 : 0),
    } as UpdateUserDto

    await this.userService.update(
      activeUser.sub.toString(),
      userUpdateDto,
      activeUser,
    )
  }

  /**
   * Pre configure populate fields
   * @returns
   */
  private populateConfigs(popParentIds: boolean = false): PopulateOptions[] {
    return [
      ...(popParentIds
        ? [
            { path: 'rootParentId', select: 'id title' },
            { path: 'subParentId', select: 'id title' },
          ]
        : []),
      { path: 'dependsOn', select: 'id title' },
      { path: 'tasks' },
      { path: 'tasks.parentId', strictPopulate: false },
      { path: 'tasks.subParentId', strictPopulate: false },
      { path: 'tasks.iconId', strictPopulate: false },
      { path: 'tasks.userId', strictPopulate: false },
    ]
  }

  /**
   * ------------------------------------
   *         🚦 VALIDATIONS
   */

  /**
   *  Ensures a subscriber does not exceed the max limit projects
   *
   * @param userSubscription
   * @param totalProjects
   * @param whoIs
   */
  private throwIfSubscriberHasHitMaxLimit(
    userSubscription: EPremiumSubscribers,
    totalProjects: number,
    whoIs: string,
  ) {
    if (
      userSubscription === EPremiumSubscribers.GUEST_USER ||
      userSubscription === EPremiumSubscribers.STANDARD_USER
    ) {
      const guest = EPremiumSubscribers.GUEST_USER
      const standard = EPremiumSubscribers.STANDARD_USER

      const maxProjects = {
        [guest]: this.MAX_GUEST_SUBSCRIBER_PROJECTS,
        [standard]: this.MAX_STANDARD_SUBSCRIBER_PROJECTS,
      }

      const newTotalPr = totalProjects + 1

      if (newTotalPr > maxProjects[userSubscription]) {
        this.logger.warn(
          `User ${whoIs} is trying to add more projects beyond the max limit`,
        )

        throw new PaymentRequiredException(
          'Please upgrade your account to enjoy more projects',
        )
      }
    }
  }

  /**
   * Ensures user does not provide an end date that is less than start date
   *
   * @param createProjectDto
   * @param whoIs
   * @param action
   */
  private throwIfStartAtIsGreaterThanEndAtDate(
    createProjectDto: Partial<CreateProjectDto & ToggleProjectStatusDto>,
    whoIs: string,
    action: 'creating' | 'updating',
  ) {
    if (createProjectDto?.endAt && createProjectDto?.startAt) {
      const startAtMil = new Date(createProjectDto?.startAt).getTime()

      const endAtAtMil = new Date(createProjectDto?.startAt).getTime()

      if (startAtMil > endAtAtMil) {
        this.logger.warn(
          `User (${whoIs}) is ${action} a new project with startAt greater than endAt`,
        )

        throw new BadRequestException(
          `Ensure end date of a project is greater than start date`,
        )
      }
    }
  }

  /**
   * Ensure endAt Date is in the future
   * @param projectDto
   * @param whoIs
   * @param action
   * @returns
   */
  private throwIfEndAtIsDue(
    projectDto: Partial<CreateProjectDto & ToggleProjectStatusDto>,
    whoIs: string,
    action: 'create' | 'update',
  ) {
    if (!projectDto?.endAt) return

    const endAt = new Date(projectDto?.endAt).getTime()
    const now = Date.now()

    if (now > endAt) {
      this.logger.warn(
        `User (${whoIs}) is trying to ${action} a project using a due data; a date in the past`,
      )

      throw new BadRequestException(
        `Can't ${action} a project with the due date; a date in the past`,
      )
    }
  }

  /**
   * Ensures a users does not add similar project ids in root and sub-parent projects
   * @param subParentId
   * @param rootParentId
   * @param whoIs
   * @param action
   */
  private throwIfSimilarRootProjectIdAndSubProjectId(
    subParentId: Project,
    rootParentId: Project,
    whoIs: string,
    action: 'creating' | 'updating' = 'creating',
  ) {
    if (subParentId && rootParentId && subParentId === rootParentId) {
      this.logger.warn(
        `User (${whoIs}) is ${action} a sub-project with similar root and sub-project id`,
      )

      throw new BadRequestException(
        `Ensure Root project and sub-project is different`,
      )
    }
  }

  /**
   * Ensures a new root project does not have a rootProjectId or parentParentId
   * All root projects ids do not depend on other projects, unless
   * demoted correctly
   *
   * @param isRootLeafy
   * @param isRootBranch
   * @param rootParentId
   * @param subParentId
   * @param whoIs
   * @param action
   */
  private throwIfRootProjectsHasDependantId(
    isRootLeafy: boolean,
    isRootBranch: boolean,
    rootParentId: Project,
    subParentId: Project,
    whoIs: string,
    action: 'creating' | 'updating' = 'creating',
  ) {
    if ((isRootLeafy || isRootBranch) && (rootParentId || subParentId)) {
      this.logger.warn(
        `User ${whoIs} is ${action} a new root project but has also supplied a ${
          rootParentId ? 'root parent id' : 'sub root parent id'
        }`,
      )

      const type = isRootLeafy
        ? 'a leafy root project'
        : 'a branch root project'

      throw new BadRequestException(
        `Looks like you are ${action} ${type}, however, your request includes a dependant project? Do you intend to create a sub-project instead?`,
      )
    }
  }

  /**
   * Ensures a sub-project has parent project id
   *
   * @param createProjectDto
   * @param whoIs
   */
  private throwIfChildLacksRootProjectId(
    createProjectDto: CreateProjectDto,
    whoIs: string,
  ) {
    if (
      createProjectDto?.projectType === EProjectTypes.SUB_PROJECT &&
      !createProjectDto?.rootParentId
    ) {
      this.logger.warn(
        `User ${whoIs} is creating a sub project without it's id`,
      )

      throw new BadRequestException(`A sub-project requires it's parent id`)
    }
  }
}
