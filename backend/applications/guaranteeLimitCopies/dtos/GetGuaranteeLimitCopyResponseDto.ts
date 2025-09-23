import { GuaranteeLimitCopyJson } from './GuaranteeLimitCopyJson';

export interface GetGuaranteeLimitCopyResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: number;
    userAddressId: number;
    guaranteeLimitJson: GuaranteeLimitCopyJson;
    updatedAt: Date;
  };
}
