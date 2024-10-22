const Expense = require('../models/expenseModel');
const ExcelJS = require('exceljs');

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, splitType, participants } = req.body;
    const createdBy = req.userId;

    if (splitType === 'Percentage') {
      const totalPercentage = participants.reduce((sum, p) => sum + p.percentage, 0);
      if (totalPercentage !== 100) {
        return res.status(400).json({ error: "Total percentage must be 100%" });
      }
    }

    const expense = new Expense({
      description,
      amount,
      splitType,
      participants,
      createdBy
    });

    await expense.save();
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpensesByUser = async (req, res) => {
  try {
    const expenses = await Expense.find({ "participants.userId": req.params.userId });
    res.json(expenses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('participants.userId', 'name email');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Balance Sheet');

    sheet.columns = [
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Created By', key: 'createdBy', width: 25 },
      { header: 'Participant', key: 'participant', width: 25 },
      { header: 'Split Amount', key: 'splitAmount', width: 15 }
    ];

    expenses.forEach(expense => {
      expense.participants.forEach(participant => {
        sheet.addRow({
          description: expense.description,
          amount: expense.amount,
          createdBy: expense.createdBy.toString(),
          participant: participant.userId.name,
          splitAmount: participant.splitAmount || (participant.percentage * expense.amount / 100)
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="balance-sheet.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
