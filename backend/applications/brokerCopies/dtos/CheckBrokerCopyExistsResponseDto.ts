export interface CheckBrokerCopyExistsResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    exists: boolean;
    updatedAt?: Date;
  };
}
