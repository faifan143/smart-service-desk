const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateRegister, validateLogin } = require('../utils/validators');
const { registerUser, loginUser } = require('./auth.service');

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    validateRegister(req.body);
    const user = await registerUser(req.body);
    res.status(201).json(user);
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    validateLogin(req.body);
    const payload = await loginUser(req.body);
    res.json(payload);
  })
);

module.exports = router;






