import { create } from 'zustand';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';

interface TransactionDataStore {
  // 상태
  transactionData: TransactionData[];
  isLoading: boolean;
  error: string | null;

  // 액션
  setTransactionData: (data: TransactionData[]) => void;
  clearTransactionData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionDataStore = create<TransactionDataStore>((set) => ({
  // 초기 상태
  transactionData: [],
  isLoading: false,
  error: null,

  // 액션
  setTransactionData: (data) => {
    // 상태 업데이트를 안정적으로 처리
    set((state) => {
      return {
        ...state,
        transactionData: data,
        error: null,
      };
    });
  },

  clearTransactionData: () => {
    set({ transactionData: [] });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
