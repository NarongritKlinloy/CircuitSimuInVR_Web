# ใช้ Node.js เป็น Base Image
FROM node:18-alpine

# กำหนด Working Directory ใน Container
WORKDIR /app

# คัดลอกไฟล์ที่จำเป็นและติดตั้ง Dependencies
COPY package.json package-lock.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้าง Static Files สำหรับ Tailwind และ Vite
RUN npm run build

# เปิดพอร์ต 5173 (Vite Default Port)
EXPOSE 5173

# รันแอป
CMD ["npm", "run", "preview"]