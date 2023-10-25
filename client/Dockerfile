# 第一阶段：安装依赖项并构建生产静态文件
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.2.1
RUN npm install

COPY . .

RUN npm run build

# 第二阶段：使用Nginx来提供静态内容
FROM nginx:stable

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# 默认情况下，Nginx将在80端口上运行，无需EXPOSE命令
# 您可以根据需要自定义Nginx配置