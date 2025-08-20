export interface GetBrokerCopyResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: number;
    userAddressId: number;
    brokerData: Record<string, unknown>;
    updatedAt: Date;
  };
}
