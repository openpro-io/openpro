import * as Minio from 'minio';
import { MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_PORT, MINIO_HOST } from './config.js';

export const minioClient = new Minio.Client({
  endPoint: MINIO_HOST,
  port: parseInt(MINIO_PORT),
  useSSL: false,
  accessKey: MINIO_ROOT_USER,
  secretKey: MINIO_ROOT_PASSWORD,
});
