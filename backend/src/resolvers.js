import { Op } from 'sequelize';
import { ASSET_PROVIDER, BUCKET_NAME } from './services/config.js';
import { minioClient } from './services/minio-client.js';
import { v4 as uuidv4 } from 'uuid';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { isUndefined } from 'lodash-es';
import board from './db/models/board.js';
import { issueResolvers } from './resolvers/issue.js';
import { emitBoardUpdatedEvent, emitIssueUpdatedEvent } from './socket/events.js';

// TODO: make these delete operations with SQL + minio inside a SQL transaction

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    updateMe: async (parent, { input }, { db, user }) => {
      const { firstName, lastName } = input;

      if (!isUndefined(firstName)) user.firstName = firstName;
      if (!isUndefined(lastName)) user.lastName = lastName;

      await user.save();

      return user;
    },
    createProjectTag: async (parent, { input }, { db }) => {
      const { projectId, name } = input;

      return await db.sequelize.models.ProjectTag.create({
        projectId: Number(projectId),
        name,
      });
    },
    deleteProjectTag: async (parent, { input }, { db }) => {
      const { id } = input;

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
    updateBoard: async (parent, { input }, { db, io }) => {
      const { id, name, viewState, backlogEnabled, settings, containerOrder } = input;

      const board = await db.sequelize.models.Board.findByPk(id);
      if (name) board.name = name;
      if (typeof viewState !== 'undefined') board.viewState = viewState;
      if (backlogEnabled !== undefined) board.backlogEnabled = backlogEnabled;
      if (typeof settings !== 'undefined') board.settings = settings;
      // TODO: lets add some more safety checks here
      if (typeof containerOrder !== 'undefined') {
        board.containerOrder = typeof containerOrder === 'string' ? JSON.parse(containerOrder) : null;
      }

      await board.save();

      // TODO: fix
      // emitBoardUpdatedEvent(io, board.toJSON());

      return board;
    },
    createIssueStatus: async (parent, { input }, { db }) => {
      const { projectId, name } = input;

      return await db.sequelize.models.IssueStatuses.create({
        projectId: Number(projectId),
        name,
      });
    },
    createIssueComment: async (parent, { input }, { db, user }) => {
      const { issueId, comment } = input;
      const reporterId = user.id;

      return await db.sequelize.models.IssueComment.create({
        issueId,
        reporterId,
        comment,
      });
    },
    deleteAsset: async (parent, { input }, { db }) => {
      const { assetId } = input;

      const findAsset = await db.sequelize.models.Asset.findByPk(assetId);

      if (!findAsset) {
        throw new Error('Asset not found');
      }

      await findAsset.destroy();
      await minioClient.removeObject(BUCKET_NAME, findAsset.assetFilename);

      return {
        message: 'success',
        status: 'success',
      };
    },
    uploadAsset: async (parent, { input }, { db, user }) => {
      const { assetExtension, file } = input;

      const { createReadStream, mimetype } = await file;

      const assetFilename = `${uuidv4()}.${assetExtension}`;

      const metaData = {
        'Content-Type': mimetype,
        'Uploaded-By-User-Id': user.id,
      };

      await minioClient.putObject(BUCKET_NAME, assetFilename, createReadStream(), metaData);

      return await db.sequelize.models.Asset.create({
        ownerId: user.id,
        assetType: '',
        assetSubType: '',
        assetPath: `${BUCKET_NAME}/${assetFilename}`,
        assetProvider: ASSET_PROVIDER,
        assetFilename: assetFilename,
      });
    },
    assignAssetAsAvatar: async (parent, { input }, { db, user }) => {
      const { assetId } = input;
      let findOldAvatarAsset;

      if (user.avatarAssetId) {
        findOldAvatarAsset = await db.sequelize.models.Asset.findByPk(user.avatarAssetId);
      }

      const findAsset = await db.sequelize.models.Asset.findByPk(assetId);

      user.avatarAssetId = assetId;
      await user.save();

      if (findOldAvatarAsset) {
        // TODO: Remove from minio
        await findOldAvatarAsset.destroy();
        await minioClient.removeObject(BUCKET_NAME, findOldAvatarAsset.assetFilename);
      }

      return findAsset;
    },
    // uploadAvatar: async (parent, { input }, { db, user }) => {
    //   const { data } = input;
    //   let finalAssetPath = '';
    //
    //   // Split the string on comma
    //   const parts = data.split(',');
    //
    //   // this gets the image extension of the uploaded source image
    //   // const imageExtension = parts[0].split(',')[0].split(';')[0].split(':')[1].replace('image/', '');
    //
    //   const base64Data = new Buffer(parts[1], 'base64');
    //
    //   let image = await sharp(base64Data, {
    //     height: 32,
    //     width: 32,
    //   });
    //
    //   // TODO: lets find more dynamic way to handle this
    //   if (ASSET_PROVIDER === 'filesystem') {
    //     finalAssetPath = `${ASSET_PATH}/avatars/user-${user.id}.webp`;
    //
    //     // Get the directory name from the file path
    //     const finalAssetDirectory = path.dirname(finalAssetPath);
    //
    //     try {
    //       await fs.access(finalAssetDirectory);
    //     } catch (error) {
    //       await fs.mkdir(finalAssetDirectory, { recursive: true });
    //     }
    //
    //     await image.webp().resize({ width: 128, height: 128 }).toFile(finalAssetPath);
    //   } else if (ASSET_PROVIDER === 's3') {
    //     finalAssetPath = `${ASSET_PATH}/avatars/user-${user.id}.webp`;
    //     // TODO: implement s3
    //   }
    //
    //   const findAsset = await db.sequelize.models.Asset.findOne({
    //     where: {
    //       ownerId: user.id,
    //       assetType: 'avatar',
    //       assetSubType: 'image',
    //     },
    //   });
    //
    //   if (findAsset) {
    //     findAsset.updatedAt = new Date();
    //     await findAsset.save();
    //     return findAsset;
    //   }
    //
    //   // TODO: decide if we want to await inside or outside... probably inside for now to catch exceptions
    //   return await db.sequelize.models.Asset.create({
    //     ownerId: user.id,
    //     assetType: 'avatar',
    //     assetSubType: 'image',
    //     assetPath: finalAssetPath,
    //     assetProvider: ASSET_PROVIDER,
    //     assetFilename: path.basename(finalAssetPath),
    //   });
    // },
    updateIssue: async (parent, { input }, { db, io }) => {
      const { id, issueStatusId, assigneeId, reporterId, title, description, tagIds, priority, archived } = input;

      const issue = await db.sequelize.models.Issue.findByPk(id);

      if (issueStatusId) issue.issueStatusId = issueStatusId;
      if (assigneeId) issue.assigneeId = Number(assigneeId);
      if (reporterId) issue.reporterId = Number(reporterId);
      if (title) issue.title = title;
      if (description) issue.description = description;
      if (priority) issue.priority = Number(priority);
      if (tagIds) {
        await db.sequelize.models.IssueTag.destroy({ where: { issueId: id } });
        await db.sequelize.models.IssueTag.bulkCreate(
          tagIds.map((tagId) => ({
            issueId: Number(id),
            projectTagId: Number(tagId),
          }))
        );
      }
      if (archived !== undefined) issue.archived = archived;

      // TODO: look for better way to handle nullifying user
      if (issue.assigneeId === 0) issue.assigneeId = null;
      if (issue.reporterId === 0) issue.reporterId = null;

      await issue.save();

      // TODO: fix
      // emitIssueUpdatedEvent(io, issue.toJSON());

      const issueStatus = await db.sequelize.models.IssueStatuses.findByPk(issueStatusId ?? issue.issueStatusId);

      return { ...issue.toJSON(), status: issueStatus.toJSON() };
    },
    createIssue: async (parent, { input }, { db, user }) => {
      const { projectId, boardId, issueStatusId, assigneeId, title, description, priority } = input;

      // TODO: create issue status as unassigned option

      const issue = await db.sequelize.models.Issue.create({
        projectId,
        issueStatusId,
        assigneeId,
        reporterId: user.id,
        title,
        description,
        priority,
      });

      if (typeof boardId !== 'undefined') {
        await db.sequelize.models.IssueBoard.create({
          boardId,
          issueId: issue.id,
        });
      }

      const issueStatus = await db.sequelize.models.IssueStatuses.findByPk(issueStatusId);

      return { ...issue.toJSON(), status: issueStatus.toJSON() };
    },
    deleteIssue: async (parent, { input }, { db }) => {
      const { id } = input;

      await db.sequelize.transaction(async (t) => {
        await db.sequelize.models.Issue.destroy({
          where: {
            id,
          },
          transaction: t,
        });

        // TODO: not needed due to cascade
        await db.sequelize.models.IssueComment.destroy({ where: { issueId: id }, transaction: t });
      });

      return { message: 'issue deleted', status: 'success' };
    },
    createProject: async (parent, { input }, { db }) => {
      const project = await db.sequelize.models.Project.create({
        name: input.name,
        key: input.key,
      });

      // TODO: maybe promise all here?

      // TODO: We should create mappings for these statuses
      const issueStatuses = await db.sequelize.models.IssueStatuses.bulkCreate([
        {
          projectId: Number(project.id),
          name: 'Backlog',
        },
        {
          projectId: Number(project.id),
          name: 'To Do',
        },
        {
          projectId: Number(project.id),
          name: 'In Progress',
        },
        {
          projectId: Number(project.id),
          name: 'Done',
        },
      ]);

      const board = await db.sequelize.models.Board.create({
        projectId: Number(project.id),
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
  Board: {
    issues: async (parent, args, { db }) => {
      const boardIssues = await db.sequelize.models.IssueBoard.findAll({
        where: { boardId: parent.id },
        raw: true,
      });

      const data = parent.Issues.map((issue) => ({
        ...issue.toJSON(),
        boardId: parent.id,
        position: boardIssues.find((boardIssue) => Number(boardIssue.issueId) === Number(issue.id)).position,
      }));

      return data;
    },
    containerOrder: (parent) => {
      return parent.containerOrder ? JSON.stringify(parent.containerOrder) : undefined;
    },
  },
  User: {
    avatarUrl: async (parent, args, { db }) => {
      const findAvatarAsset = await db.sequelize.models.Asset.findByPk(parent.avatarAssetId);

      if (findAvatarAsset) {
        return '/' + findAvatarAsset.assetPath;
      }

      return null;
    },
  },
  IssueComment: {
    reporter: (parent, args, { db }) => {
      return db.sequelize.models.User.findByPk(parent.reporterId);
    },
  },
  Issue: issueResolvers,
  Project: {
    tags: (parent, args, { db }) => {
      return db.sequelize.models.ProjectTag.findAll({ where: { projectId: parent.id } });
    },
    issues: (parent, args, { db }) => {
      const { input } = args;
      const findAllInput = { where: { projectId: parent.id } };

      if (input && input?.sortBy) {
        findAllInput.order = [input?.sortBy.map(({ field, order }) => [field, order])];
      }

      return db.sequelize.models.Issue.findAll(findAllInput);
    },
    boards: (parent, args, { db }) => {
      return db.sequelize.models.Board.findAll({ where: { projectId: parent.id } });
    },
    issueStatuses: (parent, args, { db }) => {
      return db.sequelize.models.IssueStatuses.findAll({ where: { projectId: parent.id } });
    },
    issueCount: async (parent, args, { db }) => {
      return db.sequelize.models.Issue.count({ where: { projectId: parent.id } });
    },
  },
  Query: {
    helloWorld: () => 'hello world',
    users: (parent, args, { db }) => {
      return db.sequelize.models.User.findAll();
    },
    me: (parent, args, { db, user }) => {
      return db.sequelize.models.User.findByPk(user.id);
    },
    user: (parent, { id, externalId }, { db }) => {
      if (externalId) {
        return db.sequelize.models.User.findOne({ where: { externalId } });
      }

      if (id) {
        return db.sequelize.models.User.findByPk(id);
      }
    },
    projects: (parent, args, { db }) => {
      return db.sequelize.models.Project.findAll();
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
      return db.sequelize.models.Project.findByPk(id);
    },
    projectTags: (parent, { input: { projectId, id, name } }, { db }) => {
      const where = { projectId };

      if (id) where.id = id;
      if (name) {
        where.name = {
          [Op.like]: `%${name}%`,
        };
      }

      return db.sequelize.models.ProjectTag.findAll({ where });
    },
    boards: (parent, args, { db }) => {
      // TODO: should we require a project id to show boards?
      return db.sequelize.models.Board.findAll();
    },
    board: async (parent, { input: { id } }, { db }) => {
      const boardInfo = await db.sequelize.models.Board.findByPk(id, {
        include: db.sequelize.models.Issue,
      });
      return boardInfo;
    },
    issues: (parent, { input: { projectId, id, search, searchOperator } }, { db }) => {
      let whereOr = [];
      let queryOperator = Op.or;

      if (projectId) whereOr = [...whereOr, { projectId: Number(projectId) }];
      if (id) whereOr = [...whereOr, { id: Number(id) }];
      if (search) {
        whereOr = [
          ...whereOr,
          {
            [Op.or]: {
              vectorSearch: {
                [Op.match]: db.Sequelize.fn('to_tsquery', search),
              },
              id: {
                [Op.eq]: search.replace(/[^0-9]/g, '') || null,
              },
            },
          },
        ];
      }
      if (searchOperator === 'and') queryOperator = Op.and;
      if (searchOperator === 'or') queryOperator = Op.or;

      return db.sequelize.models.Issue.findAll({
        include: [
          {
            model: db.sequelize.models.Project,
          },
          {
            model: db.sequelize.models.Issue,
            as: 'linkedToIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
          {
            model: db.sequelize.models.Issue,
            as: 'linkedByIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
        ],
        where: {
          [queryOperator]: whereOr,
        },
      });
    },
    issue: (parent, { input: { id } }, { db }) => {
      return db.sequelize.models.Issue.findByPk(id, {
        include: [
          {
            model: db.sequelize.models.Issue,
            as: 'linkedToIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
          {
            model: db.sequelize.models.Issue,
            as: 'linkedByIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
        ],
      });
    },
  },
};

export default resolvers;
