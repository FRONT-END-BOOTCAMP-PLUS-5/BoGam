import { GuaranteeLimitCopyJson } from '@be/domain/entities/GuaranteeLimitCopy';

export interface CreateGuaranteeLimitCopyRequestDto {
  userAddressId: number;
  guaranteeLimitJson: GuaranteeLimitCopyJson;
}
