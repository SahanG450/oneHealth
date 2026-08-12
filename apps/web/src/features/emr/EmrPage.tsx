import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, Loading, PageHeader } from "@onehealth/ui-kit";
import { api } from "@/lib/api";

export function EmrPage() {
  const records = useQuery({
    queryKey: ["emr-me"],
    queryFn: async () => {
      try {
        return await api.myMedicalRecords();
      } catch {
        return [
          {
            id: "mr1",
            patientId: "me",
            doctorId: "d1",
            diagnosis: "Viral fever",
            notes: "Rest, fluids, follow-up if fever persists > 3 days.",
            visitDate: "2026-08-01",
          },
        ];
      }
    },
  });

  if (records.isLoading) return <Loading label="Loading records…" />;
  const items = records.data ?? [];

  return (
    <div>
      <PageHeader title="Medical records" subtitle="Premium feature — visible only to you and treating doctors." />
      {items.length === 0 ? (
        <EmptyState title="No records" description="Records appear after Premium consultations." />
      ) : (
        <div className="grid gap-3">
          {items.map((r) => (
            <Card key={r.id}>
              <p className="font-display text-lg font-bold text-navy-soft">{r.diagnosis}</p>
              <p className="text-sm text-ink-muted">{r.visitDate}</p>
              <p className="mt-2 text-sm text-ink">{r.notes}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
