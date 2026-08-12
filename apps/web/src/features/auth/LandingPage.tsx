import { Link } from "react-router-dom";
import { Button } from "@onehealth/ui-kit";

export function LandingPage() {
  return (
    <div className="oh-auth-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <img src="/logo.png" alt="OneHealth" className="h-16 w-auto max-w-[220px] object-contain object-left md:h-20 md:max-w-[280px]" />
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:pt-10">
        <div>
          <p className="font-display text-5xl font-extrabold italic tracking-tight text-brand-500 md:text-6xl">
            OneHealth
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-soft md:text-4xl">
            Book your channelling number before you travel.
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-muted">
            Verified private doctors, live queue tracking, and a clean medical experience for patients, doctors, and
            staff — on web and mobile.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg">Create account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-surface-border bg-white shadow-soft">
          <div className="bg-brand-gradient px-6 py-10 text-white">
            <p className="text-sm font-semibold text-white/80">Live queue</p>
            <p className="mt-2 font-display text-6xl font-bold">#18</p>
            <p className="mt-3 text-sm text-white/85">Your token #42 · ~24 ahead</p>
          </div>
          <div className="space-y-3 px-6 py-6">
            <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-ink">
              Search verified doctors near you
            </div>
            <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-ink">
              Reserve a number remotely
            </div>
            <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-ink">
              Get notified as your turn approaches
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
