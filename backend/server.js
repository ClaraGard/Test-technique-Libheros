// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models'); // Assuming you have models set up

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Sync Sequelize and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});