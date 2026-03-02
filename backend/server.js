require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(helmet()); // Security headers
// Hardcoded cors origin as per TRD constraints, could also be process.env.CLIENT_ORIGIN
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/items', require('./routes/itemRoutes'));
app.get('/api/v1/health', (req, res) => res.json({ success: true, message: 'API is running' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
