FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# 复制入口点脚本到容器内的路径
COPY docker-entrypoint.sh /usr/local/bin/

# 使用该脚本作为入口点
ENTRYPOINT ["docker-entrypoint.sh"]

RUN npm run build

CMD ["npm", "start"]