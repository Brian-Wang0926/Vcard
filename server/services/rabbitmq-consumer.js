const amqp = require("amqplib");
const dotenv = require("dotenv");
dotenv.config();

async function consumeMessage(queue, callback) {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log("Received message:", content);
        callback(content);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error in RabbitMQ consumeMessage:", error);
  }
}

module.exports = { consumeMessage };
