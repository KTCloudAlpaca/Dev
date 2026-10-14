# 1단계: React 앱 빌드
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2단계: nginx로 정적 파일 서빙 + /api 프록시
FROM nginx:1.28-alpine

# 컨테이너 시작 시 템플릿의 ${BACKEND_URL}이 실제 값으로 치환됨
ENV BACKEND_URL=http://backend:5000

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
