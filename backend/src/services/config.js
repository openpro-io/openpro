import { __dirname } from './utils.js';

export const HTTP_PORT = process.env.HTTP_PORT ?? 8080;
export const ASSET_PATH = process.env.ASSET_PATH ?? '../../' + __dirname + '/assets';
export const ASSET_PROVIDER = process.env.ASSET_PROVIDER ?? 'minio';
export const BUCKET_NAME = process.env.BUCKET_NAME ?? 'uploads';
export const USE_MINIO = process.env.USE_MINIO ?? '1';
export const MINIO_HOST = process.env.MINIO_HOST ?? 'localhost';
export const MINIO_PORT = process.env.MINIO_PORT ?? '9000';

export const MINIO_ROOT_USER = process.env.MINIO_ROOT_USER;
export const MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD;

export const SQL_URI = process.env.SQL_URI;

export const CORS_ORIGIN = process.env.CORS_ORIGIN;
