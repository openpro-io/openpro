import { Database } from '@hocuspocus/extension-database';
import { Server, fetchPayload, storePayload } from '@hocuspocus/server';
import axios from 'axios';

import db from '../db/index.js';
import { cache } from './cache';
import { FRONTEND_HOSTNAME, HTTP_PORT } from './config.js';
import { hash } from './utils';

const fetch = async ({ documentName }: fetchPayload): Promise<Uint8Array | null> => {
  return new Promise(async (resolve, reject) => {
    const [entityType, entityId, entityField] = documentName.split('.');

    if (entityType === 'issue' && entityField === 'description') {
      let issue = null;

      try {
        issue = await db.sequelize.models.Issue.findOne({
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

      const comment = await db.sequelize.models.IssueComment.findOne({
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
    await db.sequelize.models.Issue.update(
      {
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
    await db.sequelize.models.IssueComment.update(
      {
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

const onAuthenticate = async (data: any) => {
  let token = data?.token;

  if (!token) {
    console.warn('Throwing exception to tiptap user');
    throw new Error('Not authorized!');
  }

  token = `Bearer ${token}`;

  const cacheKey = hash(token);

  const cachedUser = cache.get(cacheKey);

  if (cachedUser) return { user: db.User.build(cachedUser).toJSON() };

  let verifyJwt = {};

  try {
    verifyJwt = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
      headers: {
        authorization: token,
      },
    });
  } catch (e) {
    throw new Error('Unable to verify tiptap user!');
  }

  const {
    // @ts-ignore
    data: { provider, sub },
  } = verifyJwt;

  const externalId = `${provider}__${sub}`;

  const user = await db.sequelize.models.User.findOne({
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
