export interface CheckBrokerCopyExistsResponseDto {
  success: boolean;
  exists: boolean;
  message?: string;
  error?: string;
  updatedAt?: Date;
}
