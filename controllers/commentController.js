const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const comment = await Comment.create({
      user: req.user._id,
      post: postId,
      text
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name');

    // Emit new comment to post room
    req.app.get('io').to(postId).emit('newComment', {
      comment: populatedComment,
      userName: req.user.name
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment
};
