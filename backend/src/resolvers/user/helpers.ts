import type { User } from '../../db/models/types.js';

export const formatUserForGraphql = (user: User) => {
  return {
    ...user.toJSON(),
    id: `${user.id}`,
    settings: user.settings ? JSON.stringify(user.settings) : null,
  };
};
