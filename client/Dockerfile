FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

# 添加缺失的 Babel 插件
RUN npm install @babel/plugin-proposal-private-property-in-object

COPY . .

RUN npm run build

CMD ["npm", "start"]