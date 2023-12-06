const amqp = require("amqplib");

async function sendMessage(queue, message) {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  ); // 连接到RabbitMQ服务器
  const channel = await connection.createChannel(); // 创建通道
  await channel.assertQueue(queue, { durable: false }); // 确保队列存在

  console.log("Sending message to queue:", queue, message);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))); // 发送消息

  setTimeout(() => {
    connection.close();
  }, 500);
}

module.exports = { sendMessage };
