import { Button, Card, EmptyState, PageHeader, Badge } from "@onehealth/ui-kit";

export function DoctorDispensariesPage() {
  const items = [
    {
      id: "disp-1",
      name: "Fernando Medical Centre",
      city: "Colombo",
      town: "Nugegoda",
      address: "12 High Level Rd",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dispensaries"
        subtitle="POST /api/v1/dispensaries · PUT /api/v1/dispensaries/{id}"
        actions={<Button size="sm">Add dispensary</Button>}
      />
      {items.length === 0 ? (
        <EmptyState title="No dispensaries" />
      ) : (
        <div className="grid gap-3">
          {items.map((d) => (
            <Card key={d.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-navy-soft">{d.name}</p>
                  <p className="text-sm text-ink-muted">
                    {d.address}, {d.town}, {d.city}
                  </p>
                </div>
                <Badge>Live</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function DoctorStaffPage() {
  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Standard/Premium · POST /api/v1/doctors/me/staff"
        actions={<Button size="sm">Invite staff</Button>}
      />
      <Card>
        <p className="font-semibold">Kasun Silva · RECEPTION</p>
        <p className="text-sm text-ink-muted">staff@onehealth.lk · Fernando Medical Centre</p>
      </Card>
    </div>
  );
}

export function DoctorPrescriptionsPage() {
  return (
    <div>
      <PageHeader title="e-Prescriptions" subtitle="POST /api/v1/prescriptions" actions={<Button size="sm">Issue e-Rx</Button>} />
      <Card>
        <p className="font-semibold">Paracetamol 500mg · TDS × 3 days</p>
        <p className="text-sm text-ink-muted">Patient: Nimal Perera · awaiting dispense</p>
      </Card>
    </div>
  );
}

export function DoctorAnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="GET /api/v1/doctors/me/analytics" />
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-sm text-ink-muted">This week bookings</p>
          <p className="font-display text-4xl font-bold text-navy-soft">36</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Revenue (LKR)</p>
          <p className="font-display text-4xl font-bold text-navy-soft">128,000</p>
        </Card>
      </div>
    </div>
  );
}

export function DoctorSubscriptionPage() {
  return (
    <div>
      <PageHeader title="Subscription" subtitle="PUT /api/v1/doctors/me/subscription" />
      <div className="grid gap-3 md:grid-cols-3">
        {(["FREE", "STANDARD", "PREMIUM"] as const).map((tier) => (
          <Card key={tier} className={tier === "STANDARD" ? "border-brand-300" : ""}>
            <p className="font-display text-xl font-bold text-navy-soft">{tier}</p>
            <p className="mt-2 text-sm text-ink-muted">
              {tier === "FREE" && "Solo doctor, cash at counter"}
              {tier === "STANDARD" && "Staff, online pay, e-Rx"}
              {tier === "PREMIUM" && "EMR, reports, multi-branch"}
            </p>
            <Button className="mt-4" variant={tier === "STANDARD" ? "primary" : "secondary"} size="sm">
              {tier === "STANDARD" ? "Current plan" : "Switch"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
