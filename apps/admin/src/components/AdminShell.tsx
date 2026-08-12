import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button, Logo } from "@onehealth/ui-kit";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/verifications", label: "Doctor verification" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/dispensaries", label: "Dispensaries" },
  { to: "/admin/subscriptions", label: "Subscriptions" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/moderation", label: "Moderation" },
  { to: "/admin/analytics", label: "Analytics" },
];

export function AdminShell() {
  const user = useAdminAuth((s) => s.user);
  const logout = useAdminAuth((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-surface-border bg-navy text-white md:min-h-screen md:border-b-0 md:border-r md:border-navy">
        <div className="px-4 py-5">
          <Logo height={48} className="brightness-0 invert" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-200">Admin portal</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <p className="text-sm font-semibold text-ink">{user?.fullName}</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Sign out
          </Button>
        </header>
        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
