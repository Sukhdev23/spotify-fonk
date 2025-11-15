import amqp from 'amqplib'
import config from '../config/config.js'

let channel, connection;


export async function connectRabbitMQ() {

        connection = await amqp.connect(config.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");

}
export async function publishToQueue(queueName, data) {
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log(`Message sent to queue ${queueName}`);
  } catch (error) {
    console.error("Error publishing to queue:", error);
  }
}

export async function consumeFromQueue(queueName, callback) {
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        callback(data);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming from queue:", error);
  }
}