import { create } from 'zustand';

interface TooltipStore {
  activeTooltipTerm: string | null; // 현재 활성화된 툴팁의 term
  setActiveTooltip: (term: string | null) => void; // 활성 툴팁 설정
  closeAllTooltips: () => void; // 모든 툴팁 닫기
  isTooltipActive: (term: string) => boolean; // 특정 term의 툴팁이 활성화되어 있는지 확인
}

// 서버 사이드 렌더링 보호
const createTooltipStore = () => {
  // 서버에서 실행되는 경우 빈 Zustand store 반환
  if (typeof window === 'undefined') {
    return create<TooltipStore>(() => ({
      activeTooltipTerm: null,
      setActiveTooltip: () => {},
      closeAllTooltips: () => {},
      isTooltipActive: () => false,
    }));
  }

  return create<TooltipStore>((set, get) => ({
    activeTooltipTerm: null,

    setActiveTooltip: (term: string | null) => {
      set({ activeTooltipTerm: term });
    },

    closeAllTooltips: () => {
      set({ activeTooltipTerm: null });
    },

    isTooltipActive: (term: string) => {
      const { activeTooltipTerm } = get();
      return activeTooltipTerm === term;
    },
  }));
};

export const useTooltipStore = createTooltipStore();
