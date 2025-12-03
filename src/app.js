const express = require('express');
const path = require('path');
const authRoutes = require('./auth/auth.controller');
const userRoutes = require('./users/user.controller');
const departmentRoutes = require('./departments/department.controller');
const ticketRoutes = require('./tickets/ticket.controller');
const publicTicketRoutes = require('./tickets/ticket.public.controller');
const complexRoutes = require('./public/complex.controller');
const commentRoutes = require('./comments/comment.controller');
const uploadRoutes = require('./uploads/upload.controller');
const authMiddleware = require('./utils/authMiddleware');
const { notFoundHandler, errorHandler } = require('./utils/errorHandler');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' , status: 'healthy' });
});
app.use('/auth', authRoutes);
app.use('/public/tickets', publicTicketRoutes);
app.use('/public/complex', complexRoutes);

app.use(authMiddleware);
app.use('/users', userRoutes);
app.use('/departments', departmentRoutes);
app.use('/tickets', ticketRoutes);
app.use('/tickets', commentRoutes);
app.use('/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;