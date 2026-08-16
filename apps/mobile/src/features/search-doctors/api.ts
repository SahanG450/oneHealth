import type { DoctorSummary } from "@onehealth/types";
import { api } from "../../lib/api";

export interface SearchDoctorsParams {
  q?: string;
  city?: string;
  town?: string;
  specialization?: string;
  page?: number;
  size?: number;
}

export interface SearchDoctorsResult {
  items: DoctorSummary[];
  total: number;
}

export function searchDoctors(
  params: SearchDoctorsParams = {}
): Promise<SearchDoctorsResult> {
  return api.searchDoctors(params);
}
