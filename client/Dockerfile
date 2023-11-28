FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build
# /usr/src/app/build


# Production stage
# 使用Nginx镜像
FROM nginx:alpine

# 复制构建的静态文件到Nginx容器的服务目录
COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

# 使用默认的Nginx配置文件，或者将自定义的配置文件也复制进去
# COPY your-custom-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]