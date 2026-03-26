/**
 * Single Responsibility: extracts request metadata and delegates to an
 * injected logger. Knows nothing about *how* logs are written.
 *
 * Dependency Inversion: depends on a logger abstraction (any object with
 * a log(entry) method), not on console.log directly.
 *
 * @param {object} logger - Any object implementing log(entry).
 * @returns {Function} Express middleware.
 */
function createRequestLogger(logger) {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      logger.log({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
        ip: req.ip,
      });
    });

    next();
  };
}

module.exports = createRequestLogger;
