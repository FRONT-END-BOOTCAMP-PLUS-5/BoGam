'use client';

import { useState, useCallback } from 'react';
import Splash from '@/(anon)/_components/onboarding/Splash';
import Onboarding from '@/(anon)/_components/onboarding/Onboarding';
import AuthLanding from '@/(anon)/_components/onboarding/AuthLanding';

export default function RootPage() {
  // splash → onboarding → auth
  const [step, setStep] = useState<'splash' | 'onboarding' | 'auth'>('splash');

  const handleSplashDone = useCallback(() => setStep('onboarding'), []);
  const goAuth = useCallback(() => setStep('auth'), []);

  return (
    <>
      {step === 'splash' && <Splash onComplete={handleSplashDone} />}
      {step === 'onboarding' && (
        <Onboarding onSkipToAuth={goAuth} onDoneToAuth={goAuth} />
      )}
      {step === 'auth' && <AuthLanding />}
    </>
  );
}
