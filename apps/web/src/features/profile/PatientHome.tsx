import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "@onehealth/ui-kit";
import { useAuthStore } from "@/hooks/useAuthStore";

export function PatientHome() {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.fullName?.split(" ")[0] ?? "there"}`}
        subtitle="Find a verified doctor, book your number, and track the queue live."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card interactive className="md:col-span-2">
          <p className="font-display text-xl font-bold text-navy-soft">Book in a few taps</p>
          <p className="mt-2 text-sm text-ink-muted">
            Search by city or specialization, reserve a queue token before you travel, and get notified as your
            turn approaches.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/app/search">
              <Button>Find doctors</Button>
            </Link>
            <Link to="/app/recommend">
              <Button variant="secondary">Describe symptoms</Button>
            </Link>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink-muted">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-brand-700">
            <li>
              <Link to="/app/bookings">My bookings</Link>
            </li>
            <li>
              <Link to="/app/queue">Live queue</Link>
            </li>
            <li>
              <Link to="/app/emr">Medical records</Link>
            </li>
            <li>
              <Link to="/app/profile">Profile</Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
