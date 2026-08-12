import { useState } from "react";
import { Button, Card, PageHeader, Badge } from "@onehealth/ui-kit";
import { api } from "@/lib/api";

export function StaffConsolePage() {
  const [current, setCurrent] = useState(18);

  return (
    <div>
      <PageHeader title="Staff queue console" subtitle="Reception permission · live queue updates" />
      <Card className="max-w-lg">
        <Badge>RECEPTION</Badge>
        <p className="mt-3 text-sm text-ink-muted">Now serving</p>
        <p className="font-display text-5xl font-bold text-navy-soft">#{current}</p>
        <Button
          className="mt-4"
          onClick={async () => {
            const next = current + 1;
            try {
              await api.updateCurrentQueue("disp-1", {
                currentNumber: next,
                queueDate: new Date().toISOString().slice(0, 10),
              });
            } catch {
              /* demo */
            }
            setCurrent(next);
          }}
        >
          Call next patient
        </Button>
      </Card>
    </div>
  );
}

export function StaffPaymentsPage() {
  return (
    <div>
      <PageHeader title="Counter payments" subtitle="POST /api/v1/payments/charge + Idempotency-Key" />
      <Card>
        <p className="font-semibold">Token #42 · LKR 1,500</p>
        <Button className="mt-3" size="sm">
          Take payment
        </Button>
      </Card>
    </div>
  );
}

export function StaffPrescriptionsPage() {
  return (
    <div>
      <PageHeader title="Dispense prescriptions" subtitle="PATCH /api/v1/prescriptions/{id}/dispense" />
      <Card>
        <p className="font-semibold">Paracetamol 500mg</p>
        <p className="text-sm text-ink-muted">Nimal Perera</p>
        <Button className="mt-3" size="sm" variant="secondary">
          Mark dispensed
        </Button>
      </Card>
    </div>
  );
}
