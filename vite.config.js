import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  build: {
    target: "esnext", // รองรับ top-level await
  },
  server: {
    host: true,   // เปิดให้เข้าถึงจากภายนอก (เช่นผ่าน IP)
    port: 3000    // กำหนดให้ใช้พอร์ต 5173
  },
  preview: {
    host: true,   // เปิดให้เข้าถึงจากภายนอกในโหมด preview
    port: 3000   // กำหนดพอร์ตให้ตรงกับ `docker-compose.yml`
  }
});
