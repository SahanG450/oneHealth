import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@onehealth/types";

interface AdminAuthState {
  user: UserProfile | null;
  loginDemo: () => void;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      loginDemo: () => {
        localStorage.setItem("oh_admin_token", "demo-admin");
        set({
          user: {
            id: "admin-1",
            email: "admin@onehealth.lk",
            fullName: "System Admin",
            role: "ADMIN",
            createdAt: new Date().toISOString(),
          },
        });
      },
      logout: () => {
        localStorage.removeItem("oh_admin_token");
        set({ user: null });
      },
    }),
    { name: "oh-admin-auth" }
  )
);
