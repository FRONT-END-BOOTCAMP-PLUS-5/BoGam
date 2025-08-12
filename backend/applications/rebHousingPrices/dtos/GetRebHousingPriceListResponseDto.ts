import { RebHousingPriceEntity } from '@be/domain/entities/RebHousingPrice';

export interface TwoWayResponse {
  continue2Way: boolean;
  method: string;
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: number;
  extraInfo: {
    reqSecureNo?: string;
    reqSecureNoRefresh?: string;
  };
}

export interface GetRebHousingPriceListResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: RebHousingPriceEntity | TwoWayResponse;
}
