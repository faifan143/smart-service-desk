const User = require('./user.model');

const listUsers = () => User.find().sort({ createdAt: -1 });

const findUserById = (id) => User.findById(id);

const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true });

const removeUser = (id) => User.findByIdAndDelete(id);

module.exports = {
  listUsers,
  findUserById,
  updateUser,
  removeUser,
};






