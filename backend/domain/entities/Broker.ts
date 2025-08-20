// API 응답 타입 정의
export class BrokerApiResponse {
  constructor(
    public readonly EDBrokers: {
      field: Broker[];
      pageNo: string;
      resultCode: string;
      totalCount: string;
      numOfRows: string;
      resultMsg: string;
    }
  ) {}
}

export class Broker {
  constructor(
    public readonly brkrAsortCode: string,
    public readonly brkrAsortCodeNm: string,
    public readonly jurirno: string,
    public readonly crqfcAcqdt: string,
    public readonly ofcpsSeCodeNm: string,
    public readonly brkrNm: string,
    public readonly lastUpdtDt: string,
    public readonly ldCode: string,
    public readonly ldCodeNm: string,
    public readonly crqfcNo: string,
    public readonly ofcpsSeCode: string,
    public readonly bsnmCmpnm: string
  ) {}
}
