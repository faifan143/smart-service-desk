const Ticket = require('./ticket.model');
const { getIO } = require('../utils/socket');

const emitTicketUpdate = (ticket) => {
  const io = getIO();
  if (io && ticket) {
    io.emit('ticketUpdated', ticket);
  }
};

const listTickets = async ({ status, department, search, page = 1, limit = 10 }) => {
  const filters = {};
  if (status) filters.status = status;
  if (department) filters.departmentId = department;
  if (search) filters.title = { $regex: search, $options: 'i' };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const [items, total, statusBuckets, priorityBuckets] = await Promise.all([
    Ticket.find(filters)
      .populate('userId', 'name email role')
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Ticket.countDocuments(filters),
    Ticket.aggregate([{ $match: filters }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $match: filters }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
  ]);

  const buildSummaryMap = (buckets, keys) =>
    keys.reduce((acc, key) => {
      acc[key] = buckets.find((bucket) => bucket._id === key)?.count || 0;
      return acc;
    }, {});

  const pagination = {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.max(1, Math.ceil(total / limitNum)),
  };

  return {
    data: items,
    meta: {
      pagination,
      filters: {
        status: status || null,
        department: department || null,
        search: search || null,
      },
    },
    summary: {
      status: buildSummaryMap(statusBuckets, ['pending', 'in-progress', 'resolved']),
      priority: buildSummaryMap(priorityBuckets, ['low', 'medium', 'high']),
    },
  };
};

const createTicket = async (payload) => {
  const ticket = await Ticket.create(payload);
  const populated = await ticket.populate(['userId', 'departmentId']);
  emitTicketUpdate(populated);
  return populated;
};

const findTicketById = (id) =>
  Ticket.findById(id).populate('userId', 'name email role').populate('departmentId', 'name');

const updateTicket = async (id, data) => {
  const ticket = await Ticket.findByIdAndUpdate(id, data, { new: true })
    .populate('userId', 'name email role')
    .populate('departmentId', 'name');
  if (ticket) {
    emitTicketUpdate(ticket);
  }
  return ticket;
};

const deleteTicket = async (id) => Ticket.findByIdAndDelete(id);

module.exports = { listTickets, createTicket, findTicketById, updateTicket, deleteTicket };





