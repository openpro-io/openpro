import { Server } from '@hocuspocus/server';
import { FRONTEND_HOSTNAME, HTTP_PORT } from './config.js';
import { Database } from '@hocuspocus/extension-database';
import { db } from '../db/index.js';
import axios from 'axios';

const hocuspocusServer = Server.configure({
  port: HTTP_PORT,
  address: '0.0.0.0',
  extensions: [
    new Database({
      fetch: ({ documentName }) => {
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
            const comment = await db.sequelize.models.IssueComment.findOne({
              where: {
                id: entityId,
              },
            });

            if (!comment) return resolve(null);

            const commentAsUnit8Array = new Uint8Array(comment.commentRaw);
            resolve(commentAsUnit8Array.length === 0 ? null : commentAsUnit8Array);
          }

          resolve(null);
        });
      },
      store: async ({ documentName, state }) => {
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

        if (entityType === 'issueComment' && entityField === 'comment') {
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
      },
    }),
  ],
  async onAuthenticate(data) {
    const { token } = data;

    if (!token) {
      console.warn('Throwing exception to tiptap user');
      throw new Error('Not authorized!');
    }

    let verifyJwt = {};

    try {
      verifyJwt = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      throw new Error('Unable to verify tiptap user!');
    }

    const {
      data: { provider, sub },
    } = verifyJwt;

    const externalId = `${provider}__${sub}`;

    const user = await db.sequelize.models.User.findOne({ where: { externalId } });

    return {
      user: user ? user.toJSON() : null,
    };
  },
});

export default hocuspocusServer;
