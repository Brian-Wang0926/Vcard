const amqp = require("amqplib");
let connection;
let channel;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    channel = await connection.createChannel();
    console.log("connectRabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}

async function sendMessage(queue, message) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    await channel.assertQueue(queue, { durable: true });
    console.log("Sending message to queue:", queue, message);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
}

module.exports = { sendMessage, connectRabbitMQ };
