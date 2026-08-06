/**
 * Custom request logger middleware.
 * Intercepts incoming HTTP requests, tracks execution time, and prints formatted logs
 * to the console upon request completion.
 *
 * Log format: [YYYY-MM-DD HH:mm] METHOD PATH STATUS_CODE STATUS_TEXT - DURATIONms
 * Example:    [2026-08-05 12:45] GET /api/v1/tasks 200 OK - 8ms
 */
const loggerMiddleware = (req, res, next) => {
  // Capture start time in milliseconds to compute overall request duration
  const start = Date.now();
  
  // Listen to the response's 'finish' event which triggers once headers & body are flushed
  res.on('finish', () => {
    // Calculate total duration taken to process request and generate response
    const duration = Date.now() - start;
    const now = new Date();
    
    // Format timestamp as YYYY-MM-DD HH:mm for structured logs
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // Categorize response status as either 'OK' (under 400 status) or 'Error'
    const statusText = res.statusCode < 400 ? 'OK' : 'Error';
    
    // Print the structured log to stdout
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${statusText} - ${duration}ms`);
  });
  
  // Hand over execution to the next middleware or router in the stack
  next();
};

module.exports = loggerMiddleware;
