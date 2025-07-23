const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Expense model
const Expense = require('./models/Expense');

// --- ROUTES ---
// Get all expenses
app.get('/expenses', async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
});

// Add new expense
app.post('/expenses', async (req, res) => {
    const exp = new Expense(req.body);
    await exp.save();
    res.status(201).json(exp);
});

// Update expense
app.put('/expenses/:id', async (req, res) => {
    const exp = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exp);
});

// Delete expense
app.delete('/expenses/:id', async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Connect to MongoDB & Start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.log(err));
