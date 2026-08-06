const express = require('express');
const taskController = require('../controllers/task.controller');
const { validateCreate, validateUpdate, validatePatch } = require('../middlewares/validation.middleware');

const router = express.Router();

/**
 * ------------------------------------------------------------
 * Resource       : Tasks
 * Resource Type  : Collection
 * API Version    : v1
 * Endpoint       : GET /api/v1/tasks
 * HTTP Method    : GET
 *
 * Description
 * Returns all tasks. Supports filtering by status and priority,
 * and sorting by a specific task key (e.g. createdAt, title).
 *
 * Success
 * 200 OK
 *
 * Error
 * 500 Internal Server Error
 * ------------------------------------------------------------
 */
router.get('/', taskController.getAllTasks);

/**
 * ------------------------------------------------------------
 * Resource       : Tasks
 * Resource Type  : Member
 * API Version    : v1
 * Endpoint       : GET /api/v1/tasks/:id
 * HTTP Method    : GET
 *
 * Description
 * Returns a task resource by its unique identifier.
 *
 * Success
 * 200 OK
 *
 * Error
 * 400 Bad Request
 * 404 Not Found
 * 500 Internal Server Error
 * ------------------------------------------------------------
 */
router.get('/:id', taskController.getTaskById);

/**
 * ------------------------------------------------------------
 * Resource       : Tasks
 * Resource Type  : Collection
 * API Version    : v1
 * Endpoint       : POST /api/v1/tasks
 * HTTP Method    : POST
 *
 * Description
 * Creates a new task with validated inputs.
 *
 * Success
 * 201 Created
 *
 * Error
 * 400 Bad Request
 * 500 Internal Server Error
 * ------------------------------------------------------------
 */
router.post('/', validateCreate, taskController.createTask);

/**
 * ------------------------------------------------------------
 * Resource       : Tasks
 * Resource Type  : Member
 * API Version    : v1
 * Endpoint       : PUT /api/v1/tasks/:id
 * HTTP Method    : PUT
 *
 *
 * Description
 * Replaces the entire task resource with the provided details.
 *
 * Success
 * 200 OK
 *
 * Error
 * 400 Bad Request
 * 404 Not Found
 * 500 Internal Server Error
 * ------------------------------------------------------------
 */
router.put('/:id', validateUpdate, taskController.updateTask);

/**
 * ------------------------------------------------------------
 * Resource       : Tasks
 * Resource Type  : Member
 * API Version    : v1
 * Endpoint       : PATCH /api/v1/tasks/:id
 * HTTP Method    : PATCH
 *
 * Description
 * Updates specific field values on a task resource.
 *
 * Success
 * 200 OK
 *
 * Error
 * 400 Bad Request
 * 404 Not Found
 * 500 Internal Server Error
 * ------------------------------------------------------------
 */
router.patch('/:id', validatePatch, taskController.patchTask);

/**
 * ------------------------------------------------------------
 * Resource       : Tasks
 * Resource Type  : Member
 * API Version    : v1
 * Endpoint       : DELETE /api/v1/tasks/:id
 * HTTP Method    : DELETE
 *
 * Description
 * Deletes a specific task resource by its unique identifier.
 *
 * Success
 * 200 OK
 *
 * Error
 * 400 Bad Request
 * 404 Not Found
 * 500 Internal Server Error
 * ------------------------------------------------------------
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
