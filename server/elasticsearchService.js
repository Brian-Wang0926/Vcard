// const { Client } = require("@elastic/elasticsearch");
// const dotenv = require("dotenv");
// dotenv.config();

// const client = new Client({ node: process.env.ELASTICSEARCH_URL });

// async function checkConnection() {
//   let isConnected = false;
//   while (!isConnected) {
//     console.log("Connecting to ES");
//     try {
//       const health = await client.cluster.health({});
//       console.log("ES health",health);
//       isConnected = true;
//     } catch (err) {
//       console.log("Connection Failed, Retrying...", err);
//     }
//   }
// }

// async function handleArticleChange(change) {
//   console.log("Handling change:", change); // 添加日志以查看变更详情
//   try {
//     switch (change.operationType) {
//       case "insert":
//         console.log(
//           "Inserting document into Elasticsearch:",
//           change.fullDocument
//         );
//         const document = change.fullDocument;
//         document.docId = document._id; // 将 _id 的值复制到 docId 字段
//         delete document._id; // 移除 _id 字段
//         await client.index({
//           index: "articles",
//           body: document,
//         });
//         break;
//       case "update":
//         console.log(
//           "Updating document in Elasticsearch:",
//           change.documentKey._id
//         );
//         await client.update({
//           index: "articles",
//           id: change.documentKey._id.toString(), // 确保 ID 是字符串
//           body: {
//             doc: change.updateDescription.updatedFields,
//           },
//         });
//         break;
//       case "delete":
//         console.log(
//           "Deleting document from Elasticsearch:",
//           change.documentKey._id
//         );
//         await client.delete({
//           index: "articles",
//           id: change.documentKey._id.toString(), // 确保 ID 是字符串
//         });
//         break;
//       default:
//         console.log("Unhandled change type:", change.operationType);
//     }
//   } catch (error) {
//     console.error("Error handling change:", error);
//   }
// }

// async function setupElasticsearch() {
//   await checkConnection();
//   // 檢查索引是否存在，如果不存在則創建
//   const indexExists = await client.indices.exists({ index: "articles" });
//   if (!indexExists.body) {
//     await client.indices.create({ index: "articles" });
//     console.log("索引 'articles' 已創建");
//   }
// }

// module.exports = {
//   client,
//   setupElasticsearch,
//   handleArticleChange,
// };
