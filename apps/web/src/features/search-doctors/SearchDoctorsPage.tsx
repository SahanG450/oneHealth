import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Card, EmptyState, Input, Loading, PageHeader } from "@onehealth/ui-kit";
import { api } from "@/lib/api";
import type { DoctorSummary } from "@onehealth/types";

const demoDoctors: DoctorSummary[] = [
  {
    id: "d1",
    fullName: "Dr. Anusha Fernando",
    specialization: "General Practice",
    city: "Colombo",
    town: "Nugegoda",
    averageRating: 4.8,
    reviewCount: 126,
    subscriptionTier: "PREMIUM",
    verificationStatus: "APPROVED",
  },
  {
    id: "d2",
    fullName: "Dr. Ruwan Jayasuriya",
    specialization: "Pediatrics",
    city: "Kandy",
    averageRating: 4.6,
    reviewCount: 84,
    subscriptionTier: "STANDARD",
    verificationStatus: "APPROVED",
  },
  {
    id: "d3",
    fullName: "Dr. Dilani Perera",
    specialization: "Dermatology",
    city: "Galle",
    averageRating: 4.9,
    reviewCount: 51,
    subscriptionTier: "FREE",
    verificationStatus: "APPROVED",
  },
];

export function SearchDoctorsPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const query = useQuery({
    queryKey: ["doctors-search", q, city],
    queryFn: async () => {
      try {
        return await api.searchDoctors({ q, city });
      } catch {
        const filtered = demoDoctors.filter((d) => {
          const hay = `${d.fullName} ${d.specialization} ${d.city}`.toLowerCase();
          return (
            (!q || hay.includes(q.toLowerCase())) &&
            (!city || d.city.toLowerCase().includes(city.toLowerCase()))
          );
        });
        return { items: filtered, total: filtered.length };
      }
    },
  });

  const items = useMemo(() => query.data?.items ?? [], [query.data]);

  return (
    <div>
      <PageHeader title="Find doctors" subtitle="Search verified private-practice consultants across Sri Lanka." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Input placeholder="Name or specialization" value={q} onChange={(e) => setQ(e.target.value)} />
        <Input placeholder="City / town" value={city} onChange={(e) => setCity(e.target.value)} />
        <Button onClick={() => void query.refetch()} loading={query.isFetching}>
          Search
        </Button>
      </div>

      {query.isLoading ? (
        <Loading label="Searching doctors…" />
      ) : items.length === 0 ? (
        <EmptyState title="No doctors found" description="Try another city or specialization." />
      ) : (
        <div className="grid gap-3">
          {items.map((d) => (
            <Card key={d.id} interactive>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-navy-soft">{d.fullName}</p>
                  <p className="text-sm text-ink-muted">
                    {d.specialization} · {d.city}
                    {d.town ? `, ${d.town}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>
                      ★ {d.averageRating.toFixed(1)} ({d.reviewCount})
                    </Badge>
                    <Badge tone="neutral">{d.subscriptionTier}</Badge>
                  </div>
                </div>
                <Link to={`/app/doctors/${d.id}`}>
                  <Button size="sm">View & book</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
