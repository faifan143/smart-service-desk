const notFoundHandler = (_req, _res, next) => {
  next({ status: 404, message: 'Route not found' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
};

module.exports = { notFoundHandler, errorHandler };






