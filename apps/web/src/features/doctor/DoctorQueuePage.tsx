import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Input, Loading, PageHeader } from "@onehealth/ui-kit";
import { api } from "@/lib/api";

export function DoctorQueuePage() {
  const dispensaryId = "disp-1";
  const date = new Date().toISOString().slice(0, 10);
  const [current, setCurrent] = useState(18);
  const qc = useQueryClient();

  const queue = useQuery({
    queryKey: ["doctor-queue", dispensaryId, date],
    queryFn: async () => {
      try {
        return await api.getQueue(dispensaryId, date);
      } catch {
        return {
          dispensaryId,
          sessionId: "sess-1",
          queueDate: date,
          currentNumber: current,
          totalWaiting: 12,
          entries: [],
        };
      }
    },
  });

  const update = useMutation({
    mutationFn: async (next: number) => {
      try {
        return await api.updateCurrentQueue(dispensaryId, { currentNumber: next, queueDate: date });
      } catch {
        setCurrent(next);
        return { ...queue.data!, currentNumber: next };
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["doctor-queue"] }),
  });

  if (queue.isLoading) return <Loading label="Loading queue…" />;
  const serving = queue.data?.currentNumber ?? current;

  return (
    <div>
      <PageHeader title="Update queue" subtitle="PATCH /api/v1/dispensaries/{id}/queue/current" />
      <Card className="max-w-lg">
        <p className="text-sm text-ink-muted">Now serving</p>
        <p className="font-display text-5xl font-bold text-navy-soft">#{serving}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => update.mutate(serving + 1)} loading={update.isPending}>
            Call next
          </Button>
          <Button variant="secondary" onClick={() => update.mutate(Math.max(serving - 1, 0))}>
            Step back
          </Button>
        </div>
        <div className="mt-4">
          <Input
            label="Jump to number"
            type="number"
            value={String(serving)}
            onChange={(e) => setCurrent(Number(e.target.value))}
          />
          <Button className="mt-2" variant="secondary" onClick={() => update.mutate(current)}>
            Set number
          </Button>
        </div>
      </Card>
    </div>
  );
}
