import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuthStore } from "@/hooks/useAuthStore";
import { LandingPage } from "@/features/auth/LandingPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { PatientHome } from "@/features/profile/PatientHome";
import { SearchDoctorsPage } from "@/features/search-doctors/SearchDoctorsPage";
import { DoctorProfilePage } from "@/features/search-doctors/DoctorProfilePage";
import { LiveQueuePage } from "@/features/queue/LiveQueuePage";
import { BookingsPage } from "@/features/booking/BookingsPage";
import { RecommendPage } from "@/features/emr/RecommendPage";
import { EmrPage } from "@/features/emr/EmrPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { DoctorDashboard } from "@/features/doctor/DoctorDashboard";
import {
  DoctorAnalyticsPage,
  DoctorDispensariesPage,
  DoctorPrescriptionsPage,
  DoctorStaffPage,
  DoctorSubscriptionPage,
} from "@/features/doctor/DoctorPages";
import { DoctorQueuePage } from "@/features/doctor/DoctorQueuePage";
import { StaffConsolePage, StaffPaymentsPage, StaffPrescriptionsPage } from "@/features/staff-console/StaffPages";
import type { Role } from "@onehealth/types";

function RequireAuth({ roles }: { roles?: Role[] }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage portal="web" />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RequireAuth roles={["PATIENT"]} />}>
        <Route element={<AppShell />}>
          <Route path="/app" element={<PatientHome />} />
          <Route path="/app/search" element={<SearchDoctorsPage />} />
          <Route path="/app/doctors/:id" element={<DoctorProfilePage />} />
          <Route path="/app/queue" element={<LiveQueuePage />} />
          <Route path="/app/bookings" element={<BookingsPage />} />
          <Route path="/app/recommend" element={<RecommendPage />} />
          <Route path="/app/emr" element={<EmrPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={["DOCTOR"]} />}>
        <Route element={<AppShell />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/queue" element={<DoctorQueuePage />} />
          <Route path="/doctor/dispensaries" element={<DoctorDispensariesPage />} />
          <Route path="/doctor/staff" element={<DoctorStaffPage />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptionsPage />} />
          <Route path="/doctor/analytics" element={<DoctorAnalyticsPage />} />
          <Route path="/doctor/subscription" element={<DoctorSubscriptionPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={["STAFF"]} />}>
        <Route element={<AppShell />}>
          <Route path="/staff" element={<StaffConsolePage />} />
          <Route path="/staff/payments" element={<StaffPaymentsPage />} />
          <Route path="/staff/prescriptions" element={<StaffPrescriptionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
