// apps/shell/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell_app",
      remotes: {
        financeApp: "http://localhost:5001/assets/remoteEntry.js",
        trendsApp: "http://localhost:5002/assets/remoteEntry.js",
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
      } as any,
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5000,
    strictPort: true,
    fs: {
      // Proje kök dizinine erişim izni veriyoruz
      allow: [".."],
    },
  },
});
