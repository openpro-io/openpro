import type { FastifyRequest, RequestGenericInterface } from 'fastify';
import type http from 'http';
import type Sequelize from 'sequelize/types/sequelize';
import type { Readable } from 'stream';

import { Project, ProjectPermission, ProjectTag, User } from './db/models/types.js';

export type Model = {
  associate?: (db: Db) => void;
};

export type Db = {
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
  User?: typeof User;
  Project?: typeof Project;
  Board?: Model;
  IssueStatuses?: Model;
  Issue?: Model;
  Asset?: Model;
  IssueComment?: Model;
  ProjectTag?: typeof ProjectTag;
  IssueTag?: Model;
  IssueBoard?: Model;
  IssueLinks?: Model;
  ProjectPermissions?: typeof ProjectPermission;
  ProjectCustomFields?: Model;
  init?: () => Promise<void>;
};

export interface IQuerystring {}

export interface IHeaders {
  connection?: string;
}

export interface IParams {
  file?: any;
}

export interface IReply {
  200?: { success: boolean };
  302?: { url: string };
  401?: { error: string };
  error?: string;
  Readable?: Readable;
  ReadableBase?: Readable;
}

export interface requestGeneric extends RequestGenericInterface {
  Querystring: IQuerystring;
  Headers: IHeaders;
  Reply: IReply;
  Params: IParams;
}

export interface customRequest extends http.IncomingMessage {
  isMultipart?: boolean;
}

export interface AuthenticatedUser {
  user: any;
}

export type CustomFastifyRequest = FastifyRequest<{
  Body: {
    query?: string;
    variables?: any;
  };
  Headers: {
    authorization?: string;
  };
}>;
