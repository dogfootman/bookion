# 베이스 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 환경 변수 설정
ENV NODE_ENV=development
ENV TZ=Asia/Seoul

# 필요한 도구 설치
RUN apk add --no-cache tzdata

# 앱 의존성 설치
# package.json과 package-lock.json을 먼저 복사하여 캐싱 활용
COPY package*.json ./
RUN npm install

# 소스 코드 복사
# 볼륨 마운트로 인해 개발 중에는 이 단계가 무시됨
COPY . .

# 포트 설정
EXPOSE 3000

# 실행 명령
CMD ["npm", "run", "dev"]
