import { create } from 'zustand';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';

type Domain = 'realEstate' | 'broker' | 'taxCert';

interface RiskAssessmentStore {
  // 도메인별 데이터 분리
  realEstateData: RiskAssessmentJsonData;
  brokerData: RiskAssessmentJsonData;
  taxCertData: RiskAssessmentJsonData;
  
  // 도메인별 데이터 관리 함수들
  addJsonData: (domain: Domain, newData: RiskAssessmentJsonData) => void;
  updateJsonData: (domain: Domain, newData: RiskAssessmentJsonData) => void;
  getJsonData: (domain: Domain) => RiskAssessmentJsonData;
  clearJsonData: (domain: Domain) => void;
  clearAllData: () => void;
}

export const useRiskAssessmentStore = create<RiskAssessmentStore>((set, get) => ({
  // 도메인별 초기 상태
  realEstateData: {},
  brokerData: {},
  taxCertData: {},

  // 도메인별 데이터 추가/병합
  addJsonData: (domain: Domain, newData: RiskAssessmentJsonData) => {
    set((state) => ({
      [`${domain}Data`]: {
        ...state[`${domain}Data`],
        ...newData,
      },
    }));
    console.log(`🔍 Store에 ${domain} JSON 데이터 추가:`, newData);
    console.log(`🔍 Store의 ${domain} 전체 JSON 데이터:`, get()[`${domain}Data`]);
  },

  // 도메인별 데이터 완전 교체
  updateJsonData: (domain: Domain, newData: RiskAssessmentJsonData) => {
    set({ [`${domain}Data`]: newData });
    console.log(`🔍 Store의 ${domain} JSON 데이터 업데이트:`, newData);
  },

  // 도메인별 데이터 반환
  getJsonData: (domain: Domain) => {
    return get()[`${domain}Data`];
  },

  // 도메인별 데이터 초기화
  clearJsonData: (domain: Domain) => {
    set({ [`${domain}Data`]: {} });
    console.log(`🔍 Store의 ${domain} JSON 데이터 초기화`);
  },

  // 모든 도메인 데이터 초기화
  clearAllData: () => {
    set({
      realEstateData: {},
      brokerData: {},
      taxCertData: {},
    });
    console.log('🔍 Store의 모든 JSON 데이터 초기화');
  },
}));
