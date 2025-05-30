#!/bin/bash

# 백업 디렉토리 생성
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# 백업 파일명 생성 (날짜 포함)
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/travel_service_backup_$DATE.sql"

# MySQL 컨테이너에서 덤프 생성
echo "Creating database backup..."
docker exec travel_service_db mysqldump -u travel_user -ptravel_password travel_service > $BACKUP_FILE

# 백업 완료 메시지
echo "Backup completed: $BACKUP_FILE"
echo "File size: $(du -h $BACKUP_FILE | cut -f1)"
