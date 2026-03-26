function errorHandler(err, _req, res, _next) {
  console.error('Error:', err.message);

  // Handle axios errors from upstream APIs (e.g. OpenRouter)
  if (err.response) {
    const status = err.response.status || 502;
    const message = err.response.data?.error?.message || 'Upstream API error';
    return res.status(status).json({ error: message });
  }

  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
