const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateTicketPayload } = require('../utils/validators');
const { listTickets, createTicket, findTicketById, updateTicket, deleteTicket } = require('./ticket.service');
const { formatTicketCollectionResponse } = require('./ticket.presenter');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const collection = await listTickets(req.query);
    res.json(formatTicketCollectionResponse(req, collection));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    validateTicketPayload(req.body);
    const payload = {
      title: req.body.title,
      description: req.body.description,
      departmentId: req.body.departmentId,
      priority: req.body.priority,
      status: req.body.status,
      userId: req.user.id,
    };
    const ticket = await createTicket(payload);
    res.status(201).json(ticket);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const ticket = await findTicketById(req.params.id);
    if (!ticket) {
      return next({ status: 404, message: 'Ticket not found' });
    }
    res.json(ticket);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res, next) => {
    validateTicketPayload(req.body, { partial: true });
    const updates = {};
    ['title', 'description', 'departmentId', 'status', 'priority'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (!Object.keys(updates).length) {
      return next({ status: 400, message: 'Nothing to update' });
    }

    const updated = await updateTicket(req.params.id, updates);
    if (!updated) {
      return next({ status: 404, message: 'Ticket not found' });
    }
    res.json(updated);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const deleted = await deleteTicket(req.params.id);
    if (!deleted) {
      return next({ status: 404, message: 'Ticket not found' });
    }
    res.json({ success: true });
  })
);

module.exports = router;

