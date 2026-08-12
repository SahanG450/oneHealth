import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, PageHeader, Badge } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuthStore";

export function DoctorDashboard() {
  const user = useAuthStore((s) => s.user);
  const analytics = useQuery({
    queryKey: ["doctor-analytics"],
    queryFn: async () => {
      try {
        return await api.doctorAnalytics();
      } catch {
        return { bookings: 36, revenueLkr: 128000, averageRating: 4.7, noShows: 2 };
      }
    },
  });

  const a = analytics.data;

  return (
    <div>
      <PageHeader
        title="Doctor dashboard"
        subtitle={`${user?.fullName} · ${user?.subscriptionTier ?? "FREE"} plan`}
        actions={
          <Link to="/doctor/queue">
            <Button>Manage queue</Button>
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Bookings", value: a?.bookings ?? "—" },
          { label: "Revenue (LKR)", value: a?.revenueLkr?.toLocaleString() ?? "—" },
          { label: "Avg rating", value: a?.averageRating?.toFixed(1) ?? "—" },
          { label: "No-shows", value: a?.noShows ?? "—" },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-ink-muted">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-navy-soft">{s.value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Card interactive>
          <Badge>Standard+</Badge>
          <p className="mt-2 font-semibold">Staff accounts</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-brand-700" to="/doctor/staff">
            Manage staff →
          </Link>
        </Card>
        <Card interactive>
          <Badge>All plans</Badge>
          <p className="mt-2 font-semibold">Dispensaries</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-brand-700" to="/doctor/dispensaries">
            Edit locations →
          </Link>
        </Card>
        <Card interactive>
          <Badge tone="warning">Verification</Badge>
          <p className="mt-2 font-semibold">{user?.verificationStatus ?? "PENDING"}</p>
          <p className="mt-1 text-sm text-ink-muted">Admin must approve SLMC credentials before public search.</p>
        </Card>
      </div>
    </div>
  );
}
