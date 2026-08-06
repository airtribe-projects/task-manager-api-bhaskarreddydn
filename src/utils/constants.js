const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

module.exports = {
  PRIORITIES,
  STATUSES,
  VALID_PRIORITIES: Object.values(PRIORITIES),
  VALID_STATUSES: Object.values(STATUSES)
};
