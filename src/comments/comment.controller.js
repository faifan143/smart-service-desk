const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateCommentPayload } = require('../utils/validators');
const { listComments, createComment } = require('./comment.service');

router.get(
  '/:ticketId/comments',
  asyncHandler(async (req, res) => {
    const comments = await listComments(req.params.ticketId);
    res.json(comments);
  })
);

router.post(
  '/:ticketId/comments',
  asyncHandler(async (req, res) => {
    validateCommentPayload(req.body);
    const comment = await createComment({
      ticketId: req.params.ticketId,
      userId: req.user.id,
      message: req.body.message,
    });
    res.status(201).json(comment);
  })
);

module.exports = router;






