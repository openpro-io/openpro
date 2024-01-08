import type { BinaryLike } from 'crypto';
import * as crypto from 'node:crypto';
import * as url from 'node:url';

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const hash = (input: BinaryLike) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};
