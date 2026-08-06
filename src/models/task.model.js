const fs = require('fs');
const path = require('path');

// Resolve the path to task.json in the root folder relative to this model file
const FILE_PATH = path.join(__dirname, '../../task.json');

/**
 * TaskModel Class.
 * Wraps file system persistence (`task.json`).
 * Automatically reads and writes state updates synchronously to simulate transactional file storage.
 */
class TaskModel {
  constructor() {
    this.filePath = FILE_PATH;
    
    // Load initial tasks from the task.json file
    this.tasks = this._readFromFile();
    
    // Seed currentId based on the highest ID existing in the loaded array, or default to 0
    this.currentId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) : 0;
  }

  /**
   * Helper function to read from the JSON file synchronously.
   */
  _readFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return parsed.tasks || [];
      }
      return [];
    } catch (err) {
      console.error('Error reading task.json persistence file:', err);
      return [];
    }
  }

  /**
   * Helper function to write the updated task array to the JSON file synchronously.
   */
  _writeToFile() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify({ tasks: this.tasks }, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to task.json persistence file:', err);
    }
  }

  /**
   * Retrieves all tasks currently stored.
   *
   * @returns {Array} List of all tasks
   */
  findAll() {
    // Reload state from file in case it was modified externally
    this.tasks = this._readFromFile();
    return this.tasks;
  }

  /**
   * Finds a task matching a specific numeric ID.
   *
   * @param {number} id - Numeric task identifier
   * @returns {Object|null} Matching task object or null if not found
   */
  findById(id) {
    this.tasks = this._readFromFile();
    return this.tasks.find(t => t.id === id) || null;
  }

  /**
   * Inserts a new task resource into the store and writes to disk.
   *
   * @param {Object} taskData - Fields for the new task
   * @returns {Object} Newly created task resource instance
   */
  create(taskData) {
    this.tasks = this._readFromFile();
    this.currentId += 1;
    
    const newTask = {
      id: this.currentId,
      title: taskData.title,
      description: taskData.description || '',
      completed: taskData.completed !== undefined ? taskData.completed : false,
      priority: taskData.priority || 'medium',
      status: taskData.status || (taskData.completed ? 'completed' : 'pending'),
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    this._writeToFile();
    
    return newTask;
  }

  /**
   * Fully replaces an existing task resource (PUT) and writes to disk.
   *
   * @param {number} id - Target task identifier
   * @param {Object} taskData - Fields to replace the task with
   * @returns {Object|null} Replaced task details, or null if task not found
   */
  update(id, taskData) {
    this.tasks = this._readFromFile();
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTask = {
      id: id,
      title: taskData.title,
      description: taskData.description !== undefined ? taskData.description : '',
      completed: taskData.completed !== undefined ? taskData.completed : false,
      priority: taskData.priority || 'medium',
      status: taskData.status || (taskData.completed ? 'completed' : 'pending'),
      createdAt: this.tasks[index].createdAt // Keep original creation date
    };
    
    this.tasks[index] = updatedTask;
    this._writeToFile();
    
    return updatedTask;
  }

  /**
   * Partially updates specific fields on a task resource (PATCH) and writes to disk.
   *
   * @param {number} id - Target task identifier
   * @param {Object} taskData - Key/value pairs containing updates
   * @returns {Object|null} Updated task details, or null if task not found
   */
  patch(id, taskData) {
    this.tasks = this._readFromFile();
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existingTask = this.tasks[index];
    const updatedTask = {
      ...existingTask,
      ...taskData,
      id: id, // Prevent client overrides
      createdAt: existingTask.createdAt // Keep original creation date
    };
    
    // Automatically keep status and completed in sync if one is changed
    if (taskData.completed !== undefined && taskData.status === undefined) {
      updatedTask.status = taskData.completed ? 'completed' : 'pending';
    } else if (taskData.status !== undefined && taskData.completed === undefined) {
      updatedTask.completed = taskData.status === 'completed';
    }

    this.tasks[index] = updatedTask;
    this._writeToFile();
    
    return updatedTask;
  }

  /**
   * Deletes a task resource and updates the persistent file.
   *
   * @param {number} id - Target task identifier
   * @returns {boolean} True if deleted, false if not found
   */
  delete(id) {
    this.tasks = this._readFromFile();
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    this._writeToFile();
    
    return true;
  }
}

module.exports = new TaskModel();
