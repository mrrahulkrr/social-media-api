const socketIO = require('socket.io');
const Chat = require('../models/Chat');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('chatMessage', async (data) => {
      try {
        const chat = await Chat.create({
          user: data.userId,
          room: data.room,
          message: data.message
        });

        const populatedChat = await Chat.findById(chat._id)
          .populate('user', 'name');

        io.to(data.room).emit('message', {
          ...populatedChat.toObject(),
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Chat error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;

// const socketIO = require("socket.io")

// const initializeSocket = (server) => {
//     const io = socketIO(server, {
//         cors: {
//             origin: process.env.CLIENT_URL,
//             methods: ['GET', 'POST']
//         }
//     })

//     io.on('connection', (socket) => {
//         console.log('Client connected: ', socket.id)

//     socket.on('joinRoom', (roomId) => {
//         socket.join(roomId)
//         console.log(`User joined room: ${roomId}`)
//     })

//     socket.on('leaveRoom', (roomId) => {
//         socket.leave(roomId)
//         console.log(`User left room: ${roomId}`)
//     })

//     socket.on('chatMessage', async (data) => {
//         io.to(data.room).emit('message', {
//             userId: data.userId,
//             userName: data.userName,
//             message: data.message,
//             timestmp: new Date()
//         })
//         socket.leave(roomId)
//         console.log(`User left room: ${roomId}`)
//     })

//     socket.on('disconnect', () => {
//         console.log(`Client disconnected: ${socket.id}`)
//     })
// })

//     return io;
// }

// module.exports - initializeSocket;