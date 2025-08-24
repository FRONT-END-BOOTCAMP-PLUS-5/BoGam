export class TaxCertEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly resIssueNo: string,
    public readonly resUserNm: string,
    public readonly resUserAddr: string,
    public readonly resUserIdentiyNo: string,
    public readonly resCompanyNm: string,
    public readonly resCompanyIdentityNo: string,
    public readonly resPaymentTaxStatusCd: string,
    public readonly resPaymentTaxStatus: string,
    public readonly resUsePurpose: string,
    public readonly resOriGinalData: string,
    public readonly resOriGinalData1: string,
    public readonly resValidPeriod: string,
    public readonly resReason: string,
    public readonly resReceiptNo: string,
    public readonly resDepartmentName: string,
    public readonly resUserNm1: string,
    public readonly resPhoneNo: string,
    public readonly resIssueOgzNm: string,
    public readonly resIssueDate: string,
    public readonly resRespiteList: TaxCertRespiteItem[],
    public readonly resArrearsList: TaxCertArrearsItem[],
    public readonly updatedAt?: Date
  ) {}
}

export class TaxCertRespiteItem {
  constructor(
    public readonly resRespiteType: string,
    public readonly resRespitePeriod: string,
    public readonly resTaxYear: string,
    public readonly resTaxItemName: string,
    public readonly resPaymentDeadline: string,
    public readonly resLocalTaxAmt: string,
    public readonly resAdditionalCharges: string
  ) {}
}

export class TaxCertArrearsItem {
  constructor(
    public readonly resUserNm: string,
    public readonly resTaxYear: string,
    public readonly resTaxItemName: string,
    public readonly resPaymentDeadline: string,
    public readonly resLocalTaxAmt: string,
    public readonly resAdditionalCharges: string
  ) {}
}
