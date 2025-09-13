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
    triggerNicknameCheck,
    setTriggerNicknameCheck,
    triggerUsernameCheck,
    setTriggerUsernameCheck,
  } = useSignupForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formRow}>
      <SignupFields
        form={form}
        triggerNicknameCheck={triggerNicknameCheck} // 닉네임 중복 확인 상태 전달
        setTriggerNicknameCheck={setTriggerNicknameCheck} // 닉네임 상태 변경 함수 전달
        triggerUsernameCheck={triggerUsernameCheck} // 아이디 중복 확인 상태 전달
        setTriggerUsernameCheck={setTriggerUsernameCheck} // 아이디 상태 변경 함수 전달
      />

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
