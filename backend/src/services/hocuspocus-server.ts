import { Database } from '@hocuspocus/extension-database';
import { Server, fetchPayload, storePayload } from '@hocuspocus/server';
import axios from 'axios';

import db from '../db/index.js';
import { cache } from './cache.js';
import { FRONTEND_HOSTNAME, HTTP_PORT } from './config.js';
import { hash } from './utils.js';
import { User } from '../db/models/types.js';

const fetch = async ({ documentName }: fetchPayload): Promise<Uint8Array | null> => {
  return new Promise(async (resolve, reject) => {
    const [entityType, entityId, entityField] = documentName.split('.');

    if (entityType === 'issue' && entityField === 'description') {
      let issue = null;

      try {
        issue = await db.Issue.findOne({
          where: {
            id: entityId,
          },
        });
      } catch (e) {
        reject(e);
      }

      if (!issue || !issue?.descriptionRaw) resolve(null);

      const descriptionAsUnit8Array = new Uint8Array(issue.descriptionRaw);
      resolve(descriptionAsUnit8Array.length === 0 ? null : descriptionAsUnit8Array);
    }

    if (entityType === 'issueComment' && entityField === 'comment') {
      // @ts-ignore
      if (!isFinite(entityId)) return resolve(null);

      const comment = await db.IssueComment.findOne({
        where: {
          id: entityId,
        },
      });

      // @ts-ignore
      if (!comment || !comment?.commentRaw) return resolve(null);

      // @ts-ignore
      const commentAsUnit8Array = new Uint8Array(comment.commentRaw);
      resolve(commentAsUnit8Array.length === 0 ? null : commentAsUnit8Array);
    }

    resolve(null);
  });
};

const store = async ({ documentName, state }: storePayload) => {
  const [entityType, entityId, entityField] = documentName.split('.');

  if (entityType === 'issue' && entityField === 'description') {
    await db.Issue.update(
      {
        // @ts-ignore
        descriptionRaw: state,
      },
      {
        where: {
          id: entityId,
        },
      }
    );
  }

  if (entityType === 'issueComment' && entityField === 'comment' && isFinite(Number(entityId))) {
    await db.IssueComment.update(
      {
        // @ts-ignore
        commentRaw: state,
      },
      {
        where: {
          id: entityId,
        },
      }
    );
  }
};

type OnAuthenticatePayload = {
  token?: string;
};

type VerifyJwtResponse = {
  data?: {
    provider?: string;
    sub?: string;
  };
};

type OnAuthenticateResponse = {
  user?: User;
}

const onAuthenticate = async (data: OnAuthenticatePayload): Promise<OnAuthenticateResponse> => {
  if (!data?.token) {
    console.warn('Throwing exception to tiptap user');
    throw new Error('Not authorized!');
  }

  const token = `Bearer ${data?.token}`;
  let sub = null;
  let provider = null;

  const cacheKey = hash(token);
  const cachedUser = cache.get(cacheKey);
  if (cachedUser) return { user: db.User.build(cachedUser).toJSON() };

  try {
    ({
      data: { provider, sub },
    } = <VerifyJwtResponse>await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
      headers: {
        authorization: token,
      },
    }));
  } catch (e) {
    throw new Error('Unable to verify tiptap user!');
  }

  const externalId = `${provider}__${sub}`;

  const user = <User>await db.User.findOne({
    where: { externalId },
  });

  cache.set(cacheKey, user, 5);

  return {
    user,
  };
};

const hocuspocusServer = Server.configure({
  port: Number(HTTP_PORT),
  address: '0.0.0.0',
  extensions: [
    new Database({
      fetch,
      store,
    }),
  ],
  onAuthenticate,
});

export default hocuspocusServer;
