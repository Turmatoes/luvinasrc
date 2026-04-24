/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * certification.api.ts, April 24, 2026 nxplong
 */
import { apiClient } from './client';
import { CertificationDTO } from '@/types/employee';

/**
 * Lớp API Service xử lý các yêu cầu liên quan đến Chứng chỉ.
 */
export const certificationApi = {
  /**
   * Lấy danh sách chứng chỉ.
   * 
   * @returns Promise chứa mảng CertificationDTO
   */
  getCertifications: async (): Promise<CertificationDTO[]> => {
    const response = await apiClient.get<CertificationDTO[]>('/certifications');
    return response.data;
  },
};
