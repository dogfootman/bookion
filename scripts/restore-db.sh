#!/bin/bash

# 복원할 백업 파일 확인
if [ -z "$1" ]; then
  echo "Usage: ./restore-db.sh <backup_file>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# 백업 파일로부터 데이터베이스 복원
echo "Restoring database from backup: $BACKUP_FILE"
docker exec -i travel_service_db mysql -u travel_user -ptravel_password travel_service < $BACKUP_FILE

# 복원 완료 메시지
echo "Database restoration completed!"