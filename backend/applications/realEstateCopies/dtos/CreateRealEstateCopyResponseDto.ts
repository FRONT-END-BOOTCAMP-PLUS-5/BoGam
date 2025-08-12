/**
 * 등기부등본 복사본 생성/수정 응답 DTO
 */
export interface CreateRealEstateCopyResponseDto {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    userAddressId: number;
    updatedAt: Date;
  };
  error?: string;
}
