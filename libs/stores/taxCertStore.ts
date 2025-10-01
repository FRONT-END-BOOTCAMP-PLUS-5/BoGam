import { create } from 'zustand';
import { TaxCertFormData } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/types';

// Ref를 store 외부에서 관리하여 무한 루프 방지
let taxCertContainerRef: { handleSimpleAuthApprove: () => void } | null = null;

export const setTaxCertContainerRef = (
  ref: { handleSimpleAuthApprove: () => void } | null
) => {
  taxCertContainerRef = ref;
};

interface TaxCertState {
  // 기본 상태
  activeTab: 'input' | 'output';
  formData: TaxCertFormData;
  // response 제거 - DB에서 조회하도록 변경
  isDataLoading: boolean;

  // 간편인증 모달 상태
  showSimpleAuthModal: boolean;

  // Actions
  setActiveTab: (tab: 'input' | 'output') => void;
  setFormData: (data: TaxCertFormData) => void;
  setIsDataLoading: (loading: boolean) => void;
  setShowSimpleAuthModal: (show: boolean) => void;

  // 간편인증 핸들러
  handleShowSimpleAuthModal: () => void;
  handleSimpleAuthApprove: () => void;
  handleSimpleAuthCancel: () => void;

  // 초기화
  reset: () => void;
}

const initialFormData: TaxCertFormData = {
  organization: '0001',
  loginType: '6',
  loginTypeLevel: '1',
  phoneNo: '',
  userName: '',
  loginIdentity: '',
  loginBirthDate: '',
  id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  isIdentityViewYN: '1',
  isAddrViewYn: '0',
  proofType: 'B0006',
  submitTargets: '04',
  applicationType: '01',
  clientTypeLevel: '1',
  identity: '',
  birthDate: '',
  originDataYN: '0',
  originDataYN1: '1',
};

export const useTaxCertStore = create<TaxCertState>((set) => ({
  // 초기 상태
  activeTab: 'input',
  formData: initialFormData,
  isDataLoading: false,
  showSimpleAuthModal: false,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFormData: (data) => set({ formData: data }),
  setIsDataLoading: (loading) => set({ isDataLoading: loading }),
  setShowSimpleAuthModal: (show) => set({ showSimpleAuthModal: show }),

  // 간편인증 핸들러
  handleShowSimpleAuthModal: () => {
    set({ showSimpleAuthModal: true });
  },

  handleSimpleAuthApprove: () => {
    if (taxCertContainerRef) {
      taxCertContainerRef.handleSimpleAuthApprove();
    }
    set({ showSimpleAuthModal: false });
  },

  handleSimpleAuthCancel: () => {
    set({ showSimpleAuthModal: false });
  },

  // 초기화
  reset: () =>
    set({
      activeTab: 'input',
      formData: initialFormData,
      isDataLoading: false,
      showSimpleAuthModal: false,
    }),
}));
