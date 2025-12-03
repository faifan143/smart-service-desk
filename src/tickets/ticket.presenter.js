const { URLSearchParams } = require('url');

const cloneQuery = (query = {}) =>
  Object.entries(query).reduce((acc, [key, value]) => {
    acc[key] = Array.isArray(value) ? value[value.length - 1] : value;
    return acc;
  }, {});

const buildUrl = (baseUrl, query) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
};

const buildLinks = (baseUrl, query, pagination) => {
  const normalizedQuery = cloneQuery(query);
  const links = {
    self: buildUrl(baseUrl, { ...normalizedQuery, page: pagination.page }),
    first: buildUrl(baseUrl, { ...normalizedQuery, page: 1 }),
    last: buildUrl(baseUrl, { ...normalizedQuery, page: pagination.totalPages }),
  };

  if (pagination.page > 1) {
    links.prev = buildUrl(baseUrl, { ...normalizedQuery, page: pagination.page - 1 });
  }
  if (pagination.page < pagination.totalPages) {
    links.next = buildUrl(baseUrl, { ...normalizedQuery, page: pagination.page + 1 });
  }

  return links;
};

const formatTicketCollectionResponse = (req, collection) => {
  const baseUrl = req.baseUrl || '/tickets';
  return {
    data: collection.data,
    meta: {
      ...collection.meta,
      generatedAt: new Date().toISOString(),
      locale: req.headers['accept-language'] || 'en-US',
    },
    summary: collection.summary,
    links: buildLinks(baseUrl, req.query, collection.meta.pagination),
  };
};

module.exports = { formatTicketCollectionResponse };

