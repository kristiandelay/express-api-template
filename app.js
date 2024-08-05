require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const logRequestBody = require('./middleware/logRequestBody');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./docs/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;
const apiSubUrl = process.env.API_SUB_URL || '';

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Use Morgan for logging
app.use(morgan('combined'));

// Use custom middleware to log request body
app.use(logRequestBody);
app.use(apiKeyMiddleware);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

// Set up routes
app.use(`${apiSubUrl}/auth`, authRoutes);
app.use(apiSubUrl, userRoutes);

// Set up Swagger
setupSwagger(app);

// Use custom error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
