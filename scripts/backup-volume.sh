#!/bin/bash

# 백업 디렉토리 생성
BACKUP_DIR="./backups/volumes"
mkdir -p $BACKUP_DIR

# 백업 파일명 생성 (날짜 포함)
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mysql_volume_backup_$DATE.tar.gz"

# 임시 컨테이너를 사용하여 볼륨 데이터 백업
echo "Creating volume backup..."
docker run --rm -v travel-info-service_mysql_data:/source -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/mysql_volume_backup_$DATE.tar.gz -C /source .

# 백업 완료 메시지
echo "Volume backup completed: $BACKUP_FILE"
echo "File size: $(du -h $BACKUP_FILE | cut -f1)"