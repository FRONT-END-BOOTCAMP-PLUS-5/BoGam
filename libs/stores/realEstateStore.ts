import { create } from 'zustand';
import { AddressListItem, ApiResponse, RealEstateFormData } from '@/(anon)/_components/common/realEstate/types';

interface RealEstateState {
  // 기본 상태
  activeTab: 'input' | 'output';
  formData: RealEstateFormData;
  response: ApiResponse | null;
  twoWaySelectedAddress: AddressListItem | null;
  showTwoWayModal: boolean;
  isDataLoading: boolean;
  
  // Actions
  setActiveTab: (tab: 'input' | 'output') => void;
  setFormData: (data: RealEstateFormData) => void;
  setResponse: (response: ApiResponse | null) => void;
  setTwoWaySelectedAddress: (address: AddressListItem | null) => void;
  setShowTwoWayModal: (show: boolean) => void;
  setIsDataLoading: (loading: boolean) => void;
  
  // 핸들러 함수들
  handleAddressSelect: ((address: AddressListItem) => void) | null;
  handleCloseTwoWayModal: (() => void) | null;
  setHandleAddressSelect: (handler: ((address: AddressListItem) => void) | null) => void;
  setHandleCloseTwoWayModal: (handler: (() => void) | null) => void;
  
  // 초기화
  reset: () => void;
}

const initialFormData: RealEstateFormData = {
  userAddressNickname: '',
  password: '1234',
  address: '',
  realtyType: '1',
  recordStatus: '0',
  startPageNo: '1',
  pageCount: '5',
  applicationType: '1',
  organization: '0002',
  phoneNo: '',
  inquiryType: '1',
  issueType: '1',
  jointMortgageJeonseYN: '0',
  tradingYN: '0',
  electronicClosedYN: '0',
  originDataYN: '1',
  warningSkipYN: '0',
  registerSummaryYN: '0',
  selectAddress: '0',
  isIdentityViewYn: '0',
  uniqueNo: '',
  addr_sido: '',
  addr_dong: '',
  addr_lotNumber: '',
  inputSelect: '',
  buildingName: '',
  dong: '101',
  ho: '101',
  addr_sigungu: '',
  addr_roadName: '',
  addr_buildingNumber: '',
  listNumber: '',
  ePrepayNo: '',
  ePrepayPass: '',
  originData: '',
  reqIdentity: '',
  identityList: [{ reqIdentity: '' }],
};

export const useRealEstateStore = create<RealEstateState>((set) => ({
  // 초기 상태
  activeTab: 'input',
  formData: initialFormData,
  response: null,
  twoWaySelectedAddress: null,
  showTwoWayModal: false,
  isDataLoading: false,
  handleAddressSelect: null,
  handleCloseTwoWayModal: null,
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFormData: (data) => set({ formData: data }),
  setResponse: (response) => set({ response }),
  setTwoWaySelectedAddress: (address) => set({ twoWaySelectedAddress: address }),
  setShowTwoWayModal: (show) => set({ showTwoWayModal: show }),
  setIsDataLoading: (loading) => set({ isDataLoading: loading }),
  setHandleAddressSelect: (handler) => set({ handleAddressSelect: handler }),
  setHandleCloseTwoWayModal: (handler) => set({ handleCloseTwoWayModal: handler }),
  
  // 초기화
  reset: () => set({
    activeTab: 'input',
    formData: initialFormData,
    response: null,
    twoWaySelectedAddress: null,
    showTwoWayModal: false,
    isDataLoading: false,
    handleAddressSelect: null,
    handleCloseTwoWayModal: null,
  }),
}));
