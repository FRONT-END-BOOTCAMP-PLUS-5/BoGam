export interface GetBrokerCopyResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: number;
    userAddressId: number;
    brokerData: string;
    updatedAt: Date;
  };
}
