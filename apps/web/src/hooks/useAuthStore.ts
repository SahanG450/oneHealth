import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, UserProfile } from "@onehealth/types";
import { api } from "@/lib/api";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

interface AuthState {
  user: UserProfile | null;
  bootstrapping: boolean;
  setUser: (user: UserProfile | null) => void;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: "PATIENT" | "DOCTOR";
  }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  /** Demo-only helper when Supabase is not configured */
  demoLogin: (role: Role) => void;
}

const demoUsers: Record<Role, UserProfile> = {
  PATIENT: {
    id: "demo-patient",
    email: "patient@onehealth.lk",
    fullName: "Nimal Perera",
    role: "PATIENT",
    phone: "+94771234567",
    createdAt: new Date().toISOString(),
  },
  DOCTOR: {
    id: "demo-doctor",
    email: "doctor@onehealth.lk",
    fullName: "Dr. Anusha Fernando",
    role: "DOCTOR",
    subscriptionTier: "STANDARD",
    verificationStatus: "APPROVED",
    createdAt: new Date().toISOString(),
  },
  STAFF: {
    id: "demo-staff",
    email: "staff@onehealth.lk",
    fullName: "Kasun Silva",
    role: "STAFF",
    createdAt: new Date().toISOString(),
  },
  ADMIN: {
    id: "demo-admin",
    email: "admin@onehealth.lk",
    fullName: "System Admin",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      bootstrapping: true,
      setUser: (user) => set({ user }),
      bootstrap: async () => {
        try {
          if (!supabaseConfigured) {
            set({ bootstrapping: false });
            return;
          }
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            set({ user: null, bootstrapping: false });
            return;
          }
          const me = await api.getMe();
          set({ user: me, bootstrapping: false });
        } catch {
          set({ user: null, bootstrapping: false });
        }
      },
      login: async (email, password) => {
        if (!supabaseConfigured) {
          const role = (email.split("@")[0]?.toUpperCase() as Role) || "PATIENT";
          const user = demoUsers[role] ?? { ...demoUsers.PATIENT, email };
          localStorage.setItem("oh_demo_token", "demo");
          set({ user });
          return user;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const me = await api.getMe();
        set({ user: me });
        return me;
      },
      register: async (payload) => {
        if (!supabaseConfigured) {
          const user: UserProfile = {
            id: `demo-${payload.role.toLowerCase()}`,
            email: payload.email,
            fullName: payload.fullName,
            phone: payload.phone,
            role: payload.role,
            createdAt: new Date().toISOString(),
            verificationStatus: payload.role === "DOCTOR" ? "PENDING" : undefined,
          };
          localStorage.setItem("oh_demo_token", "demo");
          set({ user });
          return user;
        }
        const { error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: { data: { full_name: payload.fullName, role: payload.role } },
        });
        if (error) throw error;
        await api.register(payload);
        const me = await api.getMe();
        set({ user: me });
        return me;
      },
      logout: async () => {
        localStorage.removeItem("oh_demo_token");
        if (supabaseConfigured) await supabase.auth.signOut();
        set({ user: null });
      },
      demoLogin: (role) => {
        localStorage.setItem("oh_demo_token", "demo");
        set({ user: demoUsers[role] });
      },
    }),
    { name: "oh-web-auth", partialize: (s) => ({ user: s.user }) }
  )
);

export function homePathForRole(role: Role) {
  switch (role) {
    case "DOCTOR":
      return "/doctor";
    case "STAFF":
      return "/staff";
    case "ADMIN":
      return "/login";
    default:
      return "/app";
  }
}
