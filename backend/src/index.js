import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import launchRouter from './routes/launch.js';
import drReadyRouter from './routes/drReady.js';
import { register, metricsMiddleware } from './config/metrics.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(metricsMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hello from backend!' });
});

app.use('/api/launch', launchRouter);

app.use('/api/dr-ready', drReadyRouter);

// Prometheus 수집용
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}
