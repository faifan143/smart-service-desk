## API Overview

- Base URL: `http://localhost:4000`
- Authentication: `POST /auth/login` returns JWT; send via `Authorization: Bearer <token>`.
- Static uploads served from `/uploads`.
- Seed data (users, departments, tickets, comments, uploads): `npm run seed`

---

### Auth

| Method | Endpoint         | Description           | Body DTO                           | Notes                 |
|--------|------------------|-----------------------|------------------------------------|-----------------------|
| POST   | `/auth/register` | Register new user     | [RegisterDTO](#registerdto)        | Public                |
| POST   | `/auth/login`    | Authenticate user     | [LoginDTO](#logindto)              | Public, returns token |

---

### Users (Requires `admin`)

| Method | Endpoint     | Description                     | Body DTO                         |
|--------|--------------|---------------------------------|----------------------------------|
| GET    | `/users/`    | List users                      | –                                |
| GET    | `/users/:id` | Get user by ID                  | –                                |
| PATCH  | `/users/:id` | Update user                     | [UserUpdateDTO](#userupdatedto)  |
| DELETE | `/users/:id` | Delete user                     | –                                |

---

### Departments

| Method | Endpoint             | Description            | Body DTO                               | Notes        |
|--------|----------------------|------------------------|----------------------------------------|--------------|
| GET    | `/departments/`      | List departments       | –                                      | Any auth     |
| POST   | `/departments/`      | Create department      | [DepartmentDTO](#departmentdto)        | Admin only   |
| PATCH  | `/departments/:id`   | Update department      | [DepartmentPartialDTO](#departmentpartialdto) | Admin only   |
| DELETE | `/departments/:id`   | Delete department      | –                                      | Admin only   |

---

### Tickets

| Method | Endpoint       | Description                  | Body DTO                                   |
|--------|----------------|------------------------------|--------------------------------------------|
| GET    | `/tickets/`    | List tickets (query filters) | –                                          |
| POST   | `/tickets/`    | Create ticket                | [TicketDTO](#ticketdto)                    |
| GET    | `/tickets/:id` | Get ticket                   | –                                          |
| PATCH  | `/tickets/:id` | Update ticket                | [TicketPartialDTO](#ticketpartialdto)      |
| DELETE | `/tickets/:id` | Delete ticket                | –                                          |

---

### Ticket Comments (Mounted under `/tickets`)

| Method | Endpoint                            | Description                | Body DTO                       |
|--------|-------------------------------------|----------------------------|--------------------------------|
| GET    | `/tickets/:ticketId/comments`       | List ticket comments       | –                              |
| POST   | `/tickets/:ticketId/comments`       | Create comment             | [CommentDTO](#commentdto)      |

---

### Uploads

| Method | Endpoint            | Description        | Body DTO              | Notes                          |
|--------|---------------------|--------------------|-----------------------|--------------------------------|
| POST   | `/uploads/`         | Upload file        | [UploadDTO](#uploaddto) | Multipart `file` field         |
| GET    | `/uploads/<name>`   | Get file           | –                     | Public static asset            |

---

### Public Tickets

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/public/tickets/`    | Public JSON list (same filters as `/tickets`) |
| GET    | `/public/tickets/view` | HTML dashboard rendering of public ticket data |

#### Collection Response Blueprint

Both private and public list endpoints return a structured payload:

```json
{
  "data": [
    {
      "_id": "...",
      "title": "...",
      "description": "...",
      "userId": { "_id": "...", "name": "...", "email": "...", "role": "..." },
      "departmentId": { "_id": "...", "name": "..." },
      "status": "pending",
      "priority": "high",
      "createdAt": "ISODate",
      "updatedAt": "ISODate"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    },
    "filters": {
      "status": "pending",
      "department": null,
      "search": null
    },
    "generatedAt": "ISODate",
    "locale": "en-US"
  },
  "summary": {
    "status": {
      "pending": 21,
      "in-progress": 15,
      "resolved": 6
    },
    "priority": {
      "low": 12,
      "medium": 18,
      "high": 12
    }
  },
  "links": {
    "self": "/tickets?page=1",
    "first": "/tickets?page=1",
    "last": "/tickets?page=5",
    "next": "/tickets?page=2"
  }
}
```

---

### Complex Data Endpoint

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/public/complex/`    | Returns an extremely complex, deeply nested JSON response with static demo data |

**Note:** This endpoint is designed to demonstrate maximum complexity and nesting levels. The response includes:
- Multi-level nested objects and arrays
- Time series data with 30 days of metrics
- Graph structures (nodes, edges, communities)
- Workflow pipelines with stages and tasks
- User entities with relationships and activity
- Organization data with financials and structure
- Analytics with distributions and correlations
- System health and performance metrics
- Experimental features with deep nesting
- Recommendations with reasoning
- And much more...

The response is **static** (generated on each request) and serves as a test/demo endpoint for handling complex data structures.

---

## DTO Reference

### RegisterDTO
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "admin | staff (optional, defaults to staff)"
}
```

### LoginDTO
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

### UserUpdateDTO
```json
{
  "name": "string (optional)",
  "role": "admin | staff (optional)",
  "isActive": "boolean (optional)"
}
```

### DepartmentDTO
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

### DepartmentPartialDTO
```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

### TicketDTO
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "departmentId": "string (required)",
  "priority": "low | medium | high (required)",
  "status": "pending | in-progress | resolved (optional, defaults to pending)"
}
```

### TicketPartialDTO
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "departmentId": "string (optional)",
  "priority": "low | medium | high (optional)",
  "status": "pending | in-progress | resolved (optional)"
}
```

### CommentDTO
```json
{
  "message": "string (required)"
}
```

### UploadDTO
Multipart form-data with a single field:
```text
file: binary (required)
```

Response:
```json
{
  "url": "string",
  "originalName": "string",
  "size": "number",
  "mimetype": "string"
}
```

