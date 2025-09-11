import { create } from 'zustand';
import { toast, ToastOptions } from 'react-toastify';

// Toast Store 인터페이스
export interface ToastStore {
  showToast: (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    options?: ToastOptions
  ) => void;
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
}

// Toast Store 생성
const createToastStore = () => {
  // 서버에서 실행되는 경우 빈 Zustand store 반환
  if (typeof window === 'undefined') {
    return create<ToastStore>(() => ({
      showToast: () => {},
      showSuccess: () => {},
      showError: () => {},
      showWarning: () => {},
      showInfo: () => {},
    }));
  }

  return create<ToastStore>((set, get) => ({
    showToast: (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info',
      options?: ToastOptions
    ) => {
      const defaultOptions: ToastOptions = {
        position: 'top-right',
        autoClose: type === 'error' ? 5000 : 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        style: {
          width: 'auto',
          minWidth: '300px',
          maxWidth: '90vw',
        },
        ...options,
      };

      switch (type) {
        case 'success':
          toast.success(message, defaultOptions);
          break;
        case 'error':
          toast.error(message, defaultOptions);
          break;
        case 'warning':
          toast.warning(message, defaultOptions);
          break;
        case 'info':
        default:
          toast.info(message, defaultOptions);
          break;
      }
    },

    showSuccess: (message: string, options?: ToastOptions) => {
      get().showToast(message, 'success', options);
    },

    showError: (message: string, options?: ToastOptions) => {
      get().showToast(message, 'error', options);
    },

    showWarning: (message: string, options?: ToastOptions) => {
      get().showToast(message, 'warning', options);
    },

    showInfo: (message: string, options?: ToastOptions) => {
      get().showToast(message, 'info', options);
    },
  }));
};

export const useToastStore = createToastStore();
