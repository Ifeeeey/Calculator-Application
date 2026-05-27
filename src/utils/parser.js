/**
 * Utility: Expression Parser
 * A safe recursive descent parser — no eval() used.
 * Supports: +, -, *, /, %, ^, sqrt(), parentheses, unary minus.
 */

/**
 * Sanitises and evaluates a raw expression string.
 * @param {string} expression
 * @returns {number}
 */
const parseExpression = (expression) => {
  const sanitised = expression
    .replace(/\s+/g, '')       // remove all whitespace
    .replace(/\^/g, '**');     // convert ^ to ** for power

  return evaluate(sanitised);
};

/**
 * Core recursive descent evaluator.
 * @param {string} expr
 * @returns {number}
 */
const evaluate = (expr) => {
  let pos = 0;

  const peek    = () => expr[pos];
  const consume = () => expr[pos++];

  const parseExpr    = () => parseAddSub();

  const parseAddSub  = () => {
    let left = parseMulDiv();
    while (pos < expr.length && (peek() === '+' || (peek() === '-' && pos > 0))) {
      const op    = consume();
      const right = parseMulDiv();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  };

  const parseMulDiv  = () => {
    let left = parsePow();
    while (pos < expr.length && ['*', '/', '%'].includes(peek())) {
      const op = consume();
      if (op === '*' && peek() === '*') { pos--; break; } // handle **
      const right = parsePow();
      if      (op === '*') left *= right;
      else if (op === '/') {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      }
      else                 left %= right;
    }
    return left;
  };

  const parsePow     = () => {
    let base = parseUnary();
    if (pos < expr.length && peek() === '*' && expr[pos + 1] === '*') {
      pos += 2;
      base = Math.pow(base, parseUnary());
    }
    return base;
  };

  const parseUnary   = () => {
    if (peek() === '-') { consume(); return -parsePrimary(); }
    if (peek() === '+') { consume(); return  parsePrimary(); }
    return parsePrimary();
  };

  const parsePrimary = () => {
    // Parenthesised expression
    if (peek() === '(') {
      consume();
      const val = parseExpr();
      if (peek() !== ')') throw new Error('Missing closing parenthesis');
      consume();
      return val;
    }

    // sqrt()
    if (expr.slice(pos, pos + 4) === 'sqrt') {
      pos += 4;
      if (peek() !== '(') throw new Error('Expected "(" after sqrt');
      consume();
      const val = parseExpr();
      if (peek() !== ')') throw new Error('Missing closing parenthesis in sqrt');
      consume();
      if (val < 0) throw new Error('Square root of a negative number is not real');
      return Math.sqrt(val);
    }

    // Number literal
    let numStr = '';
    while (pos < expr.length && /[\d.]/.test(peek())) numStr += consume();
    if (!numStr) throw new Error(`Unexpected token "${peek() || 'end of expression'}"`);
    return parseFloat(numStr);
  };

  return parseExpr();
};

module.exports = { parseExpression };
