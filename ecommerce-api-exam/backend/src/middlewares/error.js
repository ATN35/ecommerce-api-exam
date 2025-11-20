function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}
module.exports = { notFound, errorHandler };
