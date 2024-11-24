const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      user: req.user._id,
      text,
      mediaUrl
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' }
      });

    // Emit new post to all connected clients
    req.app.get('io').emit('newPost', populatedPost);

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('user', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts
};