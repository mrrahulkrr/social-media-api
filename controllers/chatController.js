const Chat = require('../models/Chat')

const getChatHistory = async(req, res) => {
    try {
        const {room}  = req.params;
        const chat = await Chat.find({room})
            .populate('user', 'name')
            .sort({createdAt: 1});
        res.json(chats);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getChatHistory
}