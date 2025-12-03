const jwt = require('jsonwebtoken');

const authMiddleware = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.replace('Bearer ', '') : null;

  if (!token) {
    return next({ status: 401, message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (error) {
    return next({ status: 401, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;






