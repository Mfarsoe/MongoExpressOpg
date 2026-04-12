const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const studentRoutes = require('./src/routes/students');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/mongoexpressopg';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/students', studentRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Valideringsfejl', errors: err.errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Ugyldigt id-format' });
  }

  res.status(500).json({ message: 'Serverfejl' });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Forbundet til MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server kører på http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Kunne ikke forbinde til MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
