/**
 * Typed OneHealth API client for Spring Boot `/api/v1`.
 * Auth: Authorization: Bearer <supabase-jwt>
 * Errors: { code, message, details }
 *
 * When OpenAPI codegen is wired, replace this module with `./generated`.
 */
import type {
  ApiError,
  Booking,
  BookingRequest,
  Dispensary,
  DoctorProfile,
  DoctorSummary,
  DoctorVerificationItem,
  MedicalRecord,
  PaymentInitRequest,
  PaymentInitResponse,
  PlatformAnalytics,
  Prescription,
  QueueSession,
  RecommendationRequest,
  RecommendationResult,
  Review,
  StaffMember,
  SubscriptionPackage,
  SubscriptionTier,
  UserProfile,
  AuditLogEntry,
} from "@onehealth/types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  fetchImpl?: typeof fetch;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.message || `API error ${status}`);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
  }
}

export function createApiClient(options: ApiClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, "");

  async function request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const token = options.getAccessToken ? await options.getAccessToken() : null;
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };

    const res = await fetchImpl(`${baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errBody: ApiError = { code: "HTTP_ERROR", message: res.statusText };
      try {
        errBody = (await res.json()) as ApiError;
      } catch {
        /* keep default */
      }
      throw new ApiClientError(res.status, errBody);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return {
    /** GET /api/v1/me */
    getMe: () => request<UserProfile>("GET", "/me"),

    /** PATCH /api/v1/me */
    updateMe: (payload: Partial<Pick<UserProfile, "fullName" | "phone" | "avatarUrl">>) =>
      request<UserProfile>("PATCH", "/me", payload),

    /** POST /api/v1/auth/register */
    register: (payload: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      nicNumber: string;
      role: "PATIENT" | "DOCTOR";
      specialization?: string;
      slmcRegNo?: string;
      certificateUrl?: string;
      licenceUrl?: string;
      verificationStatus?: "PENDING";
      packageId?: string;
    }) => request<UserProfile>("POST", "/auth/register", payload),

    /** GET /api/v1/doctors/search?q=&city=&specialization= */
    searchDoctors: (params: {
      q?: string;
      city?: string;
      town?: string;
      specialization?: string;
      page?: number;
      size?: number;
    }) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") qs.set(k, String(v));
      });
      return request<{ items: DoctorSummary[]; total: number }>("GET", `/doctors/search?${qs}`);
    },

    /** GET /api/v1/doctors/{id} */
    getDoctor: (id: string) => request<DoctorProfile>("GET", `/doctors/${id}`),

    /** POST /api/v1/doctors/me/credentials — multipart handled by caller via signed upload then confirm */
    submitDoctorCredentials: (payload: {
      slmcNumber: string;
      certificateStoragePath: string;
      licenceStoragePath: string;
    }) => request<{ status: string }>("POST", "/doctors/me/credentials", payload),

    /** GET /api/v1/dispensaries?doctorId= */
    listDispensaries: (doctorId?: string) => {
      const qs = doctorId ? `?doctorId=${encodeURIComponent(doctorId)}` : "";
      return request<Dispensary[]>("GET", `/dispensaries${qs}`);
    },

    /** GET /api/v1/dispensaries/{id} */
    getDispensary: (id: string) => request<Dispensary>("GET", `/dispensaries/${id}`),

    /** POST /api/v1/dispensaries */
    createDispensary: (payload: Omit<Dispensary, "id" | "doctorId" | "currentQueueNumber">) =>
      request<Dispensary>("POST", "/dispensaries", payload),

    /** PUT /api/v1/dispensaries/{id} */
    updateDispensary: (id: string, payload: Partial<Dispensary>) =>
      request<Dispensary>("PUT", `/dispensaries/${id}`, payload),

    /** GET /api/v1/dispensaries/{id}/queue?date=YYYY-MM-DD */
    getQueue: (dispensaryId: string, date: string) =>
      request<QueueSession>("GET", `/dispensaries/${dispensaryId}/queue?date=${encodeURIComponent(date)}`),

    /** PATCH /api/v1/dispensaries/{id}/queue/current */
    updateCurrentQueue: (
      dispensaryId: string,
      payload: { currentNumber: number; queueDate: string }
    ) =>
      request<QueueSession>("PATCH", `/dispensaries/${dispensaryId}/queue/current`, payload),

    /** POST /api/v1/bookings — Idempotency-Key recommended */
    createBooking: (payload: BookingRequest, idempotencyKey?: string) =>
      request<Booking>(
        "POST",
        "/bookings",
        payload,
        idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined
      ),

    /** GET /api/v1/bookings/me */
    myBookings: () => request<Booking[]>("GET", "/bookings/me"),

    /** POST /api/v1/bookings/{id}/cancel */
    cancelBooking: (id: string) => request<Booking>("POST", `/bookings/${id}/cancel`),

    /** POST /api/v1/payments/charge — Idempotency-Key required */
    initiatePayment: (payload: PaymentInitRequest, idempotencyKey: string) =>
      request<PaymentInitResponse>("POST", "/payments/charge", payload, {
        "Idempotency-Key": idempotencyKey,
      }),

    /** GET /api/v1/payments/{id} */
    getPayment: (id: string) => request<PaymentInitResponse>("GET", `/payments/${id}`),

    /** POST /api/v1/prescriptions */
    createPrescription: (payload: {
      patientId: string;
      visitId?: string;
      medicines: Prescription["medicines"];
      notes?: string;
    }) => request<Prescription>("POST", "/prescriptions", payload),

    /** GET /api/v1/prescriptions/me */
    myPrescriptions: () => request<Prescription[]>("GET", "/prescriptions/me"),

    /** PATCH /api/v1/prescriptions/{id}/dispense */
    dispensePrescription: (id: string) =>
      request<Prescription>("PATCH", `/prescriptions/${id}/dispense`),

    /** GET /api/v1/emr/me */
    myMedicalRecords: () => request<MedicalRecord[]>("GET", "/emr/me"),

    /** POST /api/v1/emr */
    createMedicalRecord: (payload: {
      patientId: string;
      diagnosis: string;
      notes?: string;
      visitDate: string;
    }) => request<MedicalRecord>("POST", "/emr", payload),

    /** POST /api/v1/emr/{id}/attachments/signed-url */
    requestEmrUploadUrl: (recordId: string, fileName: string, mimeType: string) =>
      request<{ uploadUrl: string; storagePath: string }>("POST", `/emr/${recordId}/attachments/signed-url`, {
        fileName,
        mimeType,
      }),

    /** POST /api/v1/reviews */
    createReview: (payload: {
      doctorId: string;
      bookingId?: string;
      rating: number;
      comment?: string;
      symptoms?: string;
    }) => request<Review>("POST", "/reviews", payload),

    /** POST /api/v1/reviews/{id}/reply */
    replyToReview: (id: string, reply: string) =>
      request<Review>("POST", `/reviews/${id}/reply`, { reply }),

    /** POST /api/v1/recommendations */
    recommendDoctors: (payload: RecommendationRequest) =>
      request<RecommendationResult>("POST", "/recommendations", payload),

    /** GET /api/v1/doctors/me/staff */
    listStaff: () => request<StaffMember[]>("GET", "/doctors/me/staff"),

    /** POST /api/v1/doctors/me/staff */
    addStaff: (payload: {
      email: string;
      fullName: string;
      dispensaryId: string;
      permission: StaffMember["permission"];
      temporaryPassword: string;
    }) => request<StaffMember>("POST", "/doctors/me/staff", payload),

    /** PATCH /api/v1/doctors/me/staff/{id} */
    updateStaff: (id: string, payload: Partial<StaffMember>) =>
      request<StaffMember>("PATCH", `/doctors/me/staff/${id}`, payload),

    /** GET /api/v1/doctors/me/subscription */
    getMySubscription: () =>
      request<{ tier: SubscriptionTier; packages: SubscriptionPackage[] }>(
        "GET",
        "/doctors/me/subscription"
      ),

    /** PUT /api/v1/doctors/me/subscription */
    changeSubscription: (tier: SubscriptionTier) =>
      request<{ tier: SubscriptionTier }>("PUT", "/doctors/me/subscription", { tier }),

    /** GET /api/v1/doctors/me/analytics */
    doctorAnalytics: (params?: { from?: string; to?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>);
      return request<{
        bookings: number;
        revenueLkr: number;
        averageRating: number;
        noShows: number;
      }>("GET", `/doctors/me/analytics?${qs}`);
    },

    // —— Admin ——
    /** GET /api/v1/admin/verifications?status=PENDING */
    listVerifications: (status?: string) => {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      return request<DoctorVerificationItem[]>("GET", `/admin/verifications${qs}`);
    },

    /** POST /api/v1/admin/doctors/{id}/approve */
    approveDoctor: (id: string, reason?: string) =>
      request<{ status: string }>("POST", `/admin/doctors/${id}/approve`, { reason }),

    /** POST /api/v1/admin/doctors/{id}/reject */
    rejectDoctor: (id: string, reason: string) =>
      request<{ status: string }>("POST", `/admin/doctors/${id}/reject`, { reason }),

    /** POST /api/v1/admin/users/{id}/suspend */
    suspendUser: (id: string, reason: string) =>
      request<{ status: string }>("POST", `/admin/users/${id}/suspend`, { reason }),

    /** GET /api/v1/admin/users */
    listUsers: (params?: { role?: string; q?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>);
      return request<{ items: UserProfile[]; total: number }>("GET", `/admin/users?${qs}`);
    },

    /** GET /api/v1/admin/dispensaries */
    adminListDispensaries: () => request<Dispensary[]>("GET", "/admin/dispensaries"),

    /** GET /api/v1/admin/subscriptions */
    adminSubscriptions: () =>
      request<{ packages: SubscriptionPackage[]; billing: unknown[] }>(
        "GET",
        "/admin/subscriptions"
      ),

    /** PUT /api/v1/admin/subscriptions/packages/{tier} */
    updatePackagePricing: (tier: SubscriptionTier, priceLkr: number) =>
      request<SubscriptionPackage>("PUT", `/admin/subscriptions/packages/${tier}`, { priceLkr }),

    /** GET /api/v1/admin/analytics */
    platformAnalytics: () => request<PlatformAnalytics>("GET", "/admin/analytics"),

    /** GET /api/v1/admin/payments */
    adminPayments: () => request<unknown[]>("GET", "/admin/payments"),

    /** GET /api/v1/admin/reviews?status=VISIBLE */
    adminReviews: (status?: string) => {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      return request<Review[]>("GET", `/admin/reviews${qs}`);
    },

    /** PATCH /api/v1/admin/reviews/{id}/moderation */
    moderateReview: (id: string, moderationStatus: Review["moderationStatus"], reason?: string) =>
      request<Review>("PATCH", `/admin/reviews/${id}/moderation`, { moderationStatus, reason }),

    /** GET /api/v1/admin/audit-log */
    auditLog: () => request<AuditLogEntry[]>("GET", "/admin/audit-log"),

    /** GET /api/v1/storage/signed-url */
    getSignedDownloadUrl: (storagePath: string) =>
      request<{ url: string; expiresAt: string }>("GET", `/storage/signed-url?path=${encodeURIComponent(storagePath)}`),
  };
}

export type OneHealthApi = ReturnType<typeof createApiClient>;

/** Endpoint catalogue for docs / OpenAPI alignment */
export const API_ENDPOINTS = [
  { method: "GET", path: "/api/v1/me", actors: ["PATIENT", "DOCTOR", "STAFF", "ADMIN"] },
  { method: "PATCH", path: "/api/v1/me", actors: ["PATIENT", "DOCTOR", "STAFF", "ADMIN"] },
  { method: "POST", path: "/api/v1/auth/register", actors: ["PUBLIC"] },
  { method: "GET", path: "/api/v1/doctors/search", actors: ["PUBLIC", "PATIENT"] },
  { method: "GET", path: "/api/v1/doctors/{id}", actors: ["PUBLIC", "PATIENT"] },
  { method: "POST", path: "/api/v1/doctors/me/credentials", actors: ["DOCTOR"] },
  { method: "GET", path: "/api/v1/dispensaries", actors: ["DOCTOR", "ADMIN"] },
  { method: "GET", path: "/api/v1/dispensaries/{id}", actors: ["ALL"] },
  { method: "POST", path: "/api/v1/dispensaries", actors: ["DOCTOR"] },
  { method: "PUT", path: "/api/v1/dispensaries/{id}", actors: ["DOCTOR"] },
  { method: "GET", path: "/api/v1/dispensaries/{id}/queue", actors: ["PATIENT", "DOCTOR", "STAFF"] },
  { method: "PATCH", path: "/api/v1/dispensaries/{id}/queue/current", actors: ["DOCTOR", "STAFF"] },
  { method: "POST", path: "/api/v1/bookings", actors: ["PATIENT"] },
  { method: "GET", path: "/api/v1/bookings/me", actors: ["PATIENT"] },
  { method: "POST", path: "/api/v1/bookings/{id}/cancel", actors: ["PATIENT"] },
  { method: "POST", path: "/api/v1/payments/charge", actors: ["PATIENT", "STAFF"] },
  { method: "GET", path: "/api/v1/payments/{id}", actors: ["PATIENT", "DOCTOR", "STAFF", "ADMIN"] },
  { method: "POST", path: "/api/v1/prescriptions", actors: ["DOCTOR"] },
  { method: "GET", path: "/api/v1/prescriptions/me", actors: ["PATIENT", "STAFF"] },
  { method: "PATCH", path: "/api/v1/prescriptions/{id}/dispense", actors: ["STAFF"] },
  { method: "GET", path: "/api/v1/emr/me", actors: ["PATIENT"] },
  { method: "POST", path: "/api/v1/emr", actors: ["DOCTOR"] },
  { method: "POST", path: "/api/v1/emr/{id}/attachments/signed-url", actors: ["PATIENT", "DOCTOR"] },
  { method: "POST", path: "/api/v1/reviews", actors: ["PATIENT"] },
  { method: "POST", path: "/api/v1/reviews/{id}/reply", actors: ["DOCTOR"] },
  { method: "POST", path: "/api/v1/recommendations", actors: ["PATIENT"] },
  { method: "GET", path: "/api/v1/doctors/me/staff", actors: ["DOCTOR"] },
  { method: "POST", path: "/api/v1/doctors/me/staff", actors: ["DOCTOR"] },
  { method: "PATCH", path: "/api/v1/doctors/me/staff/{id}", actors: ["DOCTOR"] },
  { method: "GET", path: "/api/v1/doctors/me/subscription", actors: ["DOCTOR"] },
  { method: "PUT", path: "/api/v1/doctors/me/subscription", actors: ["DOCTOR"] },
  { method: "GET", path: "/api/v1/doctors/me/analytics", actors: ["DOCTOR"] },
  { method: "GET", path: "/api/v1/admin/verifications", actors: ["ADMIN"] },
  { method: "POST", path: "/api/v1/admin/doctors/{id}/approve", actors: ["ADMIN"] },
  { method: "POST", path: "/api/v1/admin/doctors/{id}/reject", actors: ["ADMIN"] },
  { method: "POST", path: "/api/v1/admin/users/{id}/suspend", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/users", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/dispensaries", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/subscriptions", actors: ["ADMIN"] },
  { method: "PUT", path: "/api/v1/admin/subscriptions/packages/{tier}", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/analytics", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/payments", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/reviews", actors: ["ADMIN"] },
  { method: "PATCH", path: "/api/v1/admin/reviews/{id}/moderation", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/admin/audit-log", actors: ["ADMIN"] },
  { method: "GET", path: "/api/v1/storage/signed-url", actors: ["AUTHENTICATED"] },
] as const;
