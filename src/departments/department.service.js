const Department = require('./department.model');

const listDepartments = () => Department.find().sort({ createdAt: -1 });

const createDepartment = (data) => Department.create(data);

const updateDepartment = (id, data) => Department.findByIdAndUpdate(id, data, { new: true });

const deleteDepartment = (id) => Department.findByIdAndDelete(id);

module.exports = { listDepartments, createDepartment, updateDepartment, deleteDepartment };






