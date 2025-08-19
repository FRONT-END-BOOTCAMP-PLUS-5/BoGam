import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
  nickname?: string;
  setNickname: (nickname?: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        nickname: undefined,
        setNickname: (nickname) => set({ nickname }, false, 'setNickname'),
        clearUser: () => set({ nickname: undefined }, false, 'clearUser'),
      }),
      {
        name: 'user-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
