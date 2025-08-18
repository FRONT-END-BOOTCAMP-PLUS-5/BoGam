import { ChevronLeft } from 'lucide-react';
import SigninForm from '@/(anon)/signin/_components/SigninForm';
import styles from '@/(anon)/signin/Signin.module.css';

export default function SignIn() {
  return (
    <>
      <section className={styles.intro}>
        <div className={`edge-container ${styles.header}`}>
          <div className={styles.center}>
            <h2 className={styles.title}>로그인</h2>
            <p className={styles.desc}>
              계정에 로그인하여 전세보감의 많은 기능을 이용해보세요!
            </p>
          </div>
          <ChevronLeft
            className={`${styles.icon} ${styles.arrow}`}
            aria-hidden
          />
        </div>
      </section>
      <SigninForm />
    </>
  );
}
