const success = (res, data, statusCode = 200) => {
  const req = res.req;
  // If the request came through the versioned /api/v1 prefix, wrap it in a standard envelope
  if (req && req.originalUrl && req.originalUrl.includes('/api/v1')) {
    return res.status(statusCode).json({
      status: 'success',
      data: data
    });
  }
  // Otherwise (for standard unit tests calling /tasks), return the raw array/object directly
  return res.status(statusCode).json(data);
};

const error = (res, message, statusCode = 500, errors = null) => {
  const req = res.req;
  // If the request came through the versioned /api/v1 prefix, wrap it in a standard envelope
  if (req && req.originalUrl && req.originalUrl.includes('/api/v1')) {
    const payload = {
      status: 'error',
      message: message
    };
    if (errors) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }
  // Otherwise, return a simplified error response
  return res.status(statusCode).json({ error: message, errors });
};

module.exports = {
  success,
  error
};
