import { Op } from 'sequelize';

import {
  Custom_Field_Type,
  type MutationResolvers,
  type ProjectResolvers,
  ProjectVisibility,
  type QueryResolvers,
  type Resolvers,
  type ViewState,
} from '../../__generated__/resolvers-types.js';

const Query: QueryResolvers = {
  projects: async (parent, args, { db, dataLoaderContext }) => {
    // TODO: If project is internal only show projects that the user is a member of
    const databaseProjects = await db.Project.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: db.User,
          as: 'users',
        },
      ],
    });

    dataLoaderContext.prime(databaseProjects);

    return databaseProjects.map((project) => ({
      ...project.toJSON(),
      id: `${project.id}`,
      visibility: project.visibility as ProjectVisibility,
      boards: undefined,
      users: undefined,
    }));
  },
  createProjectValidation: async (parent, { input }, { db }) => {
    const { name, key } = input;

    let whereOr = [];

    if (name) whereOr = [...whereOr, { name: name }];
    if (key) whereOr = [...whereOr, { key: key }];

    const project = await db.Project.findOne({
      where: { [Op.or]: whereOr },
    });

    if (project) {
      return {
        status: 'error',
        message: 'Project name or key already exists',
      };
    }

    return {
      status: 'success',
      message: 'Project name and key are available',
    };
  },
  project: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const { id } = args?.input;
    const databaseProject = await db.Project.findByPk(Number(id), {
      include: [
        {
          model: db.User,
          as: 'users',
        },
      ],
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return {
      ...databaseProject.toJSON(),
      id: `${databaseProject.id}`,
      visibility: databaseProject.visibility as ProjectVisibility,
      boards: undefined,
      users: databaseProject.users
        ? databaseProject.users.map((user) => ({ ...user.toJSON(), id: `${user.id}` }))
        : undefined,
    };
  },
  projectTags: async (parent, { input: { projectId, id, name } }, { db, dataLoaderContext }) => {
    const where: any = { projectId };

    if (id) where.id = Number(id);
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    const databaseProjectTags = await db.ProjectTag.findAll({ where });
    dataLoaderContext.prime(databaseProjectTags);

    return databaseProjectTags.map((projectTag) => ({
      ...projectTag.toJSON(),
      id: `${projectTag.id}`,
      projectId: `${projectTag.projectId}`,
    }));
  },
};

