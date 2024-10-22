const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');


dotenv.config();
const app = express();
app.use(express.json());
connectDB();


// routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);


// home
app.get('/', (req, res) => {
  res.send('Welcome to the Expense App');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
