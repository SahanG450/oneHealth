import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo, Button } from "@onehealth/ui-kit";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { Role } from "@onehealth/types";
import { useState } from "react";

const patientLinks = [
  { to: "/app", label: "Home", end: true },
  { to: "/app/search", label: "Find doctors" },
  { to: "/app/bookings", label: "Bookings" },
  { to: "/app/queue", label: "Live queue" },
  { to: "/app/recommend", label: "Symptoms" },
  { to: "/app/emr", label: "Records" },
  { to: "/app/profile", label: "Profile" },
];

const doctorLinks = [
  { to: "/doctor", label: "Dashboard", end: true },
  { to: "/doctor/queue", label: "Queue" },
  { to: "/doctor/dispensaries", label: "Dispensaries" },
  { to: "/doctor/staff", label: "Staff" },
  { to: "/doctor/prescriptions", label: "e-Rx" },
  { to: "/doctor/analytics", label: "Analytics" },
  { to: "/doctor/subscription", label: "Plan" },
];

const staffLinks = [
  { to: "/staff", label: "Queue console", end: true },
  { to: "/staff/payments", label: "Payments" },
  { to: "/staff/prescriptions", label: "Dispense" },
];

function linksFor(role: Role) {
  if (role === "DOCTOR") return doctorLinks;
  if (role === "STAFF") return staffLinks;
  return patientLinks;
}

export function AppShell() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = linksFor(user?.role ?? "PATIENT");

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-surface-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Logo height={52} />
          <button
            className="rounded-lg border border-surface-border px-3 py-2 text-sm font-semibold text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            Menu
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{user?.fullName}</p>
              <p className="text-xs text-ink-muted">{user?.role}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-surface-border px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold ${
                      isActive ? "bg-brand-50 text-brand-700" : "text-ink-muted"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Button
                variant="secondary"
                className="mt-2"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
