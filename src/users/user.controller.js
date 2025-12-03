const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateUserUpdate } = require('../utils/validators');
const { listUsers, findUserById, updateUser, removeUser } = require('./user.service');

const ensureAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next({ status: 403, message: 'Admin access required' });
  }
  return next();
};

router.get(
  '/',
  ensureAdmin,
  asyncHandler(async (_req, res) => {
    const users = await listUsers();
    res.json(users);
  })
);

router.get(
  '/:id',
  ensureAdmin,
  asyncHandler(async (req, res, next) => {
    const user = await findUserById(req.params.id);
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }
    res.json(user);
  })
);

router.patch(
  '/:id',
  ensureAdmin,
  asyncHandler(async (req, res, next) => {
    validateUserUpdate(req.body);
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.role !== undefined) updates.role = req.body.role;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    if (!Object.keys(updates).length) {
      return next({ status: 400, message: 'Nothing to update' });
    }

    const updated = await updateUser(req.params.id, updates);
    if (!updated) {
      return next({ status: 404, message: 'User not found' });
    }
    res.json(updated);
  })
);

router.delete(
  '/:id',
  ensureAdmin,
  asyncHandler(async (req, res, next) => {
    const deleted = await removeUser(req.params.id);
    if (!deleted) {
      return next({ status: 404, message: 'User not found' });
    }
    res.json({ success: true });
  })
);

module.exports = router;

