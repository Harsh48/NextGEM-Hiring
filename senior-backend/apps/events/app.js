const express = require('express');
const socketIOClient = require('socket.io-client');
const mongoose = require('mongoose');
const validateQueryParams = require('./config/utils');
const Transaction = require('./models/transaction.model');
const connectDB = require('./config/db');
const collectionName = 'transactions';
require('dotenv').config()

// Connect to MongoDB
connectDB();

 
// Function to handle errors in a consistent format
function handleError(res, status, message) {
  return res.status(status).json({ status: false, message });
}

// Function to connect to the Scraper Server's socket.io endpoint
function connectToServer() {
  const socket = socketIOClient('http://localhost:3005'); // Replace with Scraper Server URL

  socket.on('connect', () => console.log('Connected to Scraper Server'));

  socket.on('new_swap', async (transactionId) => {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (transaction) {
        console.log('New swap transaction:', transaction);
      } else {
        console.log('Transaction not found:', transactionId);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
    }
  });
}

const app = express();

// Connect to socket.io server on startup
connectToServer();

// GET /swaps endpoint
app.get('/swaps', async (req, res) => {
  const errors = validateQueryParams(req.query);
  if (errors.length > 0) {
    return handleError(res, 400, errors.join(', '));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const valueMin = req.query.valueMin ? parseFloat(req.query.valueMin) : null;
  const valueMax = req.query.valueMax ? parseFloat(req.query.valueMax) : null;

  const query = {};
  if (valueMin && valueMax) {
    query.value_usd = { $gte: valueMin, $lte: valueMax };
  }

  try {
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({ status: true, data: transactions, total });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return handleError(res, 500, 'Internal server error');
  }
});


app.listen(3001, () => console.log('Events Server listening on port 3001'));