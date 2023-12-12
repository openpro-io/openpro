import axios from 'axios';
import { FRONTEND_HOSTNAME } from '../services/config.js';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

const authMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  let user = null;

  try {
    // TODO: maybe we just call the url of the caller origin
    const { data } = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const externalId = `${data.provider}__${data.sub}`;

    user = await db.sequelize.models.User.findOne({ where: { externalId } });
  } catch (e) {
    if (e?.response?.status === 401) {
      const err = new Error('not authorized');
      err.data = { content: 'Please retry later' }; // additional details
      next(err);
      // TODO: lets refactor this block of code
      return;
    } else {
      // TODO: We should probably throw a 500 here and log the error
      console.error({ e });
    }
  }

  if (!user) {
    return next(new Error('Authentication error'));
  }

  socket.user = user;

  next();
};

const middleWares = [authMiddleware];

export const socketInit = (fastifySocketIo) => {
  middleWares.forEach((middleware) => {
    fastifySocketIo.use(middleware);
  });

  fastifySocketIo.on('connection', (socket) => {
    console.log('websocket user connected', socket.user.externalId, socket.user.email);
    socket.join('general');
    socket.join(`user:${socket.user.externalId}`);

    socket.on('message', function (data) {
      const room = data.topic;
      if (!data.messageId) data.messageId = uuidv4();
      socket.in(room).emit('message', data);
    });
  });
};
