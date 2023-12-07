const amqp = require("amqplib");

async function sendMessage(queue, message) {
  let connection;
  let channel;
  
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });

    console.log("Sending message to queue:", queue, message);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
    // 实施重试逻辑或发出警告
  } finally {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  }
}
module.exports = { sendMessage };
