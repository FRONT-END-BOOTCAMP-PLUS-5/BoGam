export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
  // 공식 API 문서에 따른 2-way 인증 응답 구조
  continue2Way?: boolean;
  method?: string;
  jobIndex?: number;
  threadIndex?: number;
  jti?: string;
  twoWayTimestamp?: number;
  extraInfo?: {
    resAddrList?: AddressListItem[];
  };
  // 기존 구조와의 호환성을 위한 필드들
  requiresTwoWayAuth?: boolean;
  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    method?: string;
    extraInfo?: {
      resAddrList?: AddressListItem[];
    };
  };
  resAddrList?: AddressListItem[];
  savedRealEstateCopy?: {
    id: number;
    userAddressId: number;
    isUpdated: boolean;
  };
  warning?: string;
  resultCode?: string;
}

export interface AddressListItem {
  resUserNm?: string; // 소유자
  commUniqueNo: string; // 부동산 고유번호
  commAddrLotNumber: string; // 부동산 소재지번 (상세 주소)
  resState: string; // 상태
  resType?: string; // 구분
}

export interface RealEstateFormData {
  userAddressId: number;
  password: string;
  address: string;
  realtyType: string;
  recordStatus: string;
  startPageNo: string;
  pageCount: string;
  applicationType: string;
  organization: string;
  phoneNo: string;
  inquiryType: string;
  issueType: string;
  jointMortgageJeonseYN: string;
  tradingYN: string;
  electronicClosedYN: string;
  originDataYN: string;
  warningSkipYN: string;
  registerSummaryYN: string;
  selectAddress: string;
  isIdentityViewYn: string;
  // 누락된 필드들
  uniqueNo: string;
  addr_sido: string;
  addr_dong: string;
  addr_lotNumber: string;
  inputSelect: string;
  buildingName: string;
  dong: string;
  ho: string;
  addr_sigungu: string;
  addr_roadName: string;
  addr_buildingNumber: string;
  listNumber: string;
  ePrepayNo: string;
  ePrepayPass: string;
  originData: string;
  reqIdentity: string;
  identityList: Array<{ reqIdentity: string }>;
}

export interface RealEstateContainerProps {
  // 필요한 경우 외부에서 전달받을 props
}

export interface RealEstateInputProps {
  formData: RealEstateFormData;
  onSubmit: (data: RealEstateFormData) => void;
  onReset: () => void;
  loading: boolean;
}

export interface RealEstateOutputProps {
  response: ApiResponse | null;
  loading: boolean;
}
