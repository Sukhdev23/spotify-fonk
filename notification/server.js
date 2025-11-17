import app from './src/app.js';
import {connectRabbitMQ} from './src/broker/rabbit.js';
import startListening from './src/broker/listener.js';

// Connect to RabbitMQ
connectRabbitMQ().then(startListening)


app.listen(3001, () => {
    console.log('Notification service is running on port 3001');
});