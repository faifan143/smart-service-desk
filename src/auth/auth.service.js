const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');

const buildToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

const registerUser = async ({ name, email, password, role = 'staff' }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw { status: 400, message: 'Email already registered' };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  return { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  if (!user.isActive) {
    throw { status: 403, message: 'User is inactive' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = buildToken(user);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
  };
};

module.exports = { registerUser, loginUser };






