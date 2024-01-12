import { __dirname } from './utils.js';
import yn from 'yn';
import process from 'node:process';

export const HTTP_PORT = process.env.HTTP_PORT ?? 8080;
export const ASSET_PATH = process.env.ASSET_PATH ?? '../../' + __dirname + '/assets';
export const ASSET_PROVIDER = process.env.ASSET_PROVIDER ?? 'minio';
export const BUCKET_NAME = process.env.BUCKET_NAME ?? 'uploads';
export const USE_MINIO = yn(process.env.USE_MINIO ?? true);
export const MINIO_HOST = process.env.MINIO_HOST ?? 'localhost';
export const MINIO_PORT = process.env.MINIO_PORT ?? '9000';

export const MINIO_ROOT_USER = process.env.MINIO_ROOT_USER;
export const MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD;

export const SQL_URI = process.env.SQL_URI;

export const CORS_ORIGIN = process.env.CORS_ORIGIN;

export const FRONTEND_HOSTNAME = process.env.FRONTEND_HOSTNAME;

export const ENABLE_FASTIFY_LOGGING = process.env.ENABLE_FASTIFY_LOGGING === 'true';
export const ENABLE_SEQUELIZE_LOGGING = process.env.ENABLE_SEQUELIZE_LOGGING === 'true';

export const ALLOW_SIGNUP = yn(process.env.ALLOW_SIGNUP ?? true);
export const ALLOW_LOGIN_EMAILS_LIST = process.env.ALLOW_LOGIN_EMAILS_LIST ? process.env.ALLOW_LIST.split(',') : [];
export const ALLOW_LOGIN_DOMAINS_LIST = process.env.ALLOW_LOGIN_DOMAINS_LIST
  ? process.env.ALLOW_LOGIN_DOMAINS_LIST.split(',')
  : [];
