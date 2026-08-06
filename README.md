# Layered Task Manager REST API

A production-grade, stateless Task Manager REST API built on Node.js and Express. This application uses a layered architecture to achieve a complete separation of concerns between routing, request orchestration, business logic, and the persistence layers.

---

## Project Overview
The Task Manager REST API enables clients to create, read, update, partially update, and delete tasks. All tasks are persisted locally in a synchronous `task.json` file database to ensure data states remain intact between server executions, and the project demonstrates enterprise-standard API patterns, request logging, and payload validation.

---

## Features
- **Stateless CRUD operations** on task resources.
- **Layered Architecture**: Separation of routing (`routes`), orchestration (`controllers`), business rules (`services`), and data models (`models`).
- **Advanced Query Support**:
  - Filter by `status` (e.g. `pending`, `in-progress`, `completed`).
  - Filter by `priority` (e.g. `low`, `medium`, `high`).
  - Search by query term `search` (matching titles and descriptions).
  - Sort by any task attribute (e.g. `createdAt`, `title`) with customizable ordering (`asc` or `desc`).
- **Custom Middlewares**:
  - **Request Logger**: Logs timestamps, HTTP methods, paths, response codes, and execution times.
  - **Task Validator**: Strictly validates query payloads, checking parameter presence, lengths, and rejecting invalid options.
  - **Error Interceptor**: Standardises uncaught application errors into consistent JSON responses.

---

## REST Design Principles Followed
- **Resource-Based URI structure**: `/api/v1/tasks` identifies the task collection.
- **HTTP Methods as Actions**:
  - `GET` to fetch resources (safe and idempotent).
  - `POST` to create resources.
  - `PUT` for complete resource replacement.
  - `PATCH` for partial resource updates.
  - `DELETE` to remove resources.
- **Plural Nouns**: Resource endpoints are pluralized (`/tasks` instead of `/task`).
- **Versioned API**: Explicitly prefixed with `/v1` to ensure future backward compatibility.
- **Standard HTTP Status Codes**: Returns semantic codes like `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Server Error`.

---

## Project Folder Structure
```
task-manager-api/
├── app.js                     # Configures Express, mounts middlewares & listens on PORT
├── task.json                  # Synchronous file database (JSON storage)
├── package.json               # Scripts, test configurations & dependencies
├── .env                       # Environment configuration values
├── .gitignore                 # Files ignored by git
├── postman_collection.json    # Ready-to-import Postman test collection
│
├── src/
│   ├── config/
│   │      env.js              # Environment variable configurations
│   │
│   ├── routes/
│   │      task.routes.js      # REST routes with extensive inline comments
│   │
│   ├── controllers/
│   │      task.controller.js  # Request/Response controller orchestration
│   │
│   ├── services/
│   │      task.service.js     # Business rules, sorting, searching, and filters
│   │
│   ├── models/
│   │      task.model.js       # JSON file-based database model interface
│   │
│   ├── middlewares/
│   │      logger.middleware.js       # Standard request logger
│   │      validation.middleware.js   # Task schema payload validation
│   │      error.middleware.js        # Global error catcher
│   │
│   └── utils/
│          response.util.js    # Enveloped / raw response standardizers
│          constants.js        # Allowed status and priority values
│
├── test/
│   └── server.test.js         # Tap integration test suite
│
└── scripts/
    └── reset-tasks.js         # Database seeder utility run during pretest
```

---

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (a pre-configured `.env` is created for convenience):
   ```bash
   cp .env.example .env
   ```

---

## Environment Variables
The application reads the following variables from the `.env` file:
- `PORT`: The port number on which the Express server listens (default: `3000`).
- `NODE_ENV`: The execution environment state (default: `development`).

---

## Running the Project

