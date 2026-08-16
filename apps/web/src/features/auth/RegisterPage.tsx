import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, Button, Input } from "@onehealth/ui-kit";
import { homePathForRole, useAuthStore } from "@/hooks/useAuthStore";

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [slmcRegNo, setSlmcRegNo] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [licenceUrl, setLicenceUrl] = useState("");
  const [packageId, setPackageId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await register({
        email,
        password,
        fullName,
        phone,
        nicNumber,
        role,
        ...(role === "DOCTOR"
          ? {
              specialization,
              slmcRegNo,
              certificateUrl,
              licenceUrl,
              packageId,
              verificationStatus: "PENDING",
            }
          : {}),
      });
      navigate(homePathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your OneHealth account"
      subtitle="One clean login for patients and doctors"
      footer={
        <p>
          Already registered?{" "}
          <Link className="font-semibold text-brand-600" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-2">
          {(["PATIENT", "DOCTOR"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                role === r
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-surface-border text-ink-muted"
              }`}
            >
              {r === "PATIENT" ? "I am a patient" : "I am a doctor"}
            </button>
          ))}
        </div>
        <Input label="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94…" />
        <Input label="NIC number" required value={nicNumber} onChange={(e) => setNicNumber(e.target.value)} />
        {role === "DOCTOR" ? (
          <div className="space-y-4 rounded-2xl border border-surface-border bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold text-ink">Doctor verification details</p>
            <Input
              label="Specialization"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="Cardiology, Dermatology, Pediatrics…"
            />
            <Input
              label="SLMC registration number"
              required
              value={slmcRegNo}
              onChange={(e) => setSlmcRegNo(e.target.value)}
            />
            <Input
              label="Certificate URL"
              type="url"
              required
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
              placeholder="https://…"
            />
            <Input
              label="Licence URL"
              type="url"
              required
              value={licenceUrl}
              onChange={(e) => setLicenceUrl(e.target.value)}
              placeholder="https://…"
            />
            <Input label="Package ID" required value={packageId} onChange={(e) => setPackageId(e.target.value)} />
          </div>
        ) : null}
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" fullWidth loading={loading}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
