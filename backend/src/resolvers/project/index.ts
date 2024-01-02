import { Op } from 'sequelize';

const resolvers = {
  Query: {
    projects: (parent, args, { db }) => {
      // TODO: If project is internal only show projects that the user is a member of
      return db.sequelize.models.Project.findAll({
        order: [['id', 'ASC']],
        include: [
          {
            model: db.sequelize.models.User,
            as: 'users',
          },
        ],
      });
    },
    createProjectValidation: async (parent, { input }, { db }) => {
      const { name, key } = input;

      let whereOr = [];

      if (name) whereOr = [...whereOr, { name: name }];
      if (key) whereOr = [...whereOr, { key: key }];

      const project = await db.sequelize.models.Project.findOne({
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
    project: (parent, args, { db }) => {
      const { id } = args?.input;
      return db.sequelize.models.Project.findByPk(id, {
        include: [
          {
            model: db.sequelize.models.User,
            as: 'users',
          },
        ],
      });
    },
    projectTags: (parent, { input: { projectId, id, name } }, { db }) => {
      const where: any = { projectId };

      if (id) where.id = id;
      if (name) {
        where.name = {
          [Op.like]: `%${name}%`,
        };
      }

      return db.sequelize.models.ProjectTag.findAll({ where });
    },
  },
  Mutation: {
    createProjectCustomField: async (
      parent,
      { input: { projectId, fieldName, fieldType } },
      { db }
    ) =>
      await db.sequelize.models.ProjectCustomField.create(
        {
          projectId: Number(projectId),
          fieldName,
          fieldType,
        },
        { returning: true }
      ),
    deleteProjectCustomField: async (parent, { input: { id } }, { db }) => {
      const findCustomField =
        await db.sequelize.models.ProjectCustomField.findByPk(id);

      if (!findCustomField) throw new Error('Custom field not found');

      await findCustomField.destroy();

      return {
        message: 'deleted custom field',
        status: 'success',
      };
    },
    createProjectTag: async (parent, { input }, { db }) => {
      const { projectId, name } = input;

      return await db.sequelize.models.ProjectTag.create({
        projectId: Number(projectId),
        name,
      });
    },
    deleteProjectTag: async (parent, { input: { id } }, { db }) => {
      const findProjectTag = await db.sequelize.models.ProjectTag.findByPk(id);

      if (!findProjectTag) {
        throw new Error('Project tag not found');
      }

      await findProjectTag.destroy();

      return {
        message: 'deleted tag',
        status: 'success',
      };
    },
    addUserToProject: async (
      parent,
      { input: { userId, projectId } },
      { db }
    ) => {
      const existingPermission =
        await db.sequelize.models.ProjectPermission.findOne({
          where: { userId, projectId },
        });

      if (existingPermission) {
        return { message: 'User added to project', status: 'success' };
      }

      // Add the user to the project
      await db.sequelize.models.ProjectPermission.create({
        userId,
        projectId,
      });

      return { message: 'User added to project', status: 'success' };
    },
    removeUserFromProject: async (
      parent,
      { input: { userId, projectId } },
      { db, user }
    ) => {
      if (user.id === userId) {
        throw new Error('You cannot remove yourself from the project');
      }

      const existingPermission =
        await db.sequelize.models.ProjectPermission.findOne({
          where: { userId, projectId },
        });

      if (!existingPermission) {
        throw new Error('User is not added to the project');
      }

      // Remove the user from the project
      await db.sequelize.models.ProjectPermission.destroy({
        where: { userId, projectId },
      });

      return { message: 'User removed from project', status: 'success' };
    },
    createProject: async (parent, { input }, { db, user }) => {
      // TODO: we should do a sequelize transaction here
      const project = await db.sequelize.models.Project.create({
        name: input.name,
        key: input.key,
        visibility: input.visibility ?? 'INTERNAL',
      });

      await db.sequelize.models.ProjectPermission.create({
        userId: user.id,
        projectId: project.id,
      });

      const projectId = Number(project.id);

      // TODO: We should create mappings for these statuses
      const issueStatuses = await db.sequelize.models.IssueStatuses.bulkCreate(
        ['Backlog', 'To Do', 'In Progress', 'Done'].map((name) => ({
          projectId,
          name,
        }))
      );

      const board = await db.sequelize.models.Board.create({
        projectId,
        name: input?.boardName ?? 'default',
        style: input.boardStyle,
        viewState: issueStatuses.map((is) => ({
          id: `container-${is.id}`,
          title: is.name,
          items: [],
        })),
      });

      return { ...project.toJSON(), boards: [board.toJSON()] };
    },
  },
  Project: {
    customFields: (parent, args, { db }) => {
      return db.sequelize.models.ProjectCustomField.findAll({
        where: { projectId: parent.id },
      });
    },
    tags: (parent, args, { db }) => {
      return db.sequelize.models.ProjectTag.findAll({
        where: { projectId: parent.id },
      });
    },
    issues: (parent, args, { db }) => {
      const { input } = args;
      const findAllInput: any = { where: { projectId: parent.id } };

      if (input && input?.sortBy) {
        findAllInput.order = [
          input?.sortBy.map(({ field, order }) => [field, order]),
        ];
      }

      return db.sequelize.models.Issue.findAll(findAllInput);
    },
    boards: (parent, args, { db }) => {
      return db.sequelize.models.Board.findAll({
        where: { projectId: parent.id },
      });
    },
    issueStatuses: (parent, args, { db }) => {
      return db.sequelize.models.IssueStatuses.findAll({
        where: { projectId: parent.id },
      });
    },
    issueCount: async (parent, args, { db }) => {
      return db.sequelize.models.Issue.count({
        where: { projectId: parent.id },
      });
    },
  },
};

export default resolvers;
