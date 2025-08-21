export interface CreateBrokerCopyResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: number;
    userAddressId: number;
    updatedAt: Date;
  };
}
