export const handleConnection = ({ socket, req, context, clients }) => {
  let isAlive = true;

  const interval = setInterval(() => {
    if (isAlive === false) {
      socket.terminate();
    } else {
      isAlive = false;
      socket.ping(() => {});
    }
  }, 30000); // 30 seconds

  socket.on('pong', () => {
    isAlive = true;
  });

  socket.send(JSON.stringify({ type: 'HELLO', payload: { message: 'hi from server' } }));

  socket.on('message', (message) => {
    console.log('message', message.toString());
    if (message.toString() === 'ping') {
      socket.send('pong');
    }
  });

  socket.on('close', () => {
    clearInterval(interval);
  });
};

export const websocketBroadcast = ({ clients, message, namespace }) => {
  clients.forEach((client) => {
    if (namespace && client.namespace === namespace) {
      client.send(message);
    }
  });
};
