import { SiseEntity } from '@be/domain/entities/SiseEntity';

export interface TwoWayExtraInfo {
  reqSecureNo?: string;
  reqSecureNoRefresh?: string;
  reqDongNumList?: {
    reqDong: string;
    commDongNum: string;
  };
  reqHoNumList?: {
    reqHo: string;
    commHoNum: string;
  };
}

export interface TwoWayResponse {
  continue2Way: boolean;
  method: string;
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: number;
  extraInfo: TwoWayExtraInfo;
}

export interface GetSiseInfoResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: SiseEntity | TwoWayResponse;
}
