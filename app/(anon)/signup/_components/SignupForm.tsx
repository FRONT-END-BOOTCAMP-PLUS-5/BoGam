'use client';

import { SignupFields } from './SignupFields';
import { SignupModal } from './SignupModal';
import { useSignupForm } from './useSignupForm';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';
import Button from '@/(anon)/_components/common/button/Button';

export default function SignupForm() {
  const {
    form,
    onSubmit,
    isSubmitting,
    isModalOpen,
    isErrorModalOpen,
    signupError,
    closeSuccessModal,
    closeErrorModal,
    goToSignin,
  } = useSignupForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formRow}>
      <SignupFields form={form} />

      <Button type='submit' fullWidth variant='primary' disabled={isSubmitting}>
        {isSubmitting ? '가입 중...' : '회원가입'}
      </Button>

      <Button href='/signin' variant='ghost' fullWidth>
        로그인
      </Button>

      <SignupModal
        isModalOpen={isModalOpen}
        isErrorModalOpen={isErrorModalOpen}
        errorMessage={signupError}
        onConfirm={goToSignin}
        onCancelSuccess={closeSuccessModal}
        onCancelError={closeErrorModal}
      />
    </form>
  );
}
