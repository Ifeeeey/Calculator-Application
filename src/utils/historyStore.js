const config = require('../config/app.config');

/**
 * In-memory history store.
 * In production, replace this with a database (e.g. SQLite, PostgreSQL, MongoDB).
 */
let history = [];

const HistoryStore = {
  /**
   * Returns all history entries (newest first).
   * @returns {Array}
   */
  getAll() {
    return history;
  },

  /**
   * Adds a new entry to the top of the history list.
   * Enforces the max history limit from config.
   * @param {Object} entry
   * @returns {Object} the saved entry
   */
  add(entry) {
    history.unshift(entry);
    if (history.length > config.HISTORY_LIMIT) history.pop();
    return entry;
  },

  /**
   * Removes a single entry by ID.
   * @param {number} id
   * @returns {boolean} true if found and removed, false otherwise
   */
  deleteById(id) {
    const before = history.length;
    history = history.filter(e => e.id !== id);
    return history.length < before;
  },

  /**
   * Clears all history.
   */
  clear() {
    history = [];
  },
};

module.exports = HistoryStore;
