const HistoryStore = require('../utils/historyStore');

/**
 * Controller: History
 * Handles all CRUD operations on calculation history.
 */

/**
 * GET /api/history
 * Returns all history entries.
 */
const getHistory = (req, res) => {
  const data = HistoryStore.getAll();
  res.status(200).json({
    success: true,
    count:   data.length,
    data,
  });
};

/**
 * DELETE /api/history
 * Clears all history entries.
 */
const clearHistory = (req, res) => {
  HistoryStore.clear();
  res.status(200).json({
    success: true,
    message: 'History cleared successfully',
  });
};

/**
 * DELETE /api/history/:id
 * Deletes a single entry by ID.
 */
const deleteEntry = (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    const err = new Error('Invalid ID format');
    err.statusCode = 400;
    return next(err);
  }

  const deleted = HistoryStore.deleteById(id);

  if (!deleted) {
    const err = new Error(`No history entry found with ID: ${id}`);
    err.statusCode = 404;
    return next(err);
  }

  res.status(200).json({
    success: true,
    message: `Entry ${id} deleted successfully`,
  });
};

module.exports = { getHistory, clearHistory, deleteEntry };
