/**
 * Single Responsibility: only formats and writes log lines to stdout.
 * Implements a simple log(entry) interface so it can be swapped for
 * any other logger (file, cloud, etc.) without changing consumers.
 */
class ConsoleLogger {
  log(entry) {
    const line = this._format(entry);
    console.log(line);
  }

  _format({ timestamp, method, url, statusCode, durationMs, ip }) {
    return `[${timestamp}] ${method} ${url} → ${statusCode} (${durationMs}ms) from ${ip}`;
  }
}

module.exports = ConsoleLogger;
