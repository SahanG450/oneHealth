import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Card, EmptyState, Loading, PageHeader, Input } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import { useState } from "react";
import type { DoctorVerificationItem } from "@onehealth/types";

const demo: DoctorVerificationItem[] = [
  {
    doctorId: "doc-pending-1",
    fullName: "Dr. Ishara Bandara",
    email: "ishara@clinic.lk",
    slmcNumber: "SLMC-45210",
    status: "PENDING",
    submittedAt: "2026-08-10T09:00:00Z",
  },
];

export function AdminOverview() {
  const analytics = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      try {
        return await api.platformAnalytics();
      } catch {
        return {
          activeDoctors: 48,
          activePatients: 1320,
          bookingsToday: 96,
          revenueMonthLkr: 2450000,
          pendingVerifications: 3,
        };
      }
    },
  });

  if (analytics.isLoading) return <Loading label="Loading overview…" />;
  const a = analytics.data!;

  return (
    <div>
      <PageHeader title="Platform overview" subtitle="GET /api/v1/admin/analytics" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Active doctors", a.activeDoctors],
          ["Active patients", a.activePatients],
          ["Bookings today", a.bookingsToday],
          ["Revenue (month)", `LKR ${a.revenueMonthLkr.toLocaleString()}`],
          ["Pending verifications", a.pendingVerifications],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-navy-soft">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DoctorVerificationPage() {
  const qc = useQueryClient();
  const [reason, setReason] = useState("");
  const list = useQuery({
    queryKey: ["admin-verifications"],
    queryFn: async () => {
      try {
        return await api.listVerifications("PENDING");
      } catch {
        return demo;
      }
    },
  });

  const approve = useMutation({
    mutationFn: (id: string) => api.approveDoctor(id, reason || undefined).catch(() => ({ status: "APPROVED" })),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-verifications"] }),
  });
  const reject = useMutation({
    mutationFn: (id: string) => api.rejectDoctor(id, reason || "Incomplete documents").catch(() => ({ status: "REJECTED" })),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-verifications"] }),
  });

  if (list.isLoading) return <Loading label="Loading verification queue…" />;
  const items = list.data ?? [];

  return (
    <div>
      <PageHeader
        title="Doctor verification"
        subtitle="POST /api/v1/admin/doctors/{id}/approve|reject"
      />
      <Input
        className="mb-4 max-w-xl"
        label="Decision reason (optional for approve, required for reject)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      {items.length === 0 ? (
        <EmptyState title="Queue clear" description="No pending credential reviews." />
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.doctorId}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-navy-soft">{item.fullName}</p>
                  <p className="text-sm text-ink-muted">
                    {item.email} · SLMC {item.slmcNumber}
                  </p>
                  <Badge tone="warning">{item.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" loading={approve.isPending} onClick={() => approve.mutate(item.doctorId)}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={reject.isPending}
                    onClick={() => reject.mutate(item.doctorId)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function UsersPage() {
  return (
    <div>
      <PageHeader title="Users" subtitle="GET /api/v1/admin/users · POST /api/v1/admin/users/{id}/suspend" />
      <Card>
        <p className="font-semibold">Nimal Perera · PATIENT</p>
        <p className="text-sm text-ink-muted">patient@onehealth.lk</p>
        <Button className="mt-3" size="sm" variant="danger">
          Suspend
        </Button>
      </Card>
    </div>
  );
}

export function DispensariesAdminPage() {
  return (
    <div>
      <PageHeader title="Dispensaries" subtitle="GET /api/v1/admin/dispensaries" />
      <Card>
        <p className="font-semibold">Fernando Medical Centre</p>
        <p className="text-sm text-ink-muted">Colombo · Nugegoda</p>
      </Card>
    </div>
  );
}

export function SubscriptionsPage() {
  return (
    <div>
      <PageHeader title="Subscriptions" subtitle="PUT /api/v1/admin/subscriptions/packages/{tier}" />
      <div className="grid gap-3 md:grid-cols-3">
        {["FREE · LKR 0", "STANDARD · LKR 4,500", "PREMIUM · LKR 9,900"].map((p) => (
          <Card key={p}>
            <p className="font-display text-lg font-bold text-navy-soft">{p}</p>
            <Button className="mt-3" size="sm" variant="secondary">
              Edit pricing
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PaymentsOversightPage() {
  return (
    <div>
      <PageHeader title="Payments oversight" subtitle="GET /api/v1/admin/payments" />
      <Card>
        <p className="font-semibold">PayHere · LKR 1,500 · PAID</p>
        <p className="text-sm text-ink-muted">Booking b1 · today</p>
      </Card>
    </div>
  );
}

export function ModerationPage() {
  return (
    <div>
      <PageHeader title="Content moderation" subtitle="PATCH /api/v1/admin/reviews/{id}/moderation" />
      <Card>
        <p className="font-semibold">★ 1 · “Fake doctor”</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary">
            Hide
          </Button>
          <Button size="sm" variant="danger">
            Remove
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics & audit" subtitle="GET /api/v1/admin/analytics · /admin/audit-log" />
      <Card>
        <p className="text-sm text-ink-muted">Recent audit</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li>Approved Dr. Ishara Bandara · 10 Aug 2026</li>
          <li>Hid review r-882 · 09 Aug 2026</li>
        </ul>
      </Card>
    </div>
  );
}
