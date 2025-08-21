'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRootStep } from '@libs/stores/rootStepStore';
import SigninForm from '@/(anon)/signin/_components/SigninForm';
import { styles } from '@/(anon)/signin/Signin.styles';
import { ChevronLeft } from 'lucide-react';
import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export default function SignIn() {
  const router = useRouter();
  const setStep = useRootStep((state) => state.setStep);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearUserAddresses = useUserAddressStore((state) => state.clearAll);

  useEffect(() => {
    // 미들웨어 리디렉트로 도착한 경우, 클라이언트 상태도 정리
    clearUser();
    clearUserAddresses();
    try {
      sessionStorage.removeItem('user-store');
      sessionStorage.removeItem('user-address-store');
    } catch {}
  }, [clearUser, clearUserAddresses]);

  const handleBack = () => {
    setStep('auth');
    sessionStorage.setItem('step', 'auth');
    router.push('/');
  };

  return (
    <>
      <section className={styles.intro}>
        <div className={`edge-container ${styles.header}`}>
          <div className={styles.center}>
            <h2 className={styles.title}>로그인</h2>
            <p className={styles.desc}>
              계정에 로그인하여 전세보감의 많은 기능을 이용해보세요!
            </p>
          </div>
          <button onClick={handleBack} aria-label='이전'>
            <ChevronLeft
              className={`${styles.icon} ${styles.arrow}`}
              aria-hidden
            />
          </button>
        </div>
      </section>
      <SigninForm />
    </>
  );
}
