/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../src/config/database');
const User = require('../src/users/user.model');
const Department = require('../src/departments/department.model');
const Ticket = require('../src/tickets/ticket.model');
const Comment = require('../src/comments/comment.model');
const Upload = require('../src/uploads/upload.model');

const hashPassword = (password) => bcrypt.hash(password, 10);

const seed = async () => {
  await connectDB(process.env.MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Ticket.deleteMany({}),
    Comment.deleteMany({}),
    Upload.deleteMany({}),
  ]);

  const userSeeds = [
    { name: 'Alice Admin', email: 'admin@smartdesk.local', password: 'AdminPass123!', role: 'admin' },
    { name: 'Sam Staff', email: 'sam@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
    { name: 'Priya Patel', email: 'priya@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
    { name: 'Leo Martins', email: 'leo@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
    { name: 'Sara Yukio', email: 'sara@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
    { name: 'Maya Singh', email: 'maya@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
    { name: 'William Diaz', email: 'william@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
    { name: 'Ivy Johnson', email: 'ivy@smartdesk.local', password: 'StaffPass123!', role: 'staff' },
  ];

  const users = await User.insertMany(
    await Promise.all(
      userSeeds.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    )
  );

  const departments = await Department.insertMany([
    { name: 'IT Support', description: 'Handles all IT incidents and requests' },
    { name: 'HR Services', description: 'Employee relations and onboarding' },
    { name: 'Facilities', description: 'Office space, seating and equipment' },
    { name: 'Finance Ops', description: 'Expense approvals and audits' },
    { name: 'Security', description: 'Badge access and surveillance' },
  ]);

  const ticketSeeds = [
    {
      title: 'Laptop can’t connect to Wi-Fi',
      description: 'Connection drops frequently since yesterday afternoon.',
      department: 0,
      user: 1,
      priority: 'high',
      status: 'pending',
    },
    {
      title: 'New hire onboarding kit',
      description: 'Need laptop + badge for new hire starting next Monday.',
      department: 1,
      user: 0,
      priority: 'medium',
      status: 'in-progress',
    },
    {
      title: 'Projector bulb replacement',
      description: 'Conference room 3B projector is too dim.',
      department: 2,
      user: 2,
      priority: 'low',
      status: 'resolved',
    },
    {
      title: 'ERP access provisioning',
      description: 'Grant finance role to William before quarter close.',
      department: 3,
      user: 6,
      priority: 'high',
      status: 'pending',
    },
    {
      title: 'Overdue expense report',
      description: 'Expense report stuck in workflow since last Friday.',
      department: 3,
      user: 4,
      priority: 'medium',
      status: 'pending',
    },
    {
      title: 'Desk relocation request',
      description: 'Move Maya to collaboration zone for new project.',
      department: 2,
      user: 5,
      priority: 'medium',
      status: 'in-progress',
    },
    {
      title: 'VPN token lost',
      description: 'User Ivy misplaced hardware token, requesting reset.',
      department: 4,
      user: 7,
      priority: 'high',
      status: 'pending',
    },
    {
      title: 'Printer calibration needed',
      description: 'Marketing plotter prints with green tint.',
      department: 0,
      user: 3,
      priority: 'low',
      status: 'pending',
    },
    {
      title: 'Holiday calendar update',
      description: 'HR needs portal updated with regional holidays.',
      department: 1,
      user: 4,
      priority: 'low',
      status: 'resolved',
    },
    {
      title: 'Badge access for contractors',
      description: 'Provide temporary access for 6 visiting engineers.',
      department: 4,
      user: 0,
      priority: 'medium',
      status: 'in-progress',
    },
    {
      title: 'Slack integration failing',
      description: 'Ticket escalations no longer post to #it-alerts.',
      department: 0,
      user: 1,
      priority: 'high',
      status: 'pending',
    },
    {
      title: 'Office plants maintenance',
      description: 'Facilities check needed for level 7 east wing.',
      department: 2,
      user: 6,
      priority: 'low',
      status: 'pending',
    },
    {
      title: 'Executive dashboard refresh',
      description: 'CEO requests updated metrics by tomorrow 9am.',
      department: 3,
      user: 0,
      priority: 'high',
      status: 'in-progress',
    },
    {
      title: 'Conference room booking bug',
      description: 'Double-bookings occurring on web calendar.',
      department: 0,
      user: 5,
      priority: 'medium',
      status: 'pending',
    },
    {
      title: 'New security awareness posters',
      description: 'Design + print updated posters for November campaign.',
      department: 4,
      user: 2,
      priority: 'low',
      status: 'resolved',
    },
  ];

  const tickets = await Ticket.insertMany(
    ticketSeeds.map((ticket) => ({
      title: ticket.title,
      description: ticket.description,
      departmentId: departments[ticket.department]._id,
      userId: users[ticket.user]._id,
      priority: ticket.priority,
      status: ticket.status,
    }))
  );

  const commentSeeds = [
    { ticket: 0, author: 0, message: 'Investigating with network team, will update shortly.' },
    { ticket: 1, author: 1, message: 'Assets requested from procurement, ETA tomorrow.' },
    { ticket: 2, author: 0, message: 'Replacement scheduled during off-hours.' },
    { ticket: 3, author: 6, message: 'Need approval from finance controller first.' },
    { ticket: 4, author: 4, message: 'Workflow restarted, watching for completion.' },
    { ticket: 5, author: 5, message: 'Move scheduled for Wednesday 10am.' },
    { ticket: 6, author: 7, message: 'Temporary token issued, permanent pending.' },
    { ticket: 7, author: 3, message: 'Technician dispatched with calibration kit.' },
    { ticket: 8, author: 4, message: 'Awaiting HR leadership sign-off.' },
    { ticket: 9, author: 0, message: 'Security preparing visitor badges.' },
  ];

  await Comment.insertMany(
    commentSeeds.map((comment) => ({
      ticketId: tickets[comment.ticket]._id,
      userId: users[comment.author]._id,
      message: comment.message,
    }))
  );

  await Upload.insertMany([
    {
      filename: 'guide-onboarding.pdf',
      originalName: 'Onboarding Guide.pdf',
      mimetype: 'application/pdf',
      size: 102400,
      url: '/uploads/guide-onboarding.pdf',
    },
    {
      filename: 'floorplan-level3.png',
      originalName: 'Floor Plan Level 3.png',
      mimetype: 'image/png',
      size: 204800,
      url: '/uploads/floorplan-level3.png',
    },
    {
      filename: 'expense-policy-2025.docx',
      originalName: 'Expense Policy 2025.docx',
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 307200,
      url: '/uploads/expense-policy-2025.docx',
    },
    {
      filename: 'security-checklist.xlsx',
      originalName: 'Security Checklist.xlsx',
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 512000,
      url: '/uploads/security-checklist.xlsx',
    },
  ]);

  console.log('Seed data created successfully.');
  console.log('Admin login: admin@smartdesk.local / AdminPass123!');
  console.log('Sample staff login: sam@smartdesk.local / StaffPass123!');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seeding failed:', error);
  mongoose.connection.close().finally(() => process.exit(1));
});

