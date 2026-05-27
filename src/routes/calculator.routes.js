const express    = require('express');
const { calculate } = require('../controllers/calculator.controller');

const router = express.Router();

router.post('/', calculate);

module.exports = router;
