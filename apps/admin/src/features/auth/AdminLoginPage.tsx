import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell, Button, Input } from "@onehealth/ui-kit";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/** Same AuthShell / Button / Input as web portal — separate app deployment. */
export function AdminLoginPage() {
  const loginDemo = useAdminAuth((s) => s.loginDemo);
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@onehealth.lk");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Production: Supabase Auth + GET /api/v1/me (must be ADMIN)
    await new Promise((r) => setTimeout(r, 400));
    loginDemo();
    navigate("/admin");
    setLoading(false);
  }

  return (
    <AuthShell
      title="Admin sign in"
      subtitle="Credential review, subscriptions, moderation & analytics"
      footer={<p>Separate admin app · same OneHealth login interface</p>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>
      <Button className="mt-3" fullWidth variant="secondary" onClick={() => { loginDemo(); navigate("/admin"); }}>
        Demo admin access
      </Button>
    </AuthShell>
  );
}
