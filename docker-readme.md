# การใช้งาน Docker สำหรับโปรเจค SmartPot

## สำหรับการพัฒนา (Development)

1. สร้างไฟล์ .env สำหรับ backend และ frontend:

\`\`\`bash
./docker-compose-init.sh
\`\`\`

2. รัน Docker Compose:

\`\`\`bash
docker-compose up -d
\`\`\`

3. เข้าถึงแอปพลิเคชัน:
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

4. หยุดการทำงาน:

\`\`\`bash
docker-compose down
\`\`\`

## สำหรับการใช้งานจริง (Production)

1. สร้างไฟล์ .env จาก .env.example:

\`\`\`bash
cp .env.example .env
\`\`\`

2. แก้ไขค่าใน .env ตามที่ต้องการ

3. รัน Docker Compose สำหรับ Production:

\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

4. เข้าถึงแอปพลิเคชัน:
   - Backend API: http://your-domain.com/api
   - Frontend: http://your-domain.com

5. หยุดการทำงาน:

\`\`\`bash
docker-compose -f docker-compose.prod.yml down
\`\`\`

## การสำรองข้อมูล (Backup)

สำรองข้อมูลจาก PostgreSQL:

\`\`\`bash
docker exec smartpot-postgres pg_dump -U smartpot -d smartpot > backup_$(date +%Y%m%d).sql
\`\`\`

## การกู้คืนข้อมูล (Restore)

กู้คืนข้อมูลเข้า PostgreSQL:

\`\`\`bash
cat backup_file.sql | docker exec -i smartpot-postgres psql -U smartpot -d smartpot
\`\`\`

## การดูบันทึก (Logs)

ดูบันทึกของ container:

\`\`\`bash
# ดูบันทึกของ backend
docker logs smartpot-backend

# ดูบันทึกของ frontend
docker logs smartpot-frontend

# ดูบันทึกของ database
docker logs smartpot-postgres
