import app from './src/app.js';
import connectDB from './src/db/db.js';
import config from './src/config/config.js';
import { connectRabbitMQ } from './src/broker/rabbit.js';

// Connect to RabbitMQ
connectRabbitMQ();

// Connect to the database
connectDB();

const port = Number(config.port) || 3000;
app.listen(port, () => {
  console.log(`Auth server is running on port ${port}`);
});