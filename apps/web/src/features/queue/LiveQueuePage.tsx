import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, EmptyState, Loading, PageHeader } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

export function LiveQueuePage() {
  const dispensaryId = "disp-1";
  const date = new Date().toISOString().slice(0, 10);
  const [liveCurrent, setLiveCurrent] = useState<number | null>(null);

  const queue = useQuery({
    queryKey: ["queue", dispensaryId, date],
    queryFn: async () => {
      try {
        return await api.getQueue(dispensaryId, date);
      } catch {
        return {
          dispensaryId,
          sessionId: "sess-1",
          queueDate: date,
          currentNumber: 18,
          totalWaiting: 12,
          entries: [
            {
              id: "qe-me",
              dispensaryId,
              patientId: "me",
              queueDate: date,
              tokenNumber: 42,
              status: "WAITING" as const,
              position: 24,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
    },
    refetchInterval: supabaseConfigured ? false : 5000,
  });

  useEffect(() => {
    if (!supabaseConfigured || !queue.data) return;
    const channel = supabase
      .channel(`queue:${dispensaryId}:${queue.data.sessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_entries", filter: `dispensary_id=eq.${dispensaryId}` },
        (payload) => {
          const row = payload.new as { position?: number; token_number?: number };
          if (typeof row.token_number === "number") setLiveCurrent(row.token_number);
          void queue.refetch();
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [dispensaryId, queue.data?.sessionId]);

  if (queue.isLoading) return <Loading label="Connecting to live queue…" />;
  const data = queue.data!;
  const mine = data.entries[0];
  const current = liveCurrent ?? data.currentNumber;

  return (
    <div>
      <PageHeader
        title="Live queue"
        subtitle="Updates arrive via Supabase Realtime when the backend advances the queue."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 bg-brand-gradient text-white">
          <p className="text-sm font-semibold text-white/80">Now serving</p>
          <p className="mt-2 font-display text-6xl font-bold tracking-tight">#{current}</p>
          <p className="mt-3 text-sm text-white/85">{data.totalWaiting} patients waiting today</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink-muted">Your token</p>
          {mine ? (
            <>
              <p className="mt-2 font-display text-4xl font-bold text-navy-soft">#{mine.tokenNumber}</p>
              <div className="mt-3">
                <Badge>{mine.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                Approx. {Math.max((mine.tokenNumber ?? 0) - current, 0)} numbers ahead
              </p>
            </>
          ) : (
            <EmptyState title="No active booking" description="Book a queue number to track it here." />
          )}
        </Card>
      </div>
    </div>
  );
}
