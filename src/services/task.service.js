const taskModel = require('../models/task.model');

/**
 * TaskService Class.
 * Handles the application's core business logic, including task list retrieval
 * with filtering by status/priority, searching title/description, sorting, and CRUD.
 */
class TaskService {
  
  /**
   * Retrieves tasks from the model layer and applies filters, searches, and sorting.
   *
   * @param {Object} filters - Query configuration filters
   * @param {string} [filters.status] - Filter tasks by status (exact, case-insensitive)
   * @param {string} [filters.priority] - Filter tasks by priority level (exact, case-insensitive)
   * @param {string} [filters.search] - Partial match search term for title and description
   * @param {string} [filters.sortBy='createdAt'] - Resource attribute key to sort tasks by
   * @param {string} [filters.order='asc'] - Sort order direction ('asc' or 'desc')
   * @returns {Array} List of filtered and sorted tasks
   */
  getAllTasks(filters = {}) {
    // Retrieve all raw tasks from the model layer
    let tasks = taskModel.findAll();

    // 1. Filtering by Status (e.g. pending, in-progress, completed)
    if (filters.status) {
      tasks = tasks.filter(t => t.status && t.status.toLowerCase() === filters.status.toLowerCase());
    }

    // 2. Filtering by Priority (e.g. low, medium, high)
    if (filters.priority) {
      tasks = tasks.filter(t => t.priority && t.priority.toLowerCase() === filters.priority.toLowerCase());
    }

    // 3. Search Query matching against title or description substring
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(t => 
        (t.title && t.title.toLowerCase().includes(searchLower)) || 
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    // 4. Sorting logic
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order && filters.order.toLowerCase() === 'desc' ? -1 : 1;

    // Create a copy of the tasks array to prevent direct mutation of the seed store
    tasks = [...tasks].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      // Handle undefined or missing fields gracefully by pushing them to the end
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      // Safe string comparisons (e.g. for titles, dates, or priorities)
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * order;
      }

      // Safe numeric comparisons (e.g. for IDs)
      if (valA < valB) return -1 * order;
      if (valA > valB) return 1 * order;
      return 0;
    });

    return tasks;
  }

  /**
   * Retrieves a task resource by its numeric identifier from the model layer.
   *
   * @param {number} id - Unique task identifier
   * @returns {Object|null} Matching task object or null if not found
   */
  getTaskById(id) {
    return taskModel.findById(id);
  }

  /**
   * Creates a new task resource.
   *
   * @param {Object} taskData - Request payload data containing the properties
   * @returns {Object} Newly created task instance details
   */
  createTask(taskData) {
    return taskModel.create(taskData);
  }

  /**
   * Fully updates / replaces a task resource (PUT).
   *
   * @param {number} id - Task unique identifier
   * @param {Object} taskData - Updated task resource fields
   * @returns {Object|null} Updated task details or null if task not found
   */
  updateTask(id, taskData) {
    return taskModel.update(id, taskData);
  }

  /**
   * Partially updates a task resource (PATCH).
   *
   * @param {number} id - Task unique identifier
   * @param {Object} taskData - Partial subset of task resource fields to update
   * @returns {Object|null} Updated task details or null if task not found
   */
  patchTask(id, taskData) {
    return taskModel.patch(id, taskData);
  }

  /**
   * Deletes a task resource.
   *
   * @param {number} id - Task unique identifier
   * @returns {boolean} True if task was deleted, false if task not found
   */
  deleteTask(id) {
    return taskModel.delete(id);
  }
}

module.exports = new TaskService();
