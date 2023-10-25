FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.2.1
RUN npm install --only=production

COPY . .

EXPOSE 3005

CMD ["node", "app.js"]