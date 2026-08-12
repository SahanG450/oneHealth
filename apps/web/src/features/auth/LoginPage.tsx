import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, Button, Input } from "@onehealth/ui-kit";
import { homePathForRole, useAuthStore } from "@/hooks/useAuthStore";
import type { Role } from "@onehealth/types";

export function LoginPage({ portal = "web" }: { portal?: "web" | "admin" }) {
  const login = useAuthStore((s) => s.login);
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      if (portal === "admin" && user.role !== "ADMIN") {
        setError("This portal is for system admins only.");
        return;
      }
      if (portal === "web" && user.role === "ADMIN") {
        setError("Admins sign in via the Admin portal.");
        return;
      }
      navigate(portal === "admin" ? "/admin" : homePathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  function quick(role: Role) {
    if (portal === "admin" && role !== "ADMIN") return;
    if (portal === "web" && role === "ADMIN") return;
    demoLogin(role);
    navigate(portal === "admin" ? "/admin" : homePathForRole(role));
  }

  return (
    <AuthShell
      title={portal === "admin" ? "Admin sign in" : "Welcome back"}
      subtitle={
        portal === "admin"
          ? "Secure OneHealth operations console"
          : "Patients, doctors, and staff use the same sign-in"
      }
      footer={
        portal === "web" ? (
          <p>
            New here?{" "}
            <Link className="font-semibold text-brand-600" to="/register">
              Create an account
            </Link>
          </p>
        ) : (
          <p>Separate deployment — same OneHealth brand & login pattern.</p>
        )
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 border-t border-surface-border pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Demo access (no backend)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(portal === "admin" ? (["ADMIN"] as Role[]) : (["PATIENT", "DOCTOR", "STAFF"] as Role[])).map(
            (role) => (
              <Button key={role} type="button" variant="secondary" size="sm" onClick={() => quick(role)}>
                {role}
              </Button>
            )
          )}
        </div>
      </div>
    </AuthShell>
  );
}
