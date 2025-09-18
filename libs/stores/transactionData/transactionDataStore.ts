import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';

// 타입 정의
interface TransactionDataState {
  transactionData: TransactionData[];
  isLoading: boolean;
  error: string | null;
}

interface TransactionDataActions {
  fetchTransactionData: (params: any) => Promise<void>;
  clearTransactionData: () => void;
  setError: (error: string | null) => void;
}

// 통합 인터페이스
interface TransactionDataStore
  extends TransactionDataState,
    TransactionDataActions {}

// 초기 상태
const initialState: TransactionDataState = {
  transactionData: [],
  isLoading: false,
  error: null,
};

export const useTransactionDataStore = create<TransactionDataStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      ...initialState,

      // 실거래가 데이터 조회
      fetchTransactionData: async (params: any) => {
        set(
          { isLoading: true, error: null },
          false,
          'fetchTransactionData/start'
        );

        try {
          // TODO: 실제 API 호출 구현
          // const response = await transactionApi.fetchTransactionData(params);
          // set({ transactionData: response.data, isLoading: false }, false, 'fetchTransactionData/success');

          // 임시 데이터 (실제 구현 시 제거)
          const mockData: TransactionData[] = [];
          set(
            { transactionData: mockData, isLoading: false },
            false,
            'fetchTransactionData/success'
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : '실거래가 조회에 실패했습니다.';
          set(
            { error: errorMessage, isLoading: false },
            false,
            'fetchTransactionData/error'
          );
        }
      },

      // 실거래가 데이터 초기화
      clearTransactionData: () => {
        set(
          { transactionData: [], error: null },
          false,
          'clearTransactionData'
        );
      },

      // 에러 설정
      setError: (error: string | null) => {
        set({ error }, false, 'setError');
      },
    }),
    { name: 'transaction-data-store' }
  )
);
