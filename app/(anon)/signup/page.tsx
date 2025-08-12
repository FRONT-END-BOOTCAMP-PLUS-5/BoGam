import SignupForm from '@/(anon)/signup/SignupForm';
import AuthHeader from '@/(anon)/_components/common/header/AuthHeader';
import styles from '@/(anon)/signup/Signup.module.css';

export default function Signup() {
  return (
    <>
      <AuthHeader />
      <section className={`full-bleed ${styles.intro}`}>
        <div className='edge-container'>
          <h2 className={styles.title}>회원가입</h2>
          <p className={styles.desc}>
            아래의 정보를 기입하여 회원가입을 완료해주세요!
          </p>
        </div>
      </section>
      <SignupForm />
    </>
  );
}
