import { BrokerCopyJson } from './BrokerCopyJson';

export interface GetBrokerCopyResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: number;
    userAddressId: number;
    brokerData: BrokerCopyJson;
    updatedAt: Date;
  };
}
