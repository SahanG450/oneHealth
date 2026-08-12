/** Shared domain types mirroring Spring Boot DTOs under /api/v1 */

export type Role = "PATIENT" | "DOCTOR" | "STAFF" | "ADMIN";
export type SubscriptionTier = "FREE" | "STANDARD" | "PREMIUM";
export type QueueStatus = "WAITING" | "CALLED" | "IN_PROGRESS" | "DONE" | "NO_SHOW" | "CANCELLED";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type StaffPermission = "RECEPTION" | "PHARMACIST" | "BOTH";
export type ModerationStatus = "VISIBLE" | "HIDDEN" | "REMOVED";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  subscriptionTier?: SubscriptionTier;
  verificationStatus?: VerificationStatus;
  createdAt: string;
}

export interface DoctorSummary {
  id: string;
  fullName: string;
  specialization: string;
  city: string;
  town?: string;
  averageRating: number;
  reviewCount: number;
  subscriptionTier: SubscriptionTier;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
}

export interface DoctorProfile extends DoctorSummary {
  bio?: string;
  slmcNumber?: string;
  languages?: string[];
  services?: string[];
  dispensaries: Dispensary[];
  reviews: Review[];
}

export interface Dispensary {
  id: string;
  doctorId: string;
  name: string;
  address?: string;
  city: string;
  town?: string;
  latitude?: number;
  longitude?: number;
  workingHours?: WorkingHours[];
  maxDailyCapacity?: number;
  currentQueueNumber?: number;
}

export interface WorkingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface QueueEntry {
  id: string;
  dispensaryId: string;
  patientId: string;
  doctorId?: string;
  queueDate: string;
  tokenNumber: number;
  status: QueueStatus;
  position?: number;
  patientName?: string;
  createdAt: string;
}

export interface QueueSession {
  dispensaryId: string;
  sessionId: string;
  queueDate: string;
  currentNumber: number;
  totalWaiting: number;
  entries: QueueEntry[];
}

export interface BookingRequest {
  dispensaryId: string;
  queueDate: string;
  idempotencyKey?: string;
}

export interface Booking {
  id: string;
  queueEntry: QueueEntry;
  paymentRequired: boolean;
  paymentStatus?: PaymentStatus;
}

export interface PaymentInitRequest {
  bookingId: string;
  provider?: "PAYHERE" | "STRIPE";
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentInitResponse {
  paymentId: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  providerPayload?: Record<string, unknown>;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  visitId?: string;
  medicines: PrescriptionItem[];
  notes?: string;
  dispensed: boolean;
  createdAt: string;
}

export interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  notes?: string;
  visitDate: string;
  attachments?: DocumentFile[];
}

export interface DocumentFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  signedUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName?: string;
  rating: number;
  comment?: string;
  symptoms?: string;
  moderationStatus: ModerationStatus;
  doctorReply?: string;
  createdAt: string;
}

export interface RecommendationRequest {
  symptoms: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
}

export interface RecommendationResult {
  doctors: Array<DoctorSummary & { matchScore: number; reason: string }>;
  disclaimer: string;
}

export interface StaffMember {
  id: string;
  doctorId: string;
  dispensaryId: string;
  fullName: string;
  email: string;
  permission: StaffPermission;
  active: boolean;
}

export interface SubscriptionPackage {
  tier: SubscriptionTier;
  priceLkr: number;
  features: string[];
}

export interface PlatformAnalytics {
  activeDoctors: number;
  activePatients: number;
  bookingsToday: number;
  revenueMonthLkr: number;
  pendingVerifications: number;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  createdAt: string;
}

export interface DoctorVerificationItem {
  doctorId: string;
  fullName: string;
  email: string;
  slmcNumber: string;
  certificateUrl?: string;
  licenceUrl?: string;
  status: VerificationStatus;
  submittedAt: string;
}
