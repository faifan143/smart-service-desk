const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderSummaryCard = (label, data) => `
  <div class="card">
    <h3>${escapeHtml(label)}</h3>
    <div class="pill-group">
      ${Object.entries(data)
        .map(
          ([key, count]) => `
            <span class="pill">
              <span class="pill-label">${escapeHtml(key)}</span>
              <span class="pill-value">${escapeHtml(count)}</span>
            </span>
          `
        )
        .join('')}
    </div>
  </div>
`;

const formatDate = (value) => new Date(value).toLocaleString();
const diffInHours = (a, b) => {
  const diffMs = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(diffMs / 36e5);
};

const renderTicketRow = (ticket, index) => {
  const created = formatDate(ticket.createdAt);
  const updated = formatDate(ticket.updatedAt);
  const ageHours = diffInHours(ticket.createdAt, Date.now());
  return `
    <tr>
      <td>${index + 1}</td>
      <td>
        <div class="ticket-title">${escapeHtml(ticket.title)}</div>
        <div class="ticket-desc">${escapeHtml(ticket.description)}</div>
        <div class="tagline">Ticket ID: ${escapeHtml(ticket._id)}</div>
      </td>
      <td>
        <strong>${escapeHtml(ticket.userId?.name || '—')}</strong>
        <div class="subtle">${escapeHtml(ticket.userId?.email || '')}</div>
        <div class="tagline">Role: ${escapeHtml(ticket.userId?.role || 'n/a')}</div>
      </td>
      <td>
        <div>${escapeHtml(ticket.departmentId?.name || '—')}</div>
        <div class="tagline">${escapeHtml(ticket.departmentId?._id || '')}</div>
      </td>
      <td>
        <span class="badge status-${ticket.status}">${escapeHtml(ticket.status)}</span>
        <div class="micro-text">Updated: ${escapeHtml(updated)}</div>
      </td>
      <td>
        <span class="badge priority-${ticket.priority}">${escapeHtml(ticket.priority)}</span>
        <div class="micro-text">Age: ${escapeHtml(`${ageHours}h`)}</div>
      </td>
      <td>
        <div class="micro-text">Submitted: ${escapeHtml(created)}</div>
        <div class="micro-text">History: ${escapeHtml(ticket.__v ?? 0)} edits</div>
      </td>
    </tr>
  `;
};

const renderTicketListPage = ({ title = 'Smart Service Desk · Tickets', payload }) => {
  const { data, meta, summary, links } = payload;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #0f172a;
        background-color: #f8fafc;
      }
      body { margin: 0; padding: 32px; }
      h1 { font-size: 28px; margin-bottom: 8px; }
      h2 { font-size: 20px; margin: 32px 0 16px; }
      h3 { font-size: 16px; margin: 0 0 12px; }
      .subtle { color: #475569; font-size: 13px; }
      .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
      .card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
      .pill-group { display: flex; flex-wrap: wrap; gap: 8px; }
      .pill { background: #f1f5f9; border-radius: 999px; padding: 6px 14px; display: inline-flex; align-items: center; gap: 6px; }
      .pill-label { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; }
      .pill-value { font-weight: 600; font-size: 15px; color: #0f172a; }
      table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12); }
      th, td { padding: 16px 18px; text-align: left; vertical-align: top; font-size: 14px; }
      thead { background: linear-gradient(120deg, #0f172a, #1d4ed8); color: #fff; }
      tr:nth-child(every) {}
      tbody tr:nth-child(odd) { background: #f8fafc; }
      tbody tr:nth-child(even) { background: #fff; }
      tbody tr:hover { background: #e0f2fe; }
      .ticket-title { font-weight: 600; margin-bottom: 6px; }
      .ticket-desc { font-size: 13px; color: #475569; }
      .badge { border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
      .status-pending { background: #fef3c7; color: #92400e; }
      .status-in-progress { background: #dbeafe; color: #1d4ed8; }
      .status-resolved { background: #dcfce7; color: #166534; }
      .priority-low { background: #e2e8f0; color: #0f172a; }
      .priority-medium { background: #fde68a; color: #92400e; }
      .priority-high { background: #fee2e2; color: #991b1b; }
      .pagination { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px; }
      .pagination a { text-decoration: none; padding: 10px 16px; border-radius: 999px; border: 1px solid #cbd5f5; color: #1d4ed8; font-weight: 600; }
      .pagination a.active { background: #1d4ed8; color: #fff; border-color: transparent; }
      .tagline { font-size: 12px; color: #94a3b8; margin-top: 4px; }
      .micro-text { font-size: 12px; color: #475569; margin-top: 6px; }
    </style>
  </head>
  <body>
    <header>
      <h1>Ticket Observatory</h1>
      <p class="subtle">A live snapshot of your public Smart Service Desk tickets.</p>
    </header>

    <section>
      <h2>Portfolio Summary</h2>
      <div class="card-grid">
        ${renderSummaryCard('By Status', summary.status)}
        ${renderSummaryCard('By Priority', summary.priority)}
      </div>
    </section>

    <section>
      <h2>Open Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ticket</th>
            <th>Requester</th>
            <th>Department</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Lifecycle</th>
          </tr>
        </thead>
        <tbody>
          ${
            data.length
              ? data.map((ticket, index) => renderTicketRow(ticket, index)).join('')
              : '<tr><td colspan="7">No tickets found for the selected filters.</td></tr>'
          }
        </tbody>
      </table>
    </section>
  </body>
</html>`;
};

module.exports = { renderTicketListPage };

