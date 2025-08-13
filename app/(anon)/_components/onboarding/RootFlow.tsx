'use client';

import { useState, useCallback } from 'react';
import Splash from '@/(anon)/_components/onboarding/Splash';
import Onboarding from '@/(anon)/_components/onboarding/Onboarding';
import AuthLanding from '@/(anon)/_components/onboarding/AuthLanding';

type Step = 'splash' | 'onboarding' | 'auth';

export default function RootFlow({
  initialStep = 'splash',
}: {
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);

  const goOnboarding = useCallback(() => setStep('onboarding'), []);
  const goAuth = useCallback(() => setStep('auth'), []);

  return (
    <>
      {step === 'splash' && <Splash onComplete={goOnboarding} />}
      {step === 'onboarding' && (
        <Onboarding onSkipToAuth={goAuth} onDoneToAuth={goAuth} />
      )}
      {step === 'auth' && <AuthLanding />}
    </>
  );
}
