import { GuaranteeLimitCopyJson } from './GuaranteeLimitCopyJson';

export interface CreateGuaranteeLimitCopyRequestDto {
  userAddressId: number;
  guaranteeLimitJson: GuaranteeLimitCopyJson;
}
