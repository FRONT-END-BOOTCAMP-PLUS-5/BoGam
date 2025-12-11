'use client';

import { SignupFields } from './SignupFields';
import { useSignupForm } from './useSignupForm';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';
import Button from '@/(anon)/_components/common/button/Button';

export default function SignupForm() {
  const {
    form,
    onSubmit,
    isSubmitting,
    triggerNicknameCheck,
    setTriggerNicknameCheck,
    triggerUsernameCheck,
    setTriggerUsernameCheck,
  } = useSignupForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formRow}>
      <SignupFields
        form={form}
        triggerNicknameCheck={triggerNicknameCheck}
        setTriggerNicknameCheck={setTriggerNicknameCheck}
        triggerUsernameCheck={triggerUsernameCheck}
        setTriggerUsernameCheck={setTriggerUsernameCheck}
      />

      <Button type='submit' fullWidth variant='primary' disabled={isSubmitting}>
        {isSubmitting ? '가입 중...' : '회원가입'}
      </Button>

      <Button href='/signin' variant='ghost' fullWidth>
        로그인
      </Button>
    </form>
  );
}
