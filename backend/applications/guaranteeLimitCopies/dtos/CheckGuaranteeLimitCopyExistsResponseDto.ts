export interface CheckGuaranteeLimitCopyExistsResponseDto {
  success: boolean;
  exists: boolean;
  message?: string;
  error?: string;
  updatedAt?: Date;
}
