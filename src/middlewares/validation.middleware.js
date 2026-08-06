const { VALID_PRIORITIES, VALID_STATUSES } = require('../utils/constants');
const { error } = require('../utils/response.util');

/**
 * Higher-order middleware function to validate task request payloads.
 * Returns an Express middleware function configured for either full or partial updates.
 *
 * @param {boolean} isPartial - If true, validates payload as a PATCH request (partial update).
 *                              If false, validates payload as a POST/PUT request (full creation/replacement).
 * @returns {Function} Express middleware function: (req, res, next)
 */
const validateTask = (isPartial = false) => {
  return (req, res, next) => {
    // 1. Check if the body exists and is not empty.
    if (!req.body || Object.keys(req.body).length === 0) {
      return error(res, 'Request body cannot be empty', 400);
    }

    const { title, description, priority, status, completed } = req.body;
    const errors = [];

    // 2. Title validation:
    // - Required for POST/PUT (isPartial = false). Optional for PATCH (isPartial = true).
    if (!isPartial || title !== undefined) {
      if (!title || typeof title !== 'string') {
        errors.push('Title is required and must be a string');
      } else if (title.trim().length < 3) {
        errors.push('Title must be at least 3 characters long');
      }
    }

    // 3. Description validation:
    // - Required for POST/PUT (isPartial = false). Optional for PATCH (isPartial = true).
    if (!isPartial || description !== undefined) {
      if (description === undefined || typeof description !== 'string') {
        errors.push('Description is required and must be a string');
      }
    }

    // 4. Completed validation:
    // - Required for POST/PUT (isPartial = false). Optional for PATCH (isPartial = true).
    if (!isPartial || completed !== undefined) {
      if (completed === undefined || typeof completed !== 'boolean') {
        errors.push('Completed status is required and must be a boolean value');
      }
    }

    // 5. Priority validation (Optional field):
    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
      }
    }

    // 6. Status validation (Optional field):
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
      }
    }

    // If any validation errors accumulated, reject request immediately with a 400 Bad Request
    if (errors.length > 0) {
      return error(res, 'Validation failed', 400, errors);
    }

    next();
  };
};

module.exports = {
  validateCreate: validateTask(false),
  validateUpdate: validateTask(false),
  validatePatch: validateTask(true)
};
