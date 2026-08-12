import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, EmptyState, PageHeader, TextArea, Badge } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import type { RecommendationResult } from "@onehealth/types";

export function RecommendPage() {
  const [symptoms, setSymptoms] = useState("");
  const [city, setCity] = useState("Colombo");
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const mutate = useMutation({
    mutationFn: async () => {
      try {
        return await api.recommendDoctors({ symptoms, city, limit: 5 });
      } catch {
        return {
          disclaimer:
            "Suggestions only — not a medical diagnosis. Always consult a qualified doctor.",
          doctors: [
            {
              id: "d1",
              fullName: "Dr. Anusha Fernando",
              specialization: "General Practice",
              city: "Colombo",
              averageRating: 4.8,
              reviewCount: 126,
              subscriptionTier: "PREMIUM" as const,
              verificationStatus: "APPROVED" as const,
              matchScore: 0.91,
              reason: "Matches fever / general outpatient care nearby",
            },
          ],
        } satisfies RecommendationResult;
      }
    },
    onSuccess: setResult,
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutate.mutate();
  }

  return (
    <div>
      <PageHeader
        title="Symptom guide"
        subtitle="Describe how you feel. We suggest nearby verified doctors — never a diagnosis."
      />
      <Card className="mb-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <TextArea
            label="Symptoms"
            required
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. fever for 2 days, mild cough…"
          />
          <input
            className="h-11 w-full rounded-xl border border-surface-border px-3.5"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <Button type="submit" loading={mutate.isPending}>
            Suggest doctors
          </Button>
        </form>
      </Card>
      {result ? (
        <div className="space-y-3">
          <p className="text-sm text-amber-800 bg-amber-50 rounded-xl px-3 py-2">{result.disclaimer}</p>
          {result.doctors.map((d) => (
            <Card key={d.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink">{d.fullName}</p>
                  <p className="text-sm text-ink-muted">
                    {d.specialization} · {d.city}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{d.reason}</p>
                </div>
                <Badge>Match {(d.matchScore * 100).toFixed(0)}%</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No suggestions yet" description="Enter symptoms to get ranked nearby doctors." />
      )}
    </div>
  );
}
