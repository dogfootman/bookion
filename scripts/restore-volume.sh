#!/bin/bash

# 복원할 백업 파일 확인
if [ -z "$1" ]; then
  echo "Usage: ./restore-volume.sh <backup_file>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# 서비스 중지
echo "Stopping services..."
docker-compose down

# 볼륨 데이터 복원
echo "Restoring volume data from backup: $BACKUP_FILE"
docker run --rm -v travel-info-service_mysql_data:/target -v $(pwd)/$BACKUP_FILE:/backup.tar.gz alpine sh -c "rm -rf /target/* && tar xzf /backup.tar.gz -C /target"

# 서비스 재시작
echo "Starting services..."
docker-compose up -d

echo "Volume restoration completed!"