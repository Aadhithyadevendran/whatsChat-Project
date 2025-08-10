module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('message', ({ room, message }) => {
      io.to(room).emit('newMessage', message);
    });
  });
};
