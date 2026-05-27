# Node.js Calculator API

A professional REST API built with **Node.js** and **Express** that evaluates mathematical expressions, supports advanced operations, and maintains a calculation history. Structured with industry-standard separation of concerns.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Architecture Overview](#architecture-overview)
- [Testing the API](#testing-the-api)
- [Future Improvements](#future-improvements)

---

## Features

- Evaluate mathematical expressions safely (no `eval()`)
- Supports `+`, `-`, `*`, `/`, `%`, `^` (power), `sqrt()`, and parentheses
- Full BODMAS/PEMDAS operator precedence
- Calculation history with add, retrieve, and delete operations
- Global error handling with consistent JSON responses
- Request logger with colour-coded output and response timing
- Centralised configuration

---

## Project Structure

```
calculator-pro/
├── server.js                         # Entry point — boots the HTTP server
├── package.json
├── public/
│   └── index.html                    # Frontend UI (served as static files)
└── src/
    ├── app.js                        # Express app — middleware & route setup
    ├── config/
    │   └── app.config.js             # Centralised app configuration
    ├── routes/
    │   ├── calculator.routes.js      # Route definitions for /api/calculate
    │   └── history.routes.js         # Route definitions for /api/history
    ├── controllers/
    │   ├── calculator.controller.js  # Business logic for calculations
    │   └── history.controller.js     # Business logic for history CRUD
    ├── middleware/
    │   ├── logger.js                 # HTTP request logger
    │   └── errorHandler.js           # Global error handler & 404 catcher
    └── utils/
        ├── parser.js                 # Recursive descent expression parser
        └── historyStore.js           # In-memory data store
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone or unzip the project, then navigate into it
cd calculator-pro

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The server will start at **http://localhost:3000**

### Development Mode

Uses Node.js `--watch` flag to auto-restart on file changes (Node 18+):

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root of the project to override defaults:

```env
PORT=3000
NODE_ENV=development
```

| Variable   | Default       | Description                        |
|------------|---------------|------------------------------------|
| `PORT`     | `3000`        | Port the server listens on         |
| `NODE_ENV` | `development` | Environment (`development`/`production`) |

> **Note:** To load `.env` files automatically, install the `dotenv` package and add `require('dotenv').config()` at the top of `server.js`.

---

## API Reference

### Base URL
```
http://localhost:3000/api
```

### Supported Operators

| Operator | Symbol | Example          |
|----------|--------|------------------|
| Addition       | `+` | `3 + 5`       |
| Subtraction    | `-` | `10 - 4`      |
| Multiplication | `*` | `6 * 7`       |
| Division       | `/` | `20 / 4`      |
| Modulus        | `%` | `10 % 3`      |
| Power          | `^` | `2 ^ 8`       |
| Square Root    | `sqrt()` | `sqrt(144)` |
| Parentheses    | `()` | `(3 + 2) * 4` |

---

### POST `/api/calculate`

Evaluates a mathematical expression and saves it to history.

**Request Body:**
```json
{
  "expression": "sqrt(144) + 2 ^ 3"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "result": 20,
    "entry": {
      "id": 1779909688900,
      "expression": "sqrt(144) + 2 ^ 3",
      "result": 20,
      "timestamp": "2026-05-27T19:21:28.900Z"
    }
  }
}
```

**Error Response — `400 Bad Request`:**
```json
{
  "success": false,
  "error": {
    "message": "Division by zero"
  }
}
```

---

### GET `/api/history`

Returns all saved calculations, newest first.

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1779909688900,
      "expression": "sqrt(144) + 2 ^ 3",
      "result": 20,
      "timestamp": "2026-05-27T19:21:28.900Z"
    },
    {
      "id": 1779909600000,
      "expression": "10 * (3 + 2)",
      "result": 50,
      "timestamp": "2026-05-27T19:20:00.000Z"
    }
  ]
}
```

---

### DELETE `/api/history`

Clears all calculation history.

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "History cleared successfully"
}
```

---

### DELETE `/api/history/:id`

Deletes a single history entry by its ID.

**Example:** `DELETE /api/history/1779909688900`

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Entry 1779909688900 deleted successfully"
}
```

**Error Response — `404 Not Found`:**
```json
{
  "success": false,
  "error": {
    "message": "No history entry found with ID: 1779909688900"
  }
}
```

---

## Error Handling

All errors are handled globally in `src/middleware/errorHandler.js` and return a consistent JSON shape:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description"
  }
}
```

| HTTP Status | Meaning                              |
|-------------|--------------------------------------|
| `200`       | Request succeeded                    |
| `400`       | Bad request (invalid expression, missing field) |
| `404`       | Route or resource not found          |
| `500`       | Unexpected server error              |

In `development` mode, error responses also include a `stack` trace to help with debugging.

---

## Architecture Overview

This project follows the **Routes → Controllers → Utils** pattern, a simplified version of the MVC (Model-View-Controller) architecture used in professional Node.js applications.

```
Incoming Request
      │
      ▼
 Express App (app.js)
      │
      ├── Middleware: requestLogger  →  logs method, URL, status, duration
      ├── Middleware: express.json() →  parses JSON request body
      │
      ▼
   Router (routes/)
      │  Matches the URL path and HTTP method
      ▼
 Controller (controllers/)
      │  Validates input, calls utilities, builds the response
      ▼
   Utility (utils/)
      │  parser.js      →  evaluates the expression
      │  historyStore.js →  reads/writes to in-memory store
      ▼
   Response sent to client
      │
      └── If any error occurs at any layer → errorHandler middleware
```

---

## Testing the API

You can test every endpoint from your terminal using **PowerShell**:

```powershell
# Calculate an expression
Invoke-WebRequest -Uri "http://localhost:3000/api/calculate" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"expression": "10 * (3 + 2)"}'

# Get all history
Invoke-WebRequest -Uri "http://localhost:3000/api/history" -Method GET

# Delete a specific entry (replace ID with a real one from history)
Invoke-WebRequest -Uri "http://localhost:3000/api/history/1779909688900" -Method DELETE

# Clear all history
Invoke-WebRequest -Uri "http://localhost:3000/api/history" -Method DELETE
```

To handle error responses cleanly in PowerShell:

```powershell
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/calculate" `
      -Method POST `
      -ContentType "application/json" `
      -Body '{"expression": "10 / 0"}'
} catch {
    $_.ErrorDetails.Message
}
```

---

## Future Improvements

These are recommended next steps for extending this project:

| Improvement | Tools / Packages |
|---|---|
| Persist history to a database | `better-sqlite3`, `mongoose`, `pg` |
| Input validation & sanitisation | `joi`, `zod` |
| User authentication | `jsonwebtoken`, `bcrypt` |
| Rate limiting (prevent API abuse) | `express-rate-limit` |
| Automated tests | `jest`, `supertest` |
| Environment variable management | `dotenv` |
| API documentation UI | `swagger-ui-express` |
| Process management in production | `pm2` |
