import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLoginPage } from "@/features/auth/AdminLoginPage";
import { AdminShell } from "@/components/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  AdminOverview,
  AnalyticsPage,
  DispensariesAdminPage,
  DoctorVerificationPage,
  ModerationPage,
  PaymentsOversightPage,
  SubscriptionsPage,
  UsersPage,
} from "@/features/adminPages";

const qc = new QueryClient();

function RequireAdmin() {
  const user = useAdminAuth((s) => s.user);
  if (!user || user.role !== "ADMIN") return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminShell />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/verifications" element={<DoctorVerificationPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/dispensaries" element={<DispensariesAdminPage />} />
            <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/admin/payments" element={<PaymentsOversightPage />} />
            <Route path="/admin/moderation" element={<ModerationPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
