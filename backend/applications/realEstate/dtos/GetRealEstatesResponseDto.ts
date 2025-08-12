// 부동산등기부등본 조회 응답 DTO

import { RealEstateEntity } from '@be/domain/entities/RealEstateEntity';

// 2-way 인증 응답 데이터
export interface TwoWayResponse {
  continue2Way: boolean;
  method: string;
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: number;
  extraInfo?: {
    resAddrList?: Array<{
      resUserNm?: string;
      commUniqueNo: string;
      commAddrLotNumber: string;
      resState: string;
      resType?: string;
    }>;
  };
}

export interface GetRealEstatesResponseDto {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data: RealEstateEntity | TwoWayResponse;
}
