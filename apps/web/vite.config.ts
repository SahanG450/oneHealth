import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@onehealth/ui-kit": path.resolve(__dirname, "../../packages/ui-kit/src"),
      "@onehealth/api-client": path.resolve(__dirname, "../../packages/api-client/src"),
      "@onehealth/types": path.resolve(__dirname, "../../packages/types/src"),
      "@onehealth/i18n": path.resolve(__dirname, "../../packages/i18n/src"),
    },
  },
});
