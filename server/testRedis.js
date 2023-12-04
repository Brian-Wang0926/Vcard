const redisClient = require('./redis-client');

async function testRedis() {
    try {
        // 設置一個鍵值對
        await redisClient.set('testKey', 'Hello Redis');
        console.log('設置成功');

        // 獲取並輸出該鍵值對
        const value = await redisClient.get('testKey');
        console.log('獲取到的值:', value); // 應該輸出 'Hello Redis'
    } catch (err) {
        console.error('Redis 測試錯誤:', err);
    } finally {
        await redisClient.quit();
    }
}

testRedis();
