/**
 * Middleware: Request Logger
 * Logs every incoming request with method, URL, status and response time.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status   = res.statusCode;
    const color    = status >= 400 ? '\x1b[31m' : '\x1b[32m'; // red / green
    const reset    = '\x1b[0m';

    console.log(
      `${color}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} — ${status} (${duration}ms)${reset}`
    );
  });

  next();
};

module.exports = { requestLogger };
