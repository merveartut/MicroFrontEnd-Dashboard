// /home/merve/mfe/apps/auth/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth_app",
      filename: "remoteEntry.js",
      exposes: {
        "./LoginForm": "./src/components/LoginForm.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    target: "esnext",
    assetsDir: "assets", // Varsayılan değerde bırakalım, karmaşayı önler
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5001,
    strictPort: true,
    cors: true, // Shell'in dosyayı çekebilmesi için bu ŞART
  },
});
