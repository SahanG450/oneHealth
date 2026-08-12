import { Card, PageHeader, Input, Button } from "@onehealth/ui-kit";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useState } from "react";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  return (
    <div>
      <PageHeader title="Profile" subtitle="Keep your contact details up to date for queue notifications." />
      <Card className="max-w-lg space-y-4">
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="Email" value={user?.email ?? ""} disabled />
        <Input label="Role" value={user?.role ?? ""} disabled />
        <Button
          onClick={() => {
            if (!user) return;
            setUser({ ...user, fullName, phone });
          }}
        >
          Save locally
        </Button>
        <p className="text-xs text-ink-muted">Persists via PATCH /api/v1/me when the Spring Boot API is available.</p>
      </Card>
    </div>
  );
}
