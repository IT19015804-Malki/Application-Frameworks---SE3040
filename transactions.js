const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticateToken } = require('../middleware/authMiddleware'); 

// ✅ GET all transactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error('🚨 Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ ADD transaction
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { amount, type, category } = req.body;

    // Check if user is properly set
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Validate fields
    if (!amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      type,
      category
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });

  } catch (error) {
    console.error('🚨 Error adding transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ GET balance (income - expense) along with total income and total expense
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Income
    const incomeAgg = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomeAgg[0]?.total || 0;

    // Total Expense
    const expenseAgg = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = expenseAgg[0]?.total || 0;

    // Final balance (income - expense)
    const balance = totalIncome - totalExpense;

    // Send response with balance, total income, and total expense
    res.json({ balance, totalIncome, totalExpense });
  } catch (err) {
    console.error('🚨 Error calculating balance:', err);
    res.status(500).json({ error: 'Failed to calculate balance', message: err.message });
  }
});

module.exports = router;
