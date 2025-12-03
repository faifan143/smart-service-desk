const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server);

  io.on('connection', () => {
    // simple connection log
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };






