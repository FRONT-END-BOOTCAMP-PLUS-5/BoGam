/**
 * GuaranteeLimitCopy Entity
 * 클린 아키텍처의 Domain 레이어
 */

export interface GuaranteeLimitCopyJson {
  // 보증한도 관련 데이터 구조
  [key: string]: unknown;
}

export class GuaranteeLimitCopyEntity {
  constructor(
    public id: number,
    public userAddressId: number,
    public guaranteeLimitData: string,
    public updatedAt: Date
  ) {}
}
