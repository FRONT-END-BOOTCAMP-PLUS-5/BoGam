/**
 * 등기부등본 복사본 존재 확인 응답 DTO
 */
export interface CheckRealEstateCopyExistsResponseDto {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  message?: string;
  error?: string;
}
