'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRootStep } from '@libs/stores/rootStepStore';
import SignupForm from '@/(anon)/signup/_components/SignupForm';
import { styles } from '@/(anon)/signup/Signup.styles';
import { ChevronLeft } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const setStep = useRootStep((state) => state.setStep);

  // 페이지 타이틀 설정
  useEffect(() => {
    document.title = 'Bogam';
  }, []);

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
            <h2 className={styles.title}>회원가입</h2>
            <p className={styles.desc}>
              아래의 정보를 기입하여 회원가입을 완료해주세요!
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
      <SignupForm />
    </>
  );
}
