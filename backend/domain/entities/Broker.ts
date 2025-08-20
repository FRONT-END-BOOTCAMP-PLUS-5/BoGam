// API 응답 타입 정의
export class BrokerApiResponse {
  constructor(
    public readonly EDBrokers: {
      field: Broker[];
    }
  ) {}
}

export class Broker {
  constructor(
    public readonly idCode: number,
    public readonly idCodeNm: string,
    public readonly jurirno: string,
    public readonly bsnmCmpnm: string,
    public readonly brkrNm: string,
    public readonly brkrAsortCode: number,
    public readonly brkrAsortCodeNm: string,
    public readonly crqfcNo: string,
    public readonly crqfcAcqdt: Date,
    public readonly ofcpsSeCode: string,
    public readonly ofcpsSeCodeNm: string,
    public readonly lastUpdtDt: Date
  ) {}
}
