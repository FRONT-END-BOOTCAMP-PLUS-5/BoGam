'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRootStep } from '@libs/stores/rootStepStore';

import Splash from '@/(anon)/_components/onboarding/Splash';
import Onboarding from '@/(anon)/_components/onboarding/Onboarding';
import AuthLanding from '@/(anon)/_components/onboarding/AuthLanding';

export default function RootFlow() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { step, setStep, initStepFromSession, initialized } = useRootStep();

  // 1. 초기화
  useEffect(() => {
    const savedStep = sessionStorage.getItem('step');
    if (savedStep === 'auth') {
      // auth 단계일 때는 먼저 정리 후 step 설정
      setStep('auth');
      // Clear all sessionStorage items except 'step'
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key !== 'step') {
          sessionStorage.removeItem(key);
        }
      }
    } else {
      // auth가 아닐 때만 기존 초기화 로직 실행
      initStepFromSession();
    }
  }, [initStepFromSession, setStep]);

  // 2. 인증된 사용자는 메인으로 이동
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/main');
    }
  }, [status, router]);

  // 3. 인증되지 않은 사용자는 계속 온보딩
  useEffect(() => {
    if (status === 'unauthenticated') {
      // onboarding 로직 진행
      if (!initialized) return;
      if (step === 'splash') return;
      if (step !== 'auth') {
        setStep('onboarding');
      }
    }
  }, [status, initialized, step, setStep]);

  if (!initialized || status === 'loading') return null;

  return (
    <>
      {step === 'splash' && <Splash onComplete={() => setStep('onboarding')} />}
      {step === 'onboarding' && (
        <Onboarding
          onSkipToAuth={() => setStep('auth')}
          onDoneToAuth={() => setStep('auth')}
        />
      )}
      {step === 'auth' && <AuthLanding />}
    </>
  );
}
