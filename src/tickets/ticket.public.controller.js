const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { listTickets } = require('./ticket.service');
const { formatTicketCollectionResponse } = require('./ticket.presenter');
const { renderTicketListPage } = require('./ticket.view');

router.get(
  '/view',
  asyncHandler(async (req, res) => {
    const collection = await listTickets(req.query);
    const payload = formatTicketCollectionResponse(req, collection);
    const html = renderTicketListPage({ payload });
    res.type('html').send(html);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const collection = await listTickets(req.query);
    res.json(formatTicketCollectionResponse(req, collection));
  })
);

module.exports = router;

