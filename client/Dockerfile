FROM node:18-alpine AS build

WORKDIR /usr/src/app

# 声明需要的环境变量
ARG REACT_APP_API_URL
ARG REACT_APP_MOCK_ENV
ARG REACT_APP_CLOUDFRONT_URL

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

# 设置环境变量
ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV REACT_APP_MOCK_ENV $REACT_APP_MOCK_ENV
ENV REACT_APP_CLOUDFRONT_URL $REACT_APP_CLOUDFRONT_URL

COPY . .

RUN npm run build
# Production stage
# 使用Nginx镜像
FROM nginx:alpine

# 复制构建的静态文件到Nginx容器的服务目录
COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

# 使用默认的Nginx配置文件，或者将自定义的配置文件也复制进去
# COPY your-custom-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]