const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');

const pool = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/categories', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT category FROM events ORDER BY category';
    const result = await pool.query(query);
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    
    res.json({ 
      status: 'OK', 
      message: 'API is running',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Something went wrong!' });
  } else {
    res.status(500).json({error: 'Something went wrong!',  details: err.message, stack: err.stack });
  }
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
});