import { create } from 'zustand';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';

interface RiskAssessmentStore {
  jsonData: RiskAssessmentJsonData;
  addJsonData: (newData: RiskAssessmentJsonData) => void;
  updateJsonData: (newData: RiskAssessmentJsonData) => void;
  getJsonData: () => RiskAssessmentJsonData;
  clearJsonData: () => void;
}

export const useRiskAssessmentStore = create<RiskAssessmentStore>((set, get) => ({
  jsonData: {},

  // 새로운 데이터를 기존 데이터에 병합
  addJsonData: (newData: RiskAssessmentJsonData) => {
    set((state) => ({
      jsonData: {
        ...state.jsonData,
        ...newData,
      },
    }));
    console.log('🔍 Store에 JSON 데이터 추가:', newData);
    console.log('🔍 Store의 전체 JSON 데이터:', get().jsonData);
  },

  // 데이터를 완전히 교체
  updateJsonData: (newData: RiskAssessmentJsonData) => {
    set({ jsonData: newData });
    console.log('🔍 Store의 JSON 데이터 업데이트:', newData);
  },

  // 현재 저장된 데이터 반환
  getJsonData: () => {
    return get().jsonData;
  },

  // 데이터 초기화
  clearJsonData: () => {
    set({ jsonData: {} });
    console.log('🔍 Store의 JSON 데이터 초기화');
  },
}));
