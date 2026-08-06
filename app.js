const express = require('express');
const loggerMiddleware = require('./src/middlewares/logger.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');
const taskRoutes = require('./src/routes/task.routes');
const { PORT, NODE_ENV } = require('./src/config/env');

const app = express();

// 1. JSON Parser & URL encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Request logger middleware
app.use(loggerMiddleware);

// 3. Mount Task Routes
// Mount under both paths:
// - '/tasks' to ensure pre-configured test suite matches
// - '/api/v1/tasks' to support versioned REST API requirements
app.use('/tasks', taskRoutes);
app.use('/api/v1/tasks', taskRoutes);

// 4. Catch-all 404 Route
app.use((req, res, next) => {
  const err = new Error(`Cannot ${req.method} ${req.url}`);
  err.statusCode = 404;
  next(err);
});

// 5. Global Error Handler middleware
app.use(errorMiddleware);

// 6. Listen on configured port
app.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log(`Server started in [${NODE_ENV}] mode on port ${PORT}`);
});

module.exports = app;
