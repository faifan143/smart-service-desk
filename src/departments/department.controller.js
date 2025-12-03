const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateDepartmentPayload } = require('../utils/validators');
const {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('./department.service');

const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next({ status: 403, message: 'Admin access required' });
  }
  return next();
};

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const departments = await listDepartments();
    res.json(departments);
  })
);

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    validateDepartmentPayload(req.body);
    const department = await createDepartment(req.body);
    res.status(201).json(department);
  })
);

router.patch(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res, next) => {
    validateDepartmentPayload(req.body, { partial: true });
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;

    if (!Object.keys(updates).length) {
      return next({ status: 400, message: 'Nothing to update' });
    }

    const updated = await updateDepartment(req.params.id, updates);
    if (!updated) {
      return next({ status: 404, message: 'Department not found' });
    }
    res.json(updated);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res, next) => {
    const deleted = await deleteDepartment(req.params.id);
    if (!deleted) {
      return next({ status: 404, message: 'Department not found' });
    }
    res.json({ success: true });
  })
);

module.exports = router;

