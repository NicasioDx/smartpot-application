#!/bin/bash

# สร้างไฟล์ .env สำหรับ backend
cat > backend/.env << EOL
PORT=5000
DATABASE_URL=postgres://smartpot:smartpotpassword@postgres:5432/smartpot
JWT_SECRET=your-secret-key-here
NODE_ENV=development
EOL

# สร้างไฟล์ .env สำหรับ frontend
cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:5000
EOL

# ให้สิทธิ์การรันไฟล์
chmod +x docker-compose-init.sh

echo "สร้างไฟล์ .env เรียบร้อยแล้ว"
echo "กำลังเริ่มต้น Docker Compose..."

# รัน Docker Compose
docker-compose up -d

echo "Docker Compose ทำงานเรียบร้อยแล้ว"
echo "Backend API: http://localhost:5000"
echo "Frontend: http://localhost:3000"
