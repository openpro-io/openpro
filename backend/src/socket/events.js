export const TYPE_BOARD_UPDATED = 'BOARD_UPDATED';

const room = 'general';

export const emitBoardUpdatedEvent = (io, data) => {
  const message = {
    type: TYPE_BOARD_UPDATED,
    data,
  };

  io.to(room).emit('message', message);
};
