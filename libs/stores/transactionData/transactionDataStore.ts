import { create } from 'zustand';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';

interface TransactionDataState {
  transactionData: TransactionData[];
  isLoading: boolean;
  error: string | null;
  setTransactionData: (data: TransactionData[]) => void;
  clearTransactionData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionDataStore = create<TransactionDataState>((set) => ({
  transactionData: [],
  isLoading: false,
  error: null,
  setTransactionData: (data) => set({ transactionData: data }),
  clearTransactionData: () => set({ transactionData: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
