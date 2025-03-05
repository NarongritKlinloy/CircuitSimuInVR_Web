import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },

  build: {
    target: "esnext",
  },

  server: {
    host: true,   // เปิดให้เข้าถึงจากภายนอก (0.0.0.0)
    port: 3000,   // ใช้พอร์ต 3000
  },

  preview: {
    host: true,
    port: 3000,
    allowedHosts: ["backend:5000", "smith11.ce.kmitl.ac.th"] // ✅ เพิ่ม domain ที่ต้องการ
  },
});
