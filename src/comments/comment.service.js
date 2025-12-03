const Comment = require('./comment.model');
const { getIO } = require('../utils/socket');

const listComments = (ticketId) =>
  Comment.find({ ticketId })
    .populate('userId', 'name email role')
    .sort({ createdAt: 1 });

const createComment = async (payload) => {
  const comment = await Comment.create(payload);
  const populated = await comment.populate('userId', 'name email role');
  const io = getIO();
  if (io) {
    io.emit('commentAdded', populated);
  }
  return populated;
};

module.exports = { listComments, createComment };






