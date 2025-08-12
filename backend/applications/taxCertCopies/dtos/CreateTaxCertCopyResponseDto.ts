/**
 * 납세확인서 복사본 생성/수정 응답 DTO
 */
export interface CreateTaxCertCopyResponseDto {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    userAddressId: number;
    updatedAt: Date;
  };
  error?: string;
}
