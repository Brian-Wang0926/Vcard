const amqp = require("amqplib");
const dotenv = require("dotenv");
dotenv.config();

async function consumeMessage(queue, callback) {
  try {
    console.log("consumeMessage", process.env.RABBITMQ_URL);
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    console.log("consumeMessage connection", connection);
    const channel = await connection.createChannel();
    console.log("consumeMessage channel", channel);
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log("Received message:", content);
        callback(content);
        channel.ack(message);
      }
      console.log("consumeMessage ");
    });
  } catch (error) {
    console.error("Error in RabbitMQ consumeMessage:", error);
  }
}

module.exports = { consumeMessage };