- **Development Mode** (with automatic reload via `nodemon`):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```
- **Run Integration Tests**:
  ```bash
  npm test
  ```
  *(Note: Running the test suite automatically triggers the `pretest` script to reset `task.json` to its clean seed state).*

---

## API Endpoints

The API is mounted on two prefixes to support both legacy tests and versioned structures:
* Legacy / Testing prefix: `/tasks`
* Versioned prefix: `/api/v1/tasks`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/tasks` or `/api/v1/tasks` | Returns all tasks (with optional status/priority filtering and sorting) |
| **GET** | `/tasks/:id` or `/api/v1/tasks/:id` | Returns a specific task matching the ID |
| **POST** | `/tasks` or `/api/v1/tasks` | Creates a new task |
| **PUT** | `/tasks/:id` or `/api/v1/tasks/:id` | Replaces the entire task resource |
| **PATCH** | `/tasks/:id` or `/api/v1/tasks/:id` | Updates specific task field(s) |
| **DELETE** | `/tasks/:id` or `/api/v1/tasks/:id` | Deletes a task resource |

---

## Validation Rules

### For Creation (POST) & Replacement (PUT)
* **Title**: **Required** string, minimum 3 characters.
* **Description**: **Required** string.
* **Completed**: **Required** boolean value (`true` or `false`).
* **Priority**: Optional string. If provided, must be one of: `low`, `medium`, `high` (defaults to `medium`).
* **Status**: Optional string. If provided, must be one of: `pending`, `in-progress`, `completed` (defaults to `pending` or matches `completed` flag).

### For Partial Updates (PATCH)
* **Title**: Optional string, minimum 3 characters if provided.
* **Description**: Optional string.
* **Completed**: Optional boolean value.
* **Priority**: Optional string. If provided, must be one of: `low`, `medium`, `high`.
* **Status**: Optional string. If provided, must be one of: `pending`, `in-progress`, `completed`.

* **Invalid payloads** are rejected immediately with a `400 Bad Request` status code containing a JSON payload detailing all validation failures.

---

## Sample Request/Response

### Create a Task (POST `/api/v1/tasks`)

**Request Body**:
```json
{
  "title": "Configure logger middleware",
  "description": "Establish standard logger format.",
  "completed": false,
  "priority": "high",
  "status": "pending"
}
```

**Success Response (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "id": 4,
    "title": "Configure logger middleware",
    "description": "Establish standard logger format.",
    "completed": false,
    "priority": "high",
    "status": "pending",
    "createdAt": "2026-08-05T12:00:00.000Z"
  }
}
```

---

## Middleware

1. **Request Logger Middleware**:
   For every request, it intercepts and console-logs execution details:
   ```text
   [2026-08-05 12:15] GET /api/v1/tasks 200 OK - 5ms
   [2026-08-05 12:16] POST /api/v1/tasks 400 Error - 2ms
   ```
2. **Validation Middleware**:
   Filters request bodies against validation rules before they reach controllers.
3. **Error Handler Middleware**:
   Logs server error stack traces and intercepts them to prevent exposing internals to the user, returning a clean JSON error response.

---

## Filtering & Sorting Examples

- **Get all pending tasks**:
  `GET /api/v1/tasks?status=pending`
- **Get all high-priority tasks**:
  `GET /api/v1/tasks?priority=high`
- **Sort tasks by creation time descending**:
  `GET /api/v1/tasks?sortBy=createdAt&order=desc`
- **Combine filtering & sorting**:
  `GET /api/v1/tasks?status=in-progress&sortBy=title&order=asc`

---

## Postman Testing Guide

1. Open Postman.
2. Click **Import** and select the file `postman_collection.json` from the root of this project.
3. Once imported, you will see the **Task Manager API** collection containing pre-configured requests for listing, filtering, sorting, creating, updating, and deleting tasks.
4. Execute `npm run dev` to start the server, then run any query inside Postman.

---

## Future Improvements
- Integrate a relational database (e.g. PostgreSQL) or ODM (e.g. MongoDB/Mongoose) for persistent storage.
- Implement user authentication & authorization (JWT token headers).
- Add support for task tag categories and deadlines.
