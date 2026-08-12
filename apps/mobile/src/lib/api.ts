import { createApiClient } from "@onehealth/api-client";

const baseUrl =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_BASE_URL) ||
  "http://localhost:8080/api/v1";

export const api = createApiClient({
  baseUrl,
  getAccessToken: async () => null,
});
