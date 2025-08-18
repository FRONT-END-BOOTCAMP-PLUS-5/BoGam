'use client';

import { useEffect } from 'react';
import { useRootStep } from '@libs/store/rootStepStore';
import Splash from '@/(anon)/_components/onboarding/Splash';
import Onboarding from '@/(anon)/_components/onboarding/Onboarding';
import AuthLanding from '@/(anon)/_components/onboarding/AuthLanding';

export default function RootFlow() {
  const { step, setStep, initStepFromSession, initialized } = useRootStep();

  useEffect(() => {
    initStepFromSession();
  }, []);

  if (!initialized) return null;

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
