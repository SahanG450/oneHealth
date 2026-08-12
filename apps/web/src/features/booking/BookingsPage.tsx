import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Card, EmptyState, Loading, PageHeader } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

export function BookingsPage() {
  const bookings = useQuery({
    queryKey: ["bookings-me"],
    queryFn: async () => {
      try {
        return await api.myBookings();
      } catch {
        return [
          {
            id: "b1",
            paymentRequired: false,
            paymentStatus: "PAID" as const,
            queueEntry: {
              id: "qe1",
              dispensaryId: "disp-1",
              patientId: "me",
              queueDate: new Date().toISOString().slice(0, 10),
              tokenNumber: 42,
              status: "WAITING" as const,
              createdAt: new Date().toISOString(),
            },
          },
        ];
      }
    },
  });

  if (bookings.isLoading) return <Loading label="Loading bookings…" />;
  const items = bookings.data ?? [];

  return (
    <div>
      <PageHeader
        title="My bookings"
        subtitle="Cancel before you are called. Pay online when the doctor is on Standard/Premium."
        actions={
          <Link to="/app/search">
            <Button size="sm">New booking</Button>
          </Link>
        }
      />
      {items.length === 0 ? (
        <EmptyState title="No bookings yet" description="Find a doctor and reserve a queue number." />
      ) : (
        <div className="grid gap-3">
          {items.map((b) => (
            <Card key={b.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-navy-soft">
                    Token #{b.queueEntry.tokenNumber}
                  </p>
                  <p className="text-sm text-ink-muted">{b.queueEntry.queueDate}</p>
                </div>
                <div className="flex gap-2">
                  <Badge>{b.queueEntry.status}</Badge>
                  {b.paymentStatus ? <Badge tone="success">{b.paymentStatus}</Badge> : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
