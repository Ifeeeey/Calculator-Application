const express = require('express');
const { getHistory, clearHistory, deleteEntry } = require('../controllers/history.controller');

const router = express.Router();

router.get('/',     getHistory);
router.delete('/',  clearHistory);
router.delete('/:id', deleteEntry);

module.exports = router;
