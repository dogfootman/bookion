FROM mysql:8.0

# 초기화 스크립트는 docker-compose.yml에서 볼륨으로 마운트됩니다.
# - ./dockerfiles/mysql/init.sql:/docker-entrypoint-initdb.d/01-init.sql
# - ./dockerfiles/mysql/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql

# 기본 환경 변수 설정 (docker-compose.yml에서 재정의 가능)
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=travel_service
ENV MYSQL_USER=travel_user
ENV MYSQL_PASSWORD=travel_password

# 문자셋 및 시간대 설정
ENV LANG=C.UTF-8
ENV TZ=Asia/Seoul

# MySQL 설정 사용자 정의
COPY ./dockerfiles/mysql/my.cnf /etc/mysql/conf.d/my.cnf

# 컨테이너 생성 시 실행될 명령어
CMD ["mysqld"]
