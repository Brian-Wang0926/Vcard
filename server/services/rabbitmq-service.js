const amqp = require("amqplib");
let connection;
let channel;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    channel = await connection.createChannel();
    console.log("connectRabbitMQ", connection, channel);
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    // 实施重试逻辑或发出警告
  }
}

async function sendMessage(queue, message) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    await channel.assertQueue(queue, { durable: false });
    console.log("Sending message to queue:", queue, message);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
    // 实施重试逻辑或发出警告
  }
}

module.exports = { sendMessage, connectRabbitMQ };
