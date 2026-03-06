// /home/merve/mfe/apps/finance/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "tech_app",
      filename: "remoteEntry.js",
      exposes: {
        "./TechTrends": "./src/App.tsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },

        "@mfe/store": {
          singleton: true,
          import: false, // Bu satır kritik: Kütüphaneyi değil, o anki instance'ı paylaşır
          requiredVersion: false,
        },
      } as any, // TypeScript hatasını burada eziyoruz
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5002,
    strictPort: true,
    cors: true, // Shell'in dosyayı çekebilmesi için bu ŞART
  },
  preview: {
    port: 5002,
    strictPort: true,
    cors: true,
  },
});
