export const TYPE_BOARD_UPDATED = 'BOARD_UPDATED';
export const TYPE_ISSUE_UPDATED = 'ISSUE_UPDATED';

const room = 'general';

const emitEvent = (io, type, data) => {
  io.to(room).emit('message', {
    type,
    data,
  });
};

export const emitBoardUpdatedEvent = (io, data) => {
  emitEvent(io, TYPE_BOARD_UPDATED, data);
};

export const emitIssueUpdatedEvent = (io, data) => {
  emitEvent(io, TYPE_ISSUE_UPDATED, data);
};
