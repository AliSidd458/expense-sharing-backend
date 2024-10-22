const express = require('express');
const { addExpense, getExpensesByUser, downloadBalanceSheet } = require('../controllers/expenseController');
const router = express.Router();

router.post('/', addExpense);
router.get('/user/:userId', getExpensesByUser);
router.get('/balance-sheet', downloadBalanceSheet);

module.exports = router;
