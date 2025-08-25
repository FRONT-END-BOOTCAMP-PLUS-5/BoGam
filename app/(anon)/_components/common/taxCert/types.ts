export interface TaxCertData {
  resIssueNo?: string;
  resUserNm?: string;
  resUserAddr?: string;
  resUserIdentiyNo?: string;
  resPaymentTaxStatus?: string;
  resValidPeriod?: string;
  resRespiteList?: Array<{
    resRespiteType?: string;
    resRespitePeriod?: string;
    resTaxYear?: string;
    resTaxItemName?: string;
    resPaymentDeadline?: string;
    resLocalTaxAmt?: string;
    resAdditionalCharges?: string;
  }>;
  resOriGinalData1?: string;
}

export interface TaxCertApiResponse {
  success: boolean;
  message: string;
  data?: {
    taxCertJson?: TaxCertData;
    [key: string]: unknown;
  };
  error?: string;
  userAddressNickname: string;
  requiresSimpleAuth?: boolean;
}

export interface TaxCertFormData {
  organization: string;
  loginType: string;
  loginTypeLevel: string;
  phoneNo: string;
  userName: string;
  loginIdentity: string;
  loginBirthDate: string;
  id: string;
  isIdentityViewYN: string;
  isAddrViewYn: string;
  proofType: string;
  submitTargets: string;
  applicationType: string;
  clientTypeLevel: string;
  identity: string;
  birthDate: string;
  originDataYN: string;
  originDataYN1: string;
  userAddressNickname?: string;
}

export interface TaxCertInputProps {
  formData: TaxCertFormData;
  onSubmit: (data: TaxCertFormData) => void;
  loading: boolean;
  onSuccess?: () => void;
}

export interface TaxCertOutputProps {
  response: TaxCertApiResponse | null;
  loading: boolean;
  existsData?: unknown;
}
