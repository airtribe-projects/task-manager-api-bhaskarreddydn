const taskService = require('../services/task.service');
const { success, error } = require('../utils/response.util');

/**
 * TaskController Class.
 * Coordinates client HTTP request payloads and delegates logic to the TaskService layer.
 * Standardises outputs using Response utility envelopes and routes errors to the global error middleware.
 */
class TaskController {
  
  /**
   * Retrieves all tasks.
   * Extracts query parameters for searching, filtering, and sorting, passing them down.
   */
  getAllTasks = (req, res, next) => {
    try {
      const { status, priority, sortBy, order, search } = req.query;
      
      // Request filtering and sorting logic in service layer
      const tasks = taskService.getAllTasks({ status, priority, sortBy, order, search });
      
      return success(res, tasks, 200);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Retrieves a single task by its unique numeric ID.
   * Validates ID parameter type before calling the service.
   */
  getTaskById = (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return error(res, 'Invalid task ID', 400);
      }

      const task = taskService.getTaskById(id);
      if (!task) {
        return error(res, `Task with ID ${id} not found`, 404);
      }

      return success(res, task, 200);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Creates a new task.
   * Input body payload is pre-validated by validateCreate middleware.
   */
  createTask = (req, res, next) => {
    try {
      // Delegate resource creation to service
      const newTask = taskService.createTask(req.body);
      return success(res, newTask, 201);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Replaces an entire task resource (PUT).
   * Input body payload is pre-validated by validateUpdate middleware.
   */
  updateTask = (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return error(res, 'Invalid task ID', 400);
      }

      // Delegate full resource replacement to service
      const updatedTask = taskService.updateTask(id, req.body);
      if (!updatedTask) {
        return error(res, `Task with ID ${id} not found`, 404);
      }

      return success(res, updatedTask, 200);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Partially updates a task resource (PATCH).
   * Input body payload is pre-validated by validatePatch middleware.
   */
  patchTask = (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return error(res, 'Invalid task ID', 400);
      }

      // Delegate partial resource updates to service
      const updatedTask = taskService.patchTask(id, req.body);
      if (!updatedTask) {
        return error(res, `Task with ID ${id} not found`, 404);
      }

      return success(res, updatedTask, 200);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Deletes a task resource by its unique numeric ID.
   */
  deleteTask = (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return error(res, 'Invalid task ID', 400);
      }

      const deleted = taskService.deleteTask(id);
      if (!deleted) {
        return error(res, `Task with ID ${id} not found`, 404);
      }

      return success(res, { message: `Task with ID ${id} has been deleted successfully` }, 200);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new TaskController();
