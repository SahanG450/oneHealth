import { createApiClient } from "@onehealth/api-client";
import { supabase, supabaseConfigured } from "./supabaseClient";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080/api/v1";

export const api = createApiClient({
  baseUrl,
  getAccessToken: async () => {
    if (!supabaseConfigured) {
      return localStorage.getItem("oh_demo_token");
    }
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});

export { baseUrl as API_BASE_URL };