const Mutation: MutationResolvers = {
  createProjectCustomField: async (
    parent,
    { input: { projectId, fieldName, fieldType } },
    { db, dataLoaderContext }
  ) => {
    const projectCustomField = await db.ProjectCustomField.create(
      {
        projectId: Number(projectId),
        fieldName,
        fieldType,
      },
      {
        returning: true,
      }
    );

    dataLoaderContext.prime(projectCustomField);

    return {
      ...projectCustomField.toJSON(),
      id: `${projectCustomField.id}`,
      projectId: `${projectCustomField.projectId}`,
      fieldType: projectCustomField.fieldType as Custom_Field_Type,
    };
  },
  deleteProjectCustomField: async (parent, { input: { id } }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const findCustomField = await db.ProjectCustomField.findByPk(Number(id), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (!findCustomField) throw new Error('Custom field not found');

    await findCustomField.destroy();

    return {
      message: 'deleted custom field',
      status: 'success',
    };
  },
  createProjectTag: async (parent, { input }, { db, dataLoaderContext }) => {
    const { projectId, name } = input;

    const projectTag = await db.ProjectTag.create(
      {
        projectId: Number(projectId),
        name,
      },
      {
        returning: true,
      }
    );

    dataLoaderContext.prime(projectTag);

    return {
      ...projectTag.toJSON(),
      id: `${projectTag.id}`,
      projectId: `${projectTag.projectId}`,
    };
  },
  deleteProjectTag: async (parent, { input: { id } }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const findProjectTag = await db.ProjectTag.findByPk(Number(id), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (!findProjectTag) {
      throw new Error('Project tag not found');
    }

    await findProjectTag.destroy();

    return {
      message: 'deleted tag',
      status: 'success',
    };
  },
  addUserToProject: async (parent, { input: { userId, projectId } }, { db, dataLoaderContext }) => {
    const existingPermission = await db.ProjectPermission.findOne({
      where: { userId, projectId },
    });

    if (existingPermission) {
      return { message: 'User added to project', status: 'success' };
    }

    // Add the user to the project
    await db.ProjectPermission.create({
      userId: Number(userId),
      projectId: Number(projectId),
    });

    return { message: 'User added to project', status: 'success' };
  },
  removeUserFromProject: async (parent, { input: { userId, projectId } }, { db, user }) => {
    if (Number(user.id) === Number(userId)) {
      throw new Error('You cannot remove yourself from the project');
    }

    const existingPermission = await db.ProjectPermission.findOne({
      where: { userId, projectId },
    });

    if (!existingPermission) {
      throw new Error('User is not added to the project');
    }

    // Remove the user from the project
    await db.ProjectPermission.destroy({
      where: { userId, projectId },
    });

    return { message: 'User removed from project', status: 'success' };
  },
  createProject: async (parent, { input }, { db, user, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    // TODO: we should do a sequelize transaction here
    const project = await db.Project.create({
      name: input.name,
      key: input.key,
      visibility: input.visibility ?? 'INTERNAL',
    });

    const projectPermission = await db.ProjectPermission.create({
      userId: user.id,
      projectId: project.id,
    });

    const projectId = Number(project.id);

    // TODO: We should create mappings for these statuses
    const issueStatuses = await db.IssueStatuses.bulkCreate(
      ['Backlog', 'To Do', 'In Progress', 'Done'].map((name) => ({
        projectId,
        name,
      }))
    );

    const board = await db.Board.create({
      projectId,
      name: input?.boardName ?? 'default',
      style: input.boardStyle,
      viewState: issueStatuses.map((is) => ({
        id: `container-${is.id}`,
        title: is.name,
        items: [],
      })),
    });

    // TODO: we may not even need this
    dataLoaderContext.prime(projectPermission);
    dataLoaderContext.prime(issueStatuses);
    dataLoaderContext.prime(project);
    dataLoaderContext.prime(board);

    return {
      ...project.toJSON(),
      id: `${project.id}`,
      visibility: project.visibility as ProjectVisibility,
      boards: [
        {
          ...board.toJSON(),
          id: `${board.id}`,
          projectId: `${board.projectId}`,
          containerOrder: board.containerOrder ? JSON.stringify(board.containerOrder) : undefined, // TODO: Fix this
          settings: board.settings ? JSON.stringify(board.settings) : undefined, // TODO: Fix this
          viewState: board.viewState ? (board.viewState as ViewState[]) : undefined, // TODO: fix this
        },
      ],
    };
  },
};

const Project: ProjectResolvers = {
  customFields: async (parent, args, { db, dataLoaderContext }) => {
    const projectFields = await db.ProjectCustomField.findAll({
      where: { projectId: parent.id },
    });

    dataLoaderContext.prime(projectFields);

    return projectFields.map((field) => ({
      ...field.toJSON(),
      id: `${field.id}`,
      projectId: `${field.projectId}`,
      fieldType: field.fieldType as Custom_Field_Type,
    }));
  },
  tags: async (parent, args, { db, dataLoaderContext }) => {
    const projectTags = await db.ProjectTag.findAll({
      where: { projectId: parent.id },
    });

    dataLoaderContext.prime(projectTags);

    return projectTags.map((tag) => ({
      ...tag.toJSON(),
      id: `${tag.id}`,
      projectId: `${tag.projectId}`,
    }));
  },
  issues: async (parent, { input }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const findAllInput: any = { where: { projectId: Number(parent.id) } };

    if (input && input?.sortBy) {
      findAllInput.order = [input?.sortBy.map(({ field, order }) => [field, order])];
    }

    const databaseIssues = await db.Issue.findAll(findAllInput);

    dataLoaderContext.prime(databaseIssues);

    return databaseIssues.map((issue) => ({
      ...issue.toJSON(),
      id: `${issue.id}`,
      projectId: `${issue.projectId}`,
      customFields: undefined,
    }));
  },
  boards: async (parent, args, { db, dataLoaderContext }) => {
    const boards = await db.Board.findAll({
      where: { projectId: parent.id },
    });

    dataLoaderContext.prime(boards);

    return boards.map((board) => ({
      ...board.toJSON(),
      id: `${board.id}`,
      projectId: `${board.projectId}`,
      containerOrder: board.containerOrder ? JSON.stringify(board.containerOrder) : undefined, // TODO: Fix this
      settings: board.settings ? JSON.stringify(board.settings) : undefined, // TODO: Fix this
      viewState: board.viewState ? (board.viewState as ViewState[]) : undefined, // TODO: fix this
    }));
  },
  issueStatuses: async (parent, args, { db, dataLoaderContext }) => {
    const issueStatuses = await db.IssueStatuses.findAll({
      where: { projectId: parent.id },
    });

    dataLoaderContext.prime(issueStatuses);

    return issueStatuses.map((issueStatus) => ({
      ...issueStatus.toJSON(),
      id: `${issueStatus.id}`,
      projectId: `${issueStatus.projectId}`,
    }));
  },
  issueCount: async (parent, args, { db }) => {
    return db.Issue.count({
      where: { projectId: Number(parent.id) },
    });
  },
};

const resolvers: Resolvers = {
  Query,
  Mutation,
  Project,
};

export default resolvers;
