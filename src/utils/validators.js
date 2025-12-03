const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateRegister = ({ name, email, password, role }) => {
  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw { status: 400, message: 'Name, email and password are required' };
  }

  if (role && !['admin', 'staff'].includes(role)) {
    throw { status: 400, message: 'Invalid role' };
  }
};

const validateLogin = ({ email, password }) => {
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw { status: 400, message: 'Email and password are required' };
  }
};

const validateUserUpdate = ({ name, role, isActive }) => {
  if (role && !['admin', 'staff'].includes(role)) {
    throw { status: 400, message: 'Invalid role' };
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    throw { status: 400, message: 'isActive must be boolean' };
  }

  if (name !== undefined && !isNonEmptyString(name)) {
    throw { status: 400, message: 'Name must be a string' };
  }
};

const validateDepartmentPayload = ({ name, description }, { partial = false } = {}) => {
  if (!partial && !isNonEmptyString(name)) {
    throw { status: 400, message: 'Department name is required' };
  }
  if (partial && name !== undefined && !isNonEmptyString(name)) {
    throw { status: 400, message: 'Department name must be a string' };
  }
  if (description !== undefined && typeof description !== 'string') {
    throw { status: 400, message: 'Description must be a string' };
  }
};

const validateTicketPayload = (
  { title, description, departmentId, priority, status },
  { partial = false } = {}
) => {
  if (!partial && !isNonEmptyString(title)) {
    throw { status: 400, message: 'Title is required' };
  }
  if (partial && title !== undefined && !isNonEmptyString(title)) {
    throw { status: 400, message: 'Title must be a string' };
  }

  if (!partial && !isNonEmptyString(description)) {
    throw { status: 400, message: 'Description is required' };
  }
  if (partial && description !== undefined && !isNonEmptyString(description)) {
    throw { status: 400, message: 'Description must be a string' };
  }

  if (!partial && !isNonEmptyString(departmentId)) {
    throw { status: 400, message: 'Department is required' };
  }
  if (partial && departmentId !== undefined && !isNonEmptyString(departmentId)) {
    throw { status: 400, message: 'Department must be a string' };
  }

  if (!partial && !priority) {
    throw { status: 400, message: 'Priority is required' };
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    throw { status: 400, message: 'Invalid priority value' };
  }
  if (status && !['pending', 'in-progress', 'resolved'].includes(status)) {
    throw { status: 400, message: 'Invalid status value' };
  }
};

const validateCommentPayload = ({ message }) => {
  if (!isNonEmptyString(message)) {
    throw { status: 400, message: 'Message is required' };
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUserUpdate,
  validateDepartmentPayload,
  validateTicketPayload,
  validateCommentPayload,
};

