import { create } from 'zustand';

type Step = 'splash' | 'onboarding' | 'auth';

interface RootStepStore {
  step: Step;
  setStep: (step: Step) => void;
  initialized: boolean;
  initStepFromSession: () => void;
}

export const useRootStep = create<RootStepStore>((set) => ({
  step: 'splash',
  initialized: false,
  setStep: (step) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('step', step);
    }
    set({ step, initialized: true });
  },
  initStepFromSession: () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('step') as Step | null;
      set({
        step: saved ?? 'splash',
        initialized: true,
      });
    }
  },
}));
