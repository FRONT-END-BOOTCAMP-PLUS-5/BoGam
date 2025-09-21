import { GuaranteeLimitCopyJson } from '@be/domain/entities/GuaranteeLimitCopy';

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
