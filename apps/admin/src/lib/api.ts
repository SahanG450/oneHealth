import { createApiClient } from "@onehealth/api-client";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080/api/v1";

export const api = createApiClient({
  baseUrl,
  getAccessToken: async () => localStorage.getItem("oh_admin_token") || localStorage.getItem("oh_demo_token"),
});
