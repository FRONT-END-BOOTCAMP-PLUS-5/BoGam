import { ChevronLeft } from 'lucide-react';
import SignupForm from '@/(anon)/signup/SignupForm';
import styles from '@/(anon)/signup/Signup.module.css';

export default function Signup() {
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
          <ChevronLeft
            className={`${styles.icon} ${styles.arrow}`}
            aria-hidden
          />
        </div>
      </section>

      <SignupForm />
    </>
  );
}
