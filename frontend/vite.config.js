// filepath: /c:/Programming/habit-tracker/frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const backendPort = process.env.BACKEND_PORT;
const frontendPort = process.env.FRONTEND_PORT;

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  server: {
    host: true,
    port: parseInt(frontendPort, 10),
    proxy: {
      "/api": {
        target: `http://backend:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});