import { create } from 'zustand';

export interface ModalInputField {
  id: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  required?: boolean;
  value?: string;
  error?: string;
}

export interface ModalContent {
  title: string;
  content: string | React.ReactNode;
  onConfirm?: (inputValues?: Record<string, string>) => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'info' | 'error' | 'success';
  closeOnError?: boolean; // 에러 시 모달 닫기 여부 (기본값: false)
  inputFields?: ModalInputField[]; // 입력 필드들
}

interface ModalStore {
  isOpen: boolean;
  content: ModalContent | null;
  isLoading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지
  inputValues: Record<string, string>; // 입력 필드 값들
  inputErrors: Record<string, string>; // 입력 필드 에러들
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
  confirmModal: () => Promise<void>;
  cancelModal: () => void;
  setError: (error: string | null) => void; // 에러 설정
  clearError: () => void; // 에러 초기화
  setInputValue: (fieldId: string, value: string) => void; // 입력 값 설정
  setInputError: (fieldId: string, error: string) => void; // 입력 에러 설정
  clearInputErrors: () => void; // 입력 에러 초기화
}

// 서버 사이드 렌더링 보호
const createModalStore = () => {
  // 서버에서 실행되는 경우 빈 Zustand store 반환
  if (typeof window === 'undefined') {
    return create<ModalStore>(() => ({
      isOpen: false,
      content: null,
      isLoading: false,
      error: null,
      inputValues: {},
      inputErrors: {},
      openModal: () => {},
      closeModal: () => {},
      confirmModal: async () => {},
      cancelModal: () => {},
      setError: () => {},
      clearError: () => {},
      setInputValue: () => {},
      setInputError: () => {},
      clearInputErrors: () => {},
    }));
  }

  return create<ModalStore>((set, get) => ({
    isOpen: false,
    content: null,
    isLoading: false,
    error: null,
    inputValues: {},
    inputErrors: {},

    openModal: (content: ModalContent) => {
      // 입력 필드의 초기값 설정
      const initialInputValues: Record<string, string> = {};
      content.inputFields?.forEach((field) => {
        initialInputValues[field.id] = field.value || '';
      });

      set({
        isOpen: true,
        content: {
          confirmText: '확인',
          cancelText: '취소',
          closeOnError: false, // 기본값: 에러 시 모달 열어둠
          ...content,
        },
        isLoading: false,
        error: null, // 모달 열 때 에러 초기화
        inputValues: initialInputValues,
        inputErrors: {},
      });
    },

    closeModal: () => {
      set({
        isOpen: false,
        content: null,
        isLoading: false,
        error: null,
        inputValues: {},
        inputErrors: {},
      });
    },

    confirmModal: async () => {
      const { content, closeModal, setError, inputValues, clearInputErrors } =
        get();

      if (!content?.onConfirm) {
        closeModal();
        return;
      }

      // 필수 필드 검증
      if (content.inputFields) {
        const errors: Record<string, string> = {};
        let hasErrors = false;

        content.inputFields.forEach((field) => {
          if (field.required && !inputValues[field.id]?.trim()) {
            errors[field.id] = `${
              field.label || field.id
            }은(는) 필수 입력 항목입니다.`;
            hasErrors = true;
          }
        });

        if (hasErrors) {
          set({ inputErrors: errors });
          return;
        }
      }

      // 로딩 상태 시작
      set({ isLoading: true, error: null });
      clearInputErrors();

      try {
        await content.onConfirm(inputValues);
        // 성공 시에만 모달 닫기
        closeModal();
      } catch (error) {
        console.error('Modal confirm error:', error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);

        // closeOnError가 true인 경우에만 모달 닫기
        if (content.closeOnError) {
          closeModal();
        } else {
          // 에러 시 로딩 상태만 해제하고 모달은 열어둠
          set({ isLoading: false });
        }
      }
    },

    cancelModal: () => {
      const { content, closeModal } = get();
      if (content?.onCancel) {
        content.onCancel();
      }
      closeModal();
    },

    setError: (error: string | null) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    setInputValue: (fieldId: string, value: string) => {
      set((state) => ({
        inputValues: {
          ...state.inputValues,
          [fieldId]: value,
        },
      }));
    },

    setInputError: (fieldId: string, error: string) => {
      set((state) => ({
        inputErrors: {
          ...state.inputErrors,
          [fieldId]: error,
        },
      }));
    },

    clearInputErrors: () => {
      set({ inputErrors: {} });
    },
  }));
};

export const useModalStore = createModalStore();
