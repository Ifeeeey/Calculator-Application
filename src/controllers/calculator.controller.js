const { parseExpression } = require('../utils/parser');
const HistoryStore        = require('../utils/historyStore');

/**
 * Controller: Calculator
 * Handles the business logic for evaluating expressions.
 */

/**
 * POST /api/calculate
 * Body: { expression: string }
 */
const calculate = (req, res, next) => {
  try {
    const { expression } = req.body;

    if (!expression || typeof expression !== 'string') {
      const err = new Error('Field "expression" is required and must be a string');
      err.statusCode = 400;
      return next(err);
    }

    const result = parseExpression(expression.trim());

    if (!isFinite(result)) {
      const err = new Error('Expression produced a non-finite result');
      err.statusCode = 400;
      return next(err);
    }

    const entry = HistoryStore.add({
      id:         Date.now(),
      expression: expression.trim(),
      result,
      timestamp:  new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      data: { result, entry },
    });
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

module.exports = { calculate };
