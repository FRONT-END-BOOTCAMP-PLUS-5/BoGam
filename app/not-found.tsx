import { Metadata } from 'next';
import clsx from 'clsx';
import { styles } from './not-found.styles';
import GoBackButton from '@/(anon)/_components/notFound/GoBackButton';

// 서버에서 메타데이터 설정
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | Bogam',
  description: '요청하신 URL을 서버에서 찾을 수 없습니다.',
  robots: {
    index: false, // 404 페이지는 검색 결과에서 제외
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>
          <span className="relative z-10">404</span>
          <div className={clsx(styles.errorCodeBottom)}></div>
        </div>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          요청하신 URL을 서버에서 찾을 수 없습니다.
        </p>
        <div className={styles.buttonGroup}>
          <GoBackButton />
        </div>
      </div>
    </div>
  );
}