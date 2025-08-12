/**
 * 납세확인서 복사본 존재 확인 응답 DTO
 */
export interface CheckTaxCertCopyExistsResponseDto {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  message?: string;
  error?: string;
}
