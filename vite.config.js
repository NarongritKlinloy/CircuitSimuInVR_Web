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
    host: true,   // เปิดให้เข้าถึงจาก IP ภายนอก (0.0.0.0)
    port: 3000    // พอร์ต dev server (ถ้าอยากใช้ 5173 ก็ปรับตามต้องการ)
  },

  preview: {
    host: true,   
    port: 3000,   // พอร์ตโหมด preview
    allowedHosts: ["smith11.ce.kmitl.ac.th"] // อนุญาตให้เข้าถึงจากโดเมนนี้
    // หรือหากต้องการเปิดกว้างทุกโฮสต์ ให้ใส่ 'all'
    // allowedHosts: 'all'
  },
});
