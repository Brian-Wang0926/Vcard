const amqp = require("amqplib");
const dotenv = require("dotenv");
dotenv.config();

async function consumeMessage(queue, callback) {
  let connection;
  let channel;

  while (!connection) {
    try {
      console.log("consumeMessage", process.env.RABBITMQ_URL);
      connection = await amqp.connect(
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
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

module.exports = { consumeMessage };
