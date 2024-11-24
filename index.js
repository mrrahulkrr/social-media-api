require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const connectDB = require('./config/db');
const initializeSocket = require('./config/socket');
const { errorHandler } = require('./middleware/error');

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express()
const httpServer = createServer(app);
const io = initializeSocket(httpServer);
connectDB();

app.use(cors());
app.use(express.json())
app.set('io', io);


app.use('api/users', userRoutes);
app.use('api/posts', postRoutes);
app.use('api/comments', commentRoutes);
app.use('api/chats', chatRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));