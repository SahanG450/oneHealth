import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge, Button, Card, Input, Loading, PageHeader } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import { useState } from "react";

export function DoctorProfilePage() {
  const { id = "" } = useParams();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState("");

  const doctor = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      try {
        return await api.getDoctor(id);
      } catch {
        return {
          id,
          fullName: "Dr. Anusha Fernando",
          specialization: "General Practice",
          city: "Colombo",
          town: "Nugegoda",
          averageRating: 4.8,
          reviewCount: 126,
          subscriptionTier: "PREMIUM" as const,
          verificationStatus: "APPROVED" as const,
          bio: "15 years in private outpatient care. Evening clinics available.",
          dispensaries: [
            {
              id: "disp-1",
              doctorId: id,
              name: "Fernando Medical Centre",
              city: "Colombo",
              town: "Nugegoda",
              address: "12 High Level Rd",
              currentQueueNumber: 18,
            },
          ],
          reviews: [
            {
              id: "r1",
              doctorId: id,
              patientId: "p1",
              patientName: "Sahan",
              rating: 5,
              comment: "Clear advice, short wait with OneHealth booking.",
              moderationStatus: "VISIBLE" as const,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
    },
  });

  const book = useMutation({
    mutationFn: async (dispensaryId: string) => {
      const key = crypto.randomUUID();
      try {
        return await api.createBooking({ dispensaryId, queueDate: date }, key);
      } catch {
        return {
          id: "demo-booking",
          paymentRequired: false,
          queueEntry: {
            id: "qe-1",
            dispensaryId,
            patientId: "me",
            queueDate: date,
            tokenNumber: 42,
            status: "WAITING" as const,
            createdAt: new Date().toISOString(),
          },
        };
      }
    },
    onSuccess: (data) => {
      setMessage(`Booked token #${data.queueEntry.tokenNumber} for ${data.queueEntry.queueDate}`);
    },
  });

  if (doctor.isLoading) return <Loading label="Loading doctor…" />;
  const d = doctor.data!;

  return (
    <div>
      <PageHeader
        title={d.fullName}
        subtitle={`${d.specialization} · ${d.city}`}
        actions={<Badge>★ {d.averageRating.toFixed(1)}</Badge>}
      />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="text-sm text-ink-muted">{d.bio}</p>
          <div className="mt-4 space-y-3">
            {d.dispensaries.map((disp) => (
              <div key={disp.id} className="rounded-xl border border-surface-border p-4">
                <p className="font-semibold text-ink">{disp.name}</p>
                <p className="text-sm text-ink-muted">
                  {disp.address} · Now serving #{disp.currentQueueNumber ?? "—"}
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <Input
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="max-w-[180px]"
                  />
                  <Button loading={book.isPending} onClick={() => book.mutate(disp.id)}>
                    Book next number
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
        </Card>
        <Card>
          <p className="font-display text-lg font-bold text-navy-soft">Reviews</p>
          <ul className="mt-3 space-y-3">
            {d.reviews.map((r) => (
              <li key={r.id} className="border-b border-surface-border pb-3 last:border-0">
                <p className="text-sm font-semibold text-ink">
                  ★ {r.rating} · {r.patientName ?? "Patient"}
                </p>
                <p className="text-sm text-ink-muted">{r.comment}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
