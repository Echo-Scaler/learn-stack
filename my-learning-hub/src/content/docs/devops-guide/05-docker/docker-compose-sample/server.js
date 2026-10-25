const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection Pool using Environment Variables
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'SecretPassword123',
  database: process.env.DB_NAME || 'ecommerce_prod',
  connectionTimeoutMillis: 3000,
});

// Liveness & Readiness Healthcheck Endpoint
app.get('/healthz', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT 1 AS healthy');
    if (dbRes.rows[0].healthy === 1) {
      return res.status(200).json({ status: 'HEALTHY', database: 'CONNECTED' });
    }
    return res.status(500).json({ status: 'UNHEALTHY', database: 'INVALID_QUERY' });
  } catch (err) {
    return res.status(503).json({ status: 'DEGRADED', database: 'DISCONNECTED', error: err.message });
  }
});

// Main Landing API Endpoint
app.get('/', async (req, res) => {
  res.json({
    message: 'Welcome to Production Multi-Tier Dockerized Web Application!',
    environment: process.env.NODE_ENV || 'development',
    hostname: require('os').hostname(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Application started listening on port ${PORT}`);
});
